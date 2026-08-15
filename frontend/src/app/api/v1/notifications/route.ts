import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/current-user';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });

    const list = await prisma.notifications.findMany({
      where: { user_id: user.id },
      orderBy: { created_at: 'desc' },
      take: 50
    });

    const formatted = list.map(n => ({
      id: n.id,
      userId: n.user_id,
      title: n.title,
      description: n.description,
      type: n.type,
      link: n.link,
      read: n.read,
      createdAt: n.created_at.toISOString()
    }));

    return NextResponse.json({ success: true, message: "Daftar notifikasi", data: formatted });
  } catch (error: any) {
    console.error("GET /api/v1/notifications error:", error);
    return NextResponse.json({ detail: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { userId, title, description, type, link } = body;

    const notif = await prisma.notifications.create({
      data: {
        user_id: userId || user.id,
        title: title || 'Pemberitahuan',
        description: description || '',
        type: type || 'SYSTEM',
        link: link || null
      }
    });

    return NextResponse.json({ success: true, data: notif });
  } catch (error: any) {
    console.error("POST /api/v1/notifications error:", error);
    return NextResponse.json({ detail: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });

    await prisma.notifications.updateMany({
      where: { user_id: user.id, read: false },
      data: { read: true }
    });

    return NextResponse.json({ success: true, message: 'Semua notifikasi ditandai dibaca' });
  } catch (error: any) {
    return NextResponse.json({ detail: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });

    await prisma.notifications.deleteMany({
      where: { user_id: user.id }
    });

    return NextResponse.json({ success: true, message: 'Semua notifikasi dihapus' });
  } catch (error: any) {
    return NextResponse.json({ detail: error.message }, { status: 500 });
  }
}

