import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/current-user'

export async function POST(request: Request, { params }: { params: Promise<{ job_id: string }> }) {
  try {
    const resolvedParams = await params;
    const user = await getCurrentUser(request)
    if (!user || user.role !== 'consumer') return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 })

    const payment = await prisma.payment.findFirst({
      where: { job_id: resolvedParams.job_id }
    });

    if (!payment) {
      return NextResponse.json({ detail: 'Payment not found' }, { status: 404 })
    }

    if (payment.status === 'SUCCESS') {
      return NextResponse.json({ success: true, status: 'SUCCESS' })
    }

    if (payment.method !== 'QRIS') {
      return NextResponse.json({ detail: 'Hanya bisa mengecek status QRIS' }, { status: 400 })
    }

    // Call Pakasir API
    const baseUrl = (process.env.PAKASIR_API_URL || 'https://app.pakasir.com/api').replace(/\/$/, '');
    const url = `${baseUrl}/transactiondetail?project=${process.env.PAKASIR_SLUG || 'yuku-store'}&order_id=${payment.id}&amount=${Math.floor(Number(payment.amount))}&api_key=${process.env.PAKASIR_API_KEY || '8E5kymEMfwjvUjOeTHJomL1p4lBZvDIu'}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Pakasir API Error:", errorText);
      return NextResponse.json({ success: true, status: 'UNPAID' })
    }

    const result = await response.json();

    if (result.transaction && result.transaction.status === 'completed') {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'SUCCESS', paid_at: new Date() }
        }),
        prisma.job.update({
          where: { id: payment.job_id },
          data: { status: 'PUBLISHED' }
        })
      ]);
      return NextResponse.json({ success: true, status: 'SUCCESS' })
    }

    return NextResponse.json({ success: true, status: 'UNPAID' })
  } catch (error: any) {
    console.error("Check Route Error:", error)
    return NextResponse.json({ detail: error.message }, { status: 500 })
  }
}
