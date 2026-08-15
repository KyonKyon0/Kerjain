import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/current-user'

export async function PUT(request: Request, { params }: { params: Promise<{ jobId: string }> }) {
  try {
    const resolvedParams = await params;
    const user = await getCurrentUser(request)
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    await prisma.message.updateMany({
      where: {
        jobId: resolvedParams.jobId,
        senderId: { not: user.id },
        read: false
      },
      data: {
        read: true
      }
    })

    return NextResponse.json({ success: true, message: 'Messages marked as read' })
  } catch (error: any) {
    console.error('PUT /api/v1/messages/[jobId]/read error:', error)
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 })
  }
}

