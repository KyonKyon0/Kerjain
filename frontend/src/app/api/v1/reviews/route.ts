import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/current-user'

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user) return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { jobId, rating, comment } = body

    if (!jobId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ detail: 'Rating (1-5) dan ID Pekerjaan wajib diisi' }, { status: 400 })
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { consumer_id: true, partner_id: true, status: true }
    })

    if (!job) {
      return NextResponse.json({ detail: 'Pekerjaan tidak ditemukan' }, { status: 404 })
    }

    if (job.consumer_id !== user.id && job.partner_id !== user.id) {
      return NextResponse.json({ detail: 'Forbidden: Anda bukan bagian dari pekerjaan ini' }, { status: 403 })
    }

    const targetId = user.id === job.consumer_id ? job.partner_id : job.consumer_id
    if (!targetId) {
      return NextResponse.json({ detail: 'Penerima ulasan tidak ditemukan' }, { status: 400 })
    }

    const review = await prisma.review.create({
      data: {
        job_id: jobId,
        reviewer_id: user.id,
        reviewee_id: targetId,
        rating: Math.min(5, Math.max(1, Number(rating))),
        comment: comment ? String(comment).trim().substring(0, 1000) : ''
      }
    })

    return NextResponse.json({ success: true, data: review })
  } catch (error: any) {
    return NextResponse.json({ detail: error.message }, { status: 500 })
  }
}
