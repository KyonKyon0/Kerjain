import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/current-user';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'partner') return NextResponse.json({ detail: 'Only partners can access wallet' }, { status: 403 });

    // 1. Get Wallet Balance
    let wallet = await prisma.wallet.findUnique({
      where: { user_id: user.id }
    });
    
    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { user_id: user.id, balance: 0 }
      });
    }

    // 2. Fetch Income (QRIS Payments with SUCCESS status for COMPLETED jobs)
    const payments = await prisma.payment.findMany({
      where: {
        partner_id: user.id,
        method: 'QRIS',
        status: 'SUCCESS',
        job: {
          status: 'COMPLETED'
        }
      },
      include: {
        job: {
          select: { title: true, updated_at: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    // 3. Fetch Withdrawals
    const withdrawals = await prisma.withdrawal.findMany({
      where: { user_id: user.id },
      orderBy: { created_at: 'desc' }
    });

    // 4. Transform and Combine to Ledger
    type Transaction = {
      id: string;
      type: 'INCOME' | 'WITHDRAWAL';
      amount: number;
      date: Date;
      description: string;
      status: string;
    };

    const ledger: Transaction[] = [];

    let firstIncomeDate: Date | null = null;

    payments.forEach(p => {
      const releaseDate = p.job.updated_at;
      if (!firstIncomeDate || releaseDate < firstIncomeDate) {
        firstIncomeDate = releaseDate;
      }

      ledger.push({
        id: p.id,
        type: 'INCOME',
        amount: Number(p.amount),
        date: releaseDate,
        description: `Pembayaran Pekerjaan: ${p.job.title}`,
        status: 'COMPLETED'
      });
    });

    withdrawals.forEach(w => {
      ledger.push({
        id: w.id,
        type: 'WITHDRAWAL',
        amount: Number(w.amount),
        date: w.created_at,
        description: `Penarikan Dana ke ${w.bank_name || 'Bank'}`,
        status: w.status
      });
    });

    ledger.sort((a, b) => b.date.getTime() - a.date.getTime());

    // 5. Calculate T+3 rules
    let canWithdraw = false;
    let daysRemaining = 0;

    if (firstIncomeDate) {
      const msInDay = 1000 * 60 * 60 * 24;
      const now = new Date();
      const diffMs = now.getTime() - firstIncomeDate.getTime();
      const diffDays = diffMs / msInDay;
      
      if (diffDays >= 3) {
        canWithdraw = true;
      } else {
        daysRemaining = Math.ceil(3 - diffDays);
      }
    }

    if (wallet.balance < 10000) {
      canWithdraw = false;
    }

    return NextResponse.json({
      success: true,
      data: {
        balance: wallet.balance,
        ledger,
        canWithdraw,
        daysRemaining,
        firstIncomeDate
      }
    });
  } catch (error: any) {
    return NextResponse.json({ detail: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'partner') return NextResponse.json({ detail: 'Only partners can access wallet' }, { status: 403 });

    const body = await request.json();
    const { amount, bank_name, bank_account } = body;

    if (!amount || amount < 10000) {
      return NextResponse.json({ detail: 'Minimal penarikan adalah Rp 10.000' }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({
        where: { user_id: user.id }
      });

      if (!wallet || wallet.balance < amount) {
        throw new Error('Saldo tidak mencukupi');
      }

      const firstPayment = await tx.payment.findFirst({
        where: {
          partner_id: user.id,
          method: 'QRIS',
          status: 'SUCCESS',
          job: { status: 'COMPLETED' }
        },
        include: { job: true },
        orderBy: { job: { updated_at: 'asc' } }
      });

      if (!firstPayment) {
        throw new Error('Belum ada pendapatan masuk yang dapat ditarik');
      }

      const diffDays = (new Date().getTime() - firstPayment.job.updated_at.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays < 3) {
        throw new Error(`Anda baru bisa melakukan penarikan setelah 3 hari dari pendapatan pertama (sisa ${Math.ceil(3 - diffDays)} hari).`);
      }

      await tx.wallet.update({
        where: { user_id: user.id },
        data: { balance: { decrement: amount } }
      });

      const withdrawal = await tx.withdrawal.create({
        data: {
          user_id: user.id,
          amount,
          bank_name,
          bank_account,
          status: 'PENDING'
        }
      });

      return withdrawal;
    });

    return NextResponse.json({ success: true, message: 'Penarikan berhasil diajukan', data: result });
  } catch (error: any) {
    return NextResponse.json({ detail: error.message }, { status: 400 });
  }
}
