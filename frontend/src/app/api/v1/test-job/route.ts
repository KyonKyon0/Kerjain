import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // find a consumer user
    const user = await prisma.user.findFirst({ where: { role: 'consumer' } });
    if (!user) return NextResponse.json({ error: 'No user' });

    const job = await prisma.job.create({
      data: {
        title: "Test Job Error",
        description: "Testing",
        address: "Jakarta",
        lat: null,
        lng: null,
        category: "Reparasi",
        reward_type: "FIXED",
        reward_amount: 50000,
        consumer_id: user.id,
        status: "WAITING_PAYMENT"
      }
    });

    /*const payment = await prisma.payment.create({
      data: {
        job_id: job.id,
        consumer_id: user.id,
        amount: 50000,
        method: 'QRIS',
        status: 'UNPAID'
      }
    });*/

    return NextResponse.json({ success: true, job });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, stack: error.stack });
  }
}
