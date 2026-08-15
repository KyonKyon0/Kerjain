import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/current-user';

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
