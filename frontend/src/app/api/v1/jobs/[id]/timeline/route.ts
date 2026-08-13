import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/current-user'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const user = await getCurrentUser(request)
    if (!user) return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 })

    const logs = await prisma.jobProgress.findMany({
      where: { job_id: resolvedParams.id },
      orderBy: { created_at: 'asc' }
    })

    return NextResponse.json({ success: true, data: logs })
  } catch (error: any) {
    return NextResponse.json({ detail: error.message }, { status: 500 })
  }
}
