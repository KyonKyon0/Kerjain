import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/current-user';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const type = searchParams.get('type'); // "my-jobs" or "partner-jobs"

    let whereClause: any = {};

    if (type === 'my-jobs') {
      whereClause.consumer_id = user.id;
    } else if (type === 'partner-jobs') {
      whereClause.partner_id = user.id;
    } else if (user.role === 'partner') {
      whereClause.status = 'PUBLISHED'; // Default view for partners looking for jobs
    }

    if (status) whereClause.status = status;
    if (category) whereClause.category = category;
    if (keyword) {
      whereClause.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } }
      ];
    }

    const jobs = await prisma.job.findMany({
      where: whereClause,
      orderBy: { created_at: 'desc' },
      include: {
        consumer: { select: { id: true, name: true, phone: true } },
        partner: { select: { id: true, name: true, phone: true } }
      }
    });

    const mappedJobs = jobs.map((j: any) => ({
      ...j,
      photoUrl: j.photo_url || null,
      rewardAmount: j.reward_amount ? Number(j.reward_amount) : 0,
      consumerName: j.consumer?.name || '',
      consumerPhone: j.consumer?.phone || '',
      partnerName: j.partner?.name || '',
      partnerPhone: j.partner?.phone || ''
    }));

    return NextResponse.json({ success: true, message: 'Daftar pekerjaan', data: mappedJobs });
  } catch (error: any) {
    return NextResponse.json({ detail: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user || user.role !== 'consumer') return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const paymentMethod = body.paymentMethod || 'CASH';
    const status = paymentMethod === 'QRIS' ? 'WAITING_PAYMENT' : 'PUBLISHED';
    const photo = body.photoUrl || body.photo_url || null;

    let job: any;

    try {
      job = await prisma.job.create({
        data: {
          title: body.title,
          description: body.description,
          address: body.address,
          lat: body.lat ? Number(body.lat) : null,
          lng: body.lng ? Number(body.lng) : null,
          photo_url: photo,
          category: body.category || 'Umum',
          reward_type: body.rewardType || 'FIXED',
          reward_amount: body.rewardAmount ? Number(body.rewardAmount) : null,
          consumer: { connect: { id: user.id } },
          status: status
        }
      });
    } catch {
      // Fallback if Prisma client runtime has not refreshed fields
      job = await prisma.job.create({
        data: {
          title: body.title,
          description: body.description,
          address: body.address,
          lat: body.lat ? Number(body.lat) : null,
          lng: body.lng ? Number(body.lng) : null,
          category: body.category || 'Umum',
          reward_type: body.rewardType || 'FIXED',
          reward_amount: body.rewardAmount ? Number(body.rewardAmount) : null,
          consumer: { connect: { id: user.id } },
          status: status
        }
      });

      if (photo) {
        try {
          await prisma.$executeRawUnsafe(
            `UPDATE jobs SET photo_url = $1 WHERE id = $2::uuid;`,
            photo,
            job.id
          );
          job.photo_url = photo;
        } catch {}
      }
    }

    let payment = null;
    if (paymentMethod === 'QRIS') {
      const amount = body.rewardAmount ? Number(body.rewardAmount) : 0;
      payment = await prisma.payment.create({
        data: {
          job_id: job.id,
          consumer_id: user.id,
          amount: amount,
          method: 'QRIS',
          status: 'UNPAID',
        }
      });
    }


    return NextResponse.json({ 
      success: true, 
      message: 'Pekerjaan berhasil dibuat', 
      data: { 
        job: { ...job, photoUrl: job.photo_url || photo }, 
        payment 
      } 
    });
  } catch (error: any) {
    console.error("POST /api/v1/jobs error:", error);
    return NextResponse.json({ detail: error.message }, { status: 500 });
  }
}
