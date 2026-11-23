import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/current-user';
import { validateBase64Image } from '@/lib/payload-validator';

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

    // Action Router with Strict Zero-Trust Authorization
    switch (action) {
      case 'accept':
        if (user.role !== 'partner') {
          return NextResponse.json({ message: 'Hanya mitra yang dapat menerima pekerjaan', detail: 'Hanya mitra yang dapat menerima pekerjaan' }, { status: 403 });
        }
        if (job.consumer_id === user.id) {
          return NextResponse.json({ message: 'Anda tidak dapat menerima pekerjaan yang Anda buat sendiri', detail: 'Invalid operation' }, { status: 400 });
        }

        // Atomic conditional update to eliminate double-accept race conditions
        const acceptUpdate = await prisma.job.updateMany({
          where: {
            id,
            status: 'PUBLISHED',
            partner_id: null,
            consumer_id: { not: user.id }
          },
          data: {
            partner_id: user.id,
            status: 'ACCEPTED'
          }
        });

        if (acceptUpdate.count === 0) {
          return NextResponse.json({ message: 'Pekerjaan sudah diambil mitra lain atau tidak tersedia', detail: 'Job not available' }, { status: 400 });
        }

        updatedJob = await prisma.job.findUnique({ where: { id } });
        await prisma.payment.updateMany({
          where: { job_id: id },
          data: { partner_id: user.id }
        });

        // Add progress log for accepted
        try {
          await prisma.jobProgress.create({
            data: {
              job_id: id,
              status_snapshot: 'ACCEPTED',
              note: `Pekerjaan diambil oleh mitra ${user.name}`,
              created_at: new Date()
            }
          });
        } catch {}

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
        if (user.role !== 'partner' || job.partner_id !== user.id) {
          return NextResponse.json({ message: 'Forbidden: Bukan mitra yang ditugaskan', detail: 'Unauthorized' }, { status: 403 });
        }
        updatedJob = await prisma.job.update({
          where: { id },
          data: { status: 'WORKING' }
        });

        try {
          await prisma.jobProgress.create({
            data: {
              job_id: id,
              status_snapshot: 'WORKING',
              note: `Mitra telah mulai mengerjakan tugas`,
              created_at: new Date()
            }
          });
        } catch {}

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
        if (user.role !== 'partner' || job.partner_id !== user.id) {
          return NextResponse.json({ message: 'Forbidden: Bukan mitra yang ditugaskan', detail: 'Unauthorized' }, { status: 403 });
        }
        updatedJob = await prisma.job.update({
          where: { id },
          data: { status: 'WAITING_CONFIRMATION' }
        });

        try {
          await prisma.jobProgress.create({
            data: {
              job_id: id,
              status_snapshot: 'WAITING_CONFIRMATION',
              note: `Mitra telah menyelesaikan pekerjaan dan menunggu konfirmasi`,
              created_at: new Date()
            }
          });
        } catch {}

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
        if (user.role !== 'consumer' || job.consumer_id !== user.id) {
          return NextResponse.json({ message: 'Forbidden: Hanya konsumen pemilik pekerjaan yang dapat konfirmasi', detail: 'Unauthorized' }, { status: 403 });
        }

        // Atomic transaction: guard against double-credit on SlideToConfirm
        const confirmResult = await prisma.$transaction(async (tx) => {
          const updateRes = await tx.job.updateMany({
            where: {
              id,
              consumer_id: user.id,
              status: { not: 'COMPLETED' }
            },
            data: { status: 'COMPLETED' }
          });

          if (updateRes.count === 0) {
            return { alreadyCompleted: true };
          }

          // Release funds if QRIS and SUCCESS (only on first confirmation)
          const confirmPayment = await tx.payment.findFirst({ where: { job_id: id } });
          if (confirmPayment && confirmPayment.method === 'QRIS' && confirmPayment.status === 'SUCCESS' && job.partner_id) {
            await tx.wallet.upsert({
              where: { user_id: job.partner_id },
              update: { balance: { increment: Number(confirmPayment.amount) } },
              create: { user_id: job.partner_id, balance: Number(confirmPayment.amount) }
            });
          }

          return { alreadyCompleted: false };
        });

        if (confirmResult.alreadyCompleted) {
          return NextResponse.json({ message: 'Pekerjaan sudah dikonfirmasi selesai sebelumnya', detail: 'Already completed' }, { status: 400 });
        }

        updatedJob = await prisma.job.findUnique({ where: { id } });

        try {
          await prisma.jobProgress.create({
            data: {
              job_id: id,
              status_snapshot: 'COMPLETED',
              note: `Pekerjaan telah dikonfirmasi selesai oleh konsumen`,
              created_at: new Date()
            }
          });
        } catch {}

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
        if (user.role !== 'consumer' || job.consumer_id !== user.id) {
          return NextResponse.json({ message: 'Forbidden: Hanya konsumen pemilik pekerjaan yang dapat meminta revisi', detail: 'Unauthorized' }, { status: 403 });
        }
        updatedJob = await prisma.job.update({
          where: { id },
          data: { status: 'WORKING' }
        });

        try {
          await prisma.jobProgress.create({
            data: {
              job_id: id,
              status_snapshot: 'REVISION_REQUESTED',
              note: `Konsumen meminta penyesuaian/revisi pekerjaan`,
              created_at: new Date()
            }
          });
        } catch {}

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
        if (job.consumer_id !== user.id && job.partner_id !== user.id) {
          return NextResponse.json({ message: 'Forbidden: Anda tidak memiliki akses untuk membatalkan pekerjaan ini', detail: 'Unauthorized' }, { status: 403 });
        }
        if (job.status === 'COMPLETED') {
          return NextResponse.json({ message: 'Pekerjaan yang sudah selesai tidak dapat dibatalkan', detail: 'Cannot cancel completed job' }, { status: 400 });
        }
        updatedJob = await prisma.job.update({
          where: { id },
          data: { status: 'CANCELLED' }
        });
        break;

      case 'status':
        if (job.consumer_id !== user.id && job.partner_id !== user.id) {
          return NextResponse.json({ message: 'Forbidden: Anda tidak memiliki akses ke pekerjaan ini', detail: 'Unauthorized' }, { status: 403 });
        }
        const statusBody = await request.json();
        updatedJob = await prisma.job.update({
          where: { id },
          data: { status: statusBody.status }
        });
        break;

      case 'progress':
        if (user.role !== 'partner' || job.partner_id !== user.id) {
          return NextResponse.json({ detail: 'Forbidden: Hanya mitra yang ditugaskan yang dapat memperbarui progres' }, { status: 403 });
        }
        const body = await request.json();
        const progressPhoto = body.photoUrl || body.photo_url || null;
        let progress: any;

        if (progressPhoto) {
          const valid = validateBase64Image(progressPhoto);
          if (!valid.valid) {
            return NextResponse.json({ detail: valid.error }, { status: 400 });
          }
        }
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

    const freshJob: any = await prisma.job.findUnique({
      where: { id },
      include: {
        consumer: { select: { id: true, name: true, phone: true } },
        partner: { select: { id: true, name: true, phone: true } },
        progress_logs: { orderBy: { created_at: 'asc' } },
        payments: { orderBy: { created_at: 'desc' }, take: 1 }
      }
    });

    const mappedJob = freshJob ? {
      ...freshJob,
      photoUrl: freshJob.photo_url || null,
      rewardAmount: freshJob.reward_amount ? Number(freshJob.reward_amount) : 0,
      consumerName: freshJob.consumer?.name || '',
      consumerPhone: freshJob.consumer?.phone || '',
      partnerName: freshJob.partner?.name || '',
      partnerPhone: freshJob.partner?.phone || ''
    } : updatedJob;

    return NextResponse.json({ success: true, message: `Action ${action} successful`, data: mappedJob });
  } catch (error: any) {
    return NextResponse.json({ message: error.message, detail: error.message }, { status: 500 });
  }
}
