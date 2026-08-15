import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/current-user';

export async function GET(request: Request, { params }: { params: Promise<{ jobId: string }> }) {
  try {
    const resolvedParams = await params;
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const messages = await prisma.message.findMany({
      where: { jobId: resolvedParams.jobId },
      include: {
        sender: {
          select: { id: true, name: true, phone: true, role: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({ success: true, data: messages });
  } catch (error: any) {
    console.error('GET /api/v1/messages/[jobId] error:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ jobId: string }> }) {
  try {
    const resolvedParams = await params;
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    if (!body.content || !body.content.trim()) {
      return NextResponse.json({ message: 'Content is required' }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        jobId: resolvedParams.jobId,
        senderId: user.id,
        content: body.content.trim(),
        type: body.type || 'TEXT'
      },
      include: {
        sender: {
          select: { id: true, name: true, phone: true, role: true }
        }
      }
    });

    // Notify recipient in background
    try {
      const job = await prisma.job.findUnique({ where: { id: resolvedParams.jobId } });
      if (job) {
        const recipientId = user.id === job.consumer_id ? job.partner_id : job.consumer_id;
        if (recipientId) {
          await prisma.notifications.create({
            data: {
              user_id: recipientId,
              title: `Pesan baru dari ${user.name} 💬`,
              description: body.content.trim().substring(0, 80),
              type: 'NEW_MESSAGE',
              link: `/dashboard/chat/${resolvedParams.jobId}`,
              read: false
            }
          });
        }
      }
    } catch {}

    return NextResponse.json({ success: true, data: message });
  } catch (error: any) {
    console.error('POST /api/v1/messages/[jobId] error:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}
