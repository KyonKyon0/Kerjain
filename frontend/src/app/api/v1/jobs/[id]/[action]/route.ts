import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/current-user';

export async function POST(request: Request, { params }: { params: Promise<{ id: string, action: string }> }) {
  return handleAction(request, params);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string, action: string }> }) {
  return handleAction(request, params);
}

async function handleAction(request: Request, params: Promise<{ id: string, action: string }>) {
  try {
    const resolvedParams = await params;
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });

    const { id, action } = resolvedParams;
    const job = await prisma.job.findUnique({ where: { id } });
    
    if (!job) return NextResponse.json({ detail: 'Job not found' }, { status: 404 });

    let updatedJob;

    // Action Router
    switch (action) {
      case 'accept':
        if (user.role !== 'partner') return NextResponse.json({ message: 'Only partners can accept', detail: 'Only partners can accept' }, { status: 403 });
        updatedJob = await prisma.job.update({
          where: { id },
          data: { partner: { connect: { id: user.id } }, status: 'ACCEPTED' }
        });
        await prisma.payment.updateMany({
          where: { job_id: id },
          data: { partner_id: user.id }
        });

        // Notify Consumer
        try {
          await prisma.notifications.create({
            data: {
              user_id: job.consumer_id,
              title: 'Pekerjaan Diterima Mitra! 🛵',
              description: `Mitra ${user.name} telah menerima dan mengambil pekerjaan "${job.title}".`,
              type: 'JOB_ACCEPTED',
              link: `/dashboard/jobs/${id}`,
              read: false
            }
          });
        } catch {}
        break;
      
      case 'start':
        if (user.role !== 'partner') return NextResponse.json({ message: 'Unauthorized', detail: 'Unauthorized' }, { status: 403 });
        updatedJob = await prisma.job.update({
          where: { id },
          data: { status: 'WORKING' }
        });

        // Notify Consumer
        try {
          await prisma.notifications.create({
            data: {
              user_id: job.consumer_id,
              title: 'Mitra Mulai Bekerja 🛠️',
              description: `Mitra ${user.name} telah mulai mengerjakan "${job.title}".`,
              type: 'STATUS_CHANGED',
              link: `/dashboard/jobs/${id}`,
              read: false
            }
          });
        } catch {}
        break;

      case 'finish':
        if (user.role !== 'partner') return NextResponse.json({ message: 'Unauthorized', detail: 'Unauthorized' }, { status: 403 });
        updatedJob = await prisma.job.update({
          where: { id },
          data: { status: 'WAITING_CONFIRMATION' }
        });

        // Notify Consumer
        try {
          await prisma.notifications.create({
            data: {
              user_id: job.consumer_id,
              title: 'Pekerjaan Telah Diselesaikan Mitra! 📋',
              description: `Mitra telah menyelesaikan "${job.title}". Silakan periksa hasil kerja dan konfirmasi penyelesaian.`,
              type: 'STATUS_CHANGED',
              link: `/dashboard/jobs/${id}`,
              read: false
            }
          });
        } catch {}
        break;

      case 'confirm':
        if (user.role !== 'consumer') return NextResponse.json({ message: 'Unauthorized', detail: 'Unauthorized' }, { status: 403 });
        updatedJob = await prisma.job.update({
          where: { id },
          data: { status: 'COMPLETED' }
        });
        
        // Release funds if QRIS and SUCCESS
        const confirmPayment = await prisma.payment.findFirst({ where: { job_id: id } });
        if (confirmPayment && confirmPayment.method === 'QRIS' && confirmPayment.status === 'SUCCESS' && updatedJob.partner_id) {
           await prisma.wallet.upsert({
             where: { user_id: updatedJob.partner_id },
             update: { balance: { increment: Number(confirmPayment.amount) } },
             create: { user_id: updatedJob.partner_id, balance: Number(confirmPayment.amount) }
           });
        }

        // Notify Partner
        if (job.partner_id) {
          try {
            await prisma.notifications.create({
              data: {
                user_id: job.partner_id,
                title: 'Pekerjaan Selesai & Dana Cair! 🎉',
                description: `Konsumen telah mengonfirmasi penyelesaian "${job.title}".`,
                type: 'JOB_COMPLETED',
                link: `/dashboard/jobs/${id}`,
                read: false
              }
            });
          } catch {}
        }
        break;

      case 'revise':
        if (user.role !== 'consumer') return NextResponse.json({ message: 'Unauthorized', detail: 'Unauthorized' }, { status: 403 });
        updatedJob = await prisma.job.update({
          where: { id },
          data: { status: 'WORKING' }
        });

        if (job.partner_id) {
          try {
            await prisma.notifications.create({
              data: {
                user_id: job.partner_id,
                title: 'Permintaan Revisi Pekerjaan ⚠️',
                description: `Konsumen meminta penyesuaian atau revisi pada pekerjaan "${job.title}".`,
                type: 'STATUS_CHANGED',
                link: `/dashboard/jobs/${id}`,
                read: false
              }
            });
          } catch {}
        }
        break;

      case 'cancel':
        updatedJob = await prisma.job.update({
          where: { id },
          data: { status: 'CANCELLED' }
        });
        break;

      case 'status':
        const statusBody = await request.json();
        updatedJob = await prisma.job.update({
          where: { id },
          data: { status: statusBody.status }
        });
        break;

      case 'progress':
        if (user.role !== 'partner') return NextResponse.json({ detail: 'Unauthorized' }, { status: 403 });
        const body = await request.json();
        
        // Update job status if provided in body
        if (body.status && body.status !== job.status) {
          await prisma.job.update({
            where: { id },
            data: { status: body.status }
          });
        }

        let progress: any;
        const progressPhoto = body.photoUrl || body.photo_url || null;
        try {
          progress = await prisma.jobProgress.create({
            data: {
              job_id: id,
              status_snapshot: body.status || job.status,
              note: body.note,
              photo_url: progressPhoto,
              created_at: new Date()
            }
          });
        } catch {
          progress = await prisma.jobProgress.create({
            data: {
              job_id: id,
              status_snapshot: body.status || job.status,
              note: body.note,
              created_at: new Date()
            }
          });
          if (progressPhoto) {
            try {
              await prisma.$executeRawUnsafe(
                `UPDATE job_progress_logs SET photo_url = $1 WHERE id = $2;`,
                progressPhoto,
                progress.id
              );
              progress.photo_url = progressPhoto;
            } catch {}
          }
        }


        // Notify Consumer on progress update
        try {
          await prisma.notifications.create({
            data: {
              user_id: job.consumer_id,
              title: `Update Progres: ${body.status || 'Pekerjaan'} 📸`,
              description: body.note || `Mitra memperbarui progres pada "${job.title}".`,
              type: 'STATUS_CHANGED',
              link: `/dashboard/jobs/${id}`,
              read: false
            }
          });
        } catch {}

        return NextResponse.json({ success: true, message: 'Progres berhasil ditambahkan', data: progress });

      default:
        return NextResponse.json({ detail: 'Action not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Action ${action} successful`, data: updatedJob });
  } catch (error: any) {
    return NextResponse.json({ message: error.message, detail: error.message }, { status: 500 });
  }
}
