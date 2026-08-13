import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/current-user'

export async function POST(request: Request, { params }: { params: Promise<{ job_id: string }> }) {
  try {
    const resolvedParams = await params;
    const user = await getCurrentUser(request)
    if (!user || user.role !== 'consumer') return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 })

    const payment = await prisma.payment.findFirst({
      where: { job_id: resolvedParams.job_id, status: 'UNPAID' }
    });

    if (!payment) {
      return NextResponse.json({ detail: 'Payment not found or already paid' }, { status: 400 })
    }

    // Call Pakasir API
    const baseUrl = (process.env.PAKASIR_API_URL || 'https://app.pakasir.com/api').replace(/\/$/, '');
    const method = process.env.PAKASIR_METHOD || 'qris';
    const url = `${baseUrl}/transactioncreate/${method}`;
    
    const payload = {
      project: process.env.PAKASIR_SLUG || 'yuku-store',
      order_id: payment.id,
      amount: Math.floor(Number(payment.amount)),
      api_key: process.env.PAKASIR_API_KEY || '8E5kymEMfwjvUjOeTHJomL1p4lBZvDIu'
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Pakasir API Error:", errorText);
      
      let parsedMessage = null;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.message) {
          if (errorJson.message.toLowerCase().includes("already completed") || errorJson.message.toLowerCase().includes("already paid")) {
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
            return NextResponse.json({ success: true, already_completed: true });
          }
          parsedMessage = errorJson.message;
        }
      } catch (e) {}

      throw new Error(parsedMessage || "Gagal membuat transaksi QRIS di gateway pembayaran");
    }

    const result = await response.json();

    if (!result.payment || !result.payment.payment_number) {
      throw new Error("Tautan pembayaran tidak ditemukan dari gateway");
    }

    if (payment.method !== 'QRIS') {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { method: 'QRIS' }
      });
    }

    return NextResponse.json({ success: true, payment_number: result.payment.payment_number, total_payment: result.payment.total_payment || payment.amount })
  } catch (error: any) {
    console.error("QRIS Route Error:", error)
    return NextResponse.json({ detail: error.message }, { status: 500 })
  }
}
