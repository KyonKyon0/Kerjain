import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/current-user'

export async function POST(request: Request, { params }: { params: Promise<{ job_id: string }> }) {
  try {
    const resolvedParams = await params;
    const user = await getCurrentUser(request)
    if (!user || user.role !== 'consumer') return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 })

    // Simulate payment processing
    const payment = await prisma.payment.updateMany({
      where: { job_id: resolvedParams.job_id, consumer_id: user.id, status: 'UNPAID' },
      data: { status: 'SUCCESS', paid_at: new Date() }
    })

    if (payment.count > 0) {
      await prisma.job.updateMany({
        where: { id: resolvedParams.job_id, consumer_id: user.id, status: 'WAITING_PAYMENT' },
        data: { status: 'PUBLISHED' }
      })
    }

    if (payment.count === 0) {
      return NextResponse.json({ detail: 'Payment not found or already paid' }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: 'Pembayaran berhasil' })
  } catch (error: any) {
    return NextResponse.json({ detail: error.message }, { status: 500 })
  }
}
