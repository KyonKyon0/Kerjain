import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/current-user'

export async function GET(request: Request, { params }: { params: Promise<{ job_id: string }> }) {
  try {
    const resolvedParams = await params;
    const user = await getCurrentUser(request)
    if (!user) return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 })

    const payment = await prisma.payment.findFirst({
      where: { 
        job_id: resolvedParams.job_id,
        OR: [
          { consumer_id: user.id },
          { partner_id: user.id }
        ]
      },
      orderBy: { created_at: 'desc' }
    })

    if (!payment) return NextResponse.json({ detail: 'Payment not found' }, { status: 404 })

    return NextResponse.json({ success: true, message: 'Detail pembayaran', data: payment })
  } catch (error: any) {
    return NextResponse.json({ detail: error.message }, { status: 500 })
  }
}
