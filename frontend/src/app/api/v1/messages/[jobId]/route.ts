import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/current-user'

export async function GET(request: Request, { params }: { params: Promise<{ jobId: string }> }) {
  try {
    const resolvedParams = await params;
    const user = await getCurrentUser(request)
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const messages = await prisma.message.findMany({
      where: { jobId: resolvedParams.jobId },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json({ success: true, data: messages })
  } catch (error: any) {
    require('fs').writeFileSync('debug.log', error.stack || error.message);
    return NextResponse.json({ message: error.message, stack: error.stack }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ jobId: string }> }) {
  try {
    const resolvedParams = await params;
    const user = await getCurrentUser(request)
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    if (!body.content) return NextResponse.json({ message: 'Content is required' }, { status: 400 })

    const message = await prisma.message.create({
      data: {
        jobId: resolvedParams.jobId,
        senderId: user.id,
        content: body.content
      }
    })

    return NextResponse.json({ success: true, data: message })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
