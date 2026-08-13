import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/current-user'

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user) return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 })

    const jobs = await prisma.job.findMany({
      where: { consumer_id: user.id },
      include: {
        consumer: { select: { id: true, name: true, phone: true } },
        partner: { select: { id: true, name: true, phone: true } }
      },
      orderBy: { created_at: 'desc' }
    })

    return NextResponse.json({ success: true, data: jobs })
  } catch (error: any) {
    return NextResponse.json({ detail: error.message }, { status: 500 })
  }
}
