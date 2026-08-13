import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/current-user'

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user) return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const keyword = searchParams.get('keyword')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const type = searchParams.get('type') // "my-jobs" or "partner-jobs"

    let whereClause: any = {}

    if (type === 'my-jobs') {
      whereClause.consumer_id = user.id
    } else if (type === 'partner-jobs') {
      whereClause.partner_id = user.id
    } else if (user.role === 'partner') {
      whereClause.status = 'PUBLISHED' // Default view for partners looking for jobs
    }

    if (status) whereClause.status = status
    if (category) whereClause.category = category
    if (keyword) {
      whereClause.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } }
      ]
    }

    const jobs = await prisma.job.findMany({
      where: whereClause,
      orderBy: { created_at: 'desc' },
      include: {
        consumer: { select: { id: true, name: true, phone: true } },
        partner: { select: { id: true, name: true, phone: true } }
      }
    })

    return NextResponse.json({ success: true, message: 'Daftar pekerjaan', data: jobs })
  } catch (error: any) {
    return NextResponse.json({ detail: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user || user.role !== 'consumer') return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const paymentMethod = body.paymentMethod || 'CASH'
    const status = paymentMethod === 'QRIS' ? 'WAITING_PAYMENT' : 'PUBLISHED'

    const job = await prisma.job.create({
      data: {
        title: body.title,
        description: body.description,
        address: body.address,
        lat: body.lat,
        lng: body.lng,
        category: body.category,
        reward_type: body.rewardType || 'FIXED',
        reward_amount: body.rewardAmount || null,
        consumer: { connect: { id: user.id } },
        status: status
      }
    })

    let payment = null
    if (paymentMethod === 'QRIS') {
      const amount = body.rewardAmount ? Number(body.rewardAmount) : 0
      const paymentId = crypto.randomUUID()
      await prisma.$executeRaw`
        INSERT INTO "payments" ("id", "job_id", "consumer_id", "amount", "method", "status", "created_at", "updated_at")
        VALUES (${paymentId}::uuid, ${job.id}::uuid, ${user.id}::uuid, ${amount}, 'QRIS'::payment_method, 'UNPAID'::payment_status, NOW(), NOW())
      `
      
      payment = await prisma.payment.findUnique({ where: { id: paymentId } })
    }

    return NextResponse.json({ success: true, message: 'Pekerjaan berhasil dibuat', data: { job, payment } })
  } catch (error: any) {
    console.error("POST /api/v1/jobs error:", error);
    return NextResponse.json({ detail: error.message }, { status: 500 })
  }
}
