import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/current-user'

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user) return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { jobId, targetId, rating, comment } = body

    const review = await prisma.review.create({
      data: {
        job_id: jobId,
        reviewer_id: user.id,
        reviewee_id: targetId,
        rating,
        comment
      }
    })

    return NextResponse.json({ success: true, data: review })
  } catch (error: any) {
    return NextResponse.json({ detail: error.message }, { status: 500 })
  }
}
