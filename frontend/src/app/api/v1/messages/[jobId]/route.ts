import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/current-user';

// App Router route segment config — increase body size for image uploads
export const maxDuration = 30;


export async function GET(request: Request, { params }: { params: Promise<{ jobId: string }> }) {
  try {
    const resolvedParams = await params;
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const job = await prisma.job.findUnique({
      where: { id: resolvedParams.jobId },
      select: { consumer_id: true, partner_id: true }
    });

    if (!job || (job.consumer_id !== user.id && job.partner_id !== user.id)) {
      return NextResponse.json({ message: 'Forbidden: Anda bukan anggota percakapan pekerjaan ini' }, { status: 403 });
    }

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

    const job = await prisma.job.findUnique({
      where: { id: resolvedParams.jobId },
      select: { consumer_id: true, partner_id: true }
    });

    if (!job || (job.consumer_id !== user.id && job.partner_id !== user.id)) {
      return NextResponse.json({ message: 'Forbidden: Anda bukan anggota percakapan pekerjaan ini' }, { status: 403 });
    }

    const body = await request.json();
    if (!body.content || (typeof body.content === 'string' && !body.content.trim())) {
      return NextResponse.json({ message: 'Content is required' }, { status: 400 });
    }

    // Detect if content is an image (base64 data URL)
    const isImage = typeof body.content === 'string' && body.content.startsWith('data:image');

    const message = await prisma.message.create({
      data: {
        jobId: resolvedParams.jobId,
        senderId: user.id,
        content: body.content,
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
      const recipientId = user.id === job.consumer_id ? job.partner_id : job.consumer_id;
      if (recipientId) {
        await prisma.notifications.create({
          data: {
            user_id: recipientId,
            title: `Pesan baru dari ${user.name} 💬`,
            description: isImage ? '📷 Mengirim foto' : body.content.trim().substring(0, 80),
            type: 'NEW_MESSAGE',
            link: `/dashboard/chat/${resolvedParams.jobId}`,
            read: false
          }
        });
      }
    } catch {}

    return NextResponse.json({ success: true, data: message });
  } catch (error: any) {
    console.error('POST /api/v1/messages/[jobId] error:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}
