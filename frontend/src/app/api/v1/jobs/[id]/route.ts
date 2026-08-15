import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/current-user';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });

    const job: any = await prisma.job.findUnique({
      where: { id: resolvedParams.id },
      include: {
        consumer: { select: { id: true, name: true, phone: true } },
        partner: { select: { id: true, name: true, phone: true } },
        progress_logs: { orderBy: { created_at: 'asc' } },
        payments: { orderBy: { created_at: 'desc' }, take: 1 }
      }
    });

    if (!job) return NextResponse.json({ detail: 'Job not found' }, { status: 404 });

    const mappedJob = {
      ...job,
      photoUrl: job.photo_url || null,
      rewardAmount: job.reward_amount ? Number(job.reward_amount) : 0,
      consumerName: job.consumer?.name || '',
      consumerPhone: job.consumer?.phone || '',
      partnerName: job.partner?.name || '',
      partnerPhone: job.partner?.phone || ''
    };

    return NextResponse.json({ success: true, message: 'Detail pekerjaan', data: mappedJob });
  } catch (error: any) {
    return NextResponse.json({ detail: error.message }, { status: 500 });
  }
}
