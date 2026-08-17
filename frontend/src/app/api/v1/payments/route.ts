import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/current-user'

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user) return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 })

    const payments = await prisma.payment.findMany({
      where: user.role === 'consumer' ? { consumer_id: user.id } : { partner_id: user.id },
      include: {
        job: { select: { id: true, title: true, status: true, created_at: true } },
        partner: { select: { id: true, name: true, phone: true } },
        consumer: { select: { id: true, name: true, phone: true } }
      },
      orderBy: { created_at: 'desc' },
      take: 50
    })

    return NextResponse.json({ success: true, message: 'Daftar pembayaran', data: payments })
  } catch (error: any) {
    console.error('GET /api/v1/payments error:', error)
    return NextResponse.json({ detail: error.message }, { status: 500 })
  }
}


export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user || user.role !== 'consumer') return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { job_id, amount, method } = body

    const job = await prisma.job.findUnique({ where: { id: job_id } })
    if (!job || !job.partner_id) return NextResponse.json({ detail: 'Job not found or no partner' }, { status: 404 })

    let payment = await prisma.payment.findFirst({
      where: { job_id, status: 'UNPAID' }
    });

    if (payment) {
      payment = await prisma.payment.update({
        where: { id: payment.id },
        data: { amount, method }
      });
    } else {
      payment = await prisma.payment.create({
        data: {
          job_id: job_id,
          consumer_id: user.id,
          partner_id: job.partner_id || null,
          amount: amount,
          method: method || 'CASH',
          status: 'UNPAID',
        }
      });
    }


    return NextResponse.json({ success: true, message: 'Tagihan berhasil dibuat', data: payment })
  } catch (error: any) {
    return NextResponse.json({ detail: error.message }, { status: 500 })
  }
}
