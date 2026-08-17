import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/current-user';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });


    const logs = await prisma.jobProgress.findMany({
      where: { job_id: resolvedParams.id },
      orderBy: { created_at: 'asc' }
    });

    // Map logs to guarantee valid createdAt strings
    const mappedLogs = logs.map((log) => ({
      ...log,
      createdAt: log.created_at ? log.created_at.toISOString() : new Date().toISOString(),
      statusSnapshot: log.status_snapshot,
      photoUrl: log.photo_url
    }));

    return NextResponse.json({ success: true, data: mappedLogs });
  } catch (error: any) {
    console.error('GET /api/v1/jobs/[id]/timeline error:', error);
    return NextResponse.json({ detail: error.message }, { status: 500 });
  }
}
