import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/current-user';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });

    if (user.role !== 'partner') {
      return NextResponse.json({
        success: true,
        data: {
          balance: 0,
          ledger: [],
          canWithdraw: false,
          daysRemaining: 0,
          firstIncomeDate: null,
          stats: {
            total_earnings: 0,
            qris_earnings: 0,
            cash_earnings: 0,
            completed_count: 0
          },
          chart_data: []
        }
      });
    }

    // 1. Get Wallet Balance
    let wallet = await prisma.wallet.findUnique({
      where: { user_id: user.id }
    });
    
    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { user_id: user.id, balance: 0 }
      });
    }

    // 2. Fetch All Completed Jobs (both QRIS and CASH)
    const completedJobs = await prisma.job.findMany({
      where: {
        partner_id: user.id,
        status: 'COMPLETED'
      },
      include: {
        payments: true
      },
      orderBy: { updated_at: 'desc' }
    });

    // 3. Fetch QRIS Payments
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

    // 4. Fetch Withdrawals
    const withdrawals = await prisma.withdrawal.findMany({
      where: { user_id: user.id },
      orderBy: { created_at: 'desc' }
    });

    // 5. Calculate QRIS vs CASH breakdown
    let totalEarnings = 0;
    let qrisEarnings = 0;
    let cashEarnings = 0;

    const earningsPoints: Array<{
      date: string;
      rawDate: Date;
      amount: number;
      method: 'QRIS' | 'CASH';
      title: string;
    }> = [];

    completedJobs.forEach((job: any) => {
      const amount = Number(job.reward_amount ?? job.rewardAmount ?? 0);
      const isQris = job.payment_method === 'QRIS' || job.payments?.some((p: any) => p.method === 'QRIS' && p.status === 'SUCCESS');
      const method: 'QRIS' | 'CASH' = isQris ? 'QRIS' : 'CASH';

      totalEarnings += amount;
      if (isQris) {
        qrisEarnings += amount;
      } else {
        cashEarnings += amount;
      }

      earningsPoints.push({
        date: new Date(job.updated_at).toISOString(),
        rawDate: new Date(job.updated_at),
        amount,
        method,
        title: job.title
      });
    });

    // Sort earningsPoints chronologically
    earningsPoints.sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());

    // Build timeline chart points
    let runningTotal = 0;
    let runningQris = 0;
    let runningCash = 0;

    const chart_data = earningsPoints.map((pt) => {
      runningTotal += pt.amount;
      if (pt.method === 'QRIS') runningQris += pt.amount;
      else runningCash += pt.amount;

      return {
        date: pt.date,
        total: runningTotal,
        qris: runningQris,
        cash: runningCash,
        amount: pt.amount,
        method: pt.method,
        title: pt.title
      };
    });

    // 6. Build Ledger
    type Transaction = {
      id: string;
      type: 'INCOME' | 'WITHDRAWAL';
      method?: 'QRIS' | 'CASH';
      amount: number;
      date: Date;
      description: string;
      status: string;
    };

    const ledger: Transaction[] = [];
    let firstIncomeDate: Date | null = null;

    completedJobs.forEach((job: any) => {
      const releaseDate = job.updated_at;
      if (!firstIncomeDate || releaseDate < firstIncomeDate) {
        firstIncomeDate = releaseDate;
      }
      const isQris = job.payment_method === 'QRIS' || job.payments?.some((p: any) => p.method === 'QRIS' && p.status === 'SUCCESS');
      const method: 'QRIS' | 'CASH' = isQris ? 'QRIS' : 'CASH';

      ledger.push({
        id: `job-${job.id}`,
        type: 'INCOME',
        method,
        amount: Number(job.reward_amount ?? job.rewardAmount ?? 0),
        date: releaseDate,
        description: `Pekerjaan Selesai (${method}): ${job.title}`,
        status: 'COMPLETED'
      });
    });

    withdrawals.forEach((w: any) => {
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

    // 7. Calculate T+3 rules
    let canWithdraw = false;
    let daysRemaining = 0;

    if (firstIncomeDate) {
      const msInDay = 1000 * 60 * 60 * 24;
      const now = new Date();
      const diffMs = now.getTime() - (firstIncomeDate as Date).getTime();
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
        firstIncomeDate,
        stats: {
          total_earnings: totalEarnings,
          qris_earnings: qrisEarnings,
          cash_earnings: cashEarnings,
          completed_count: completedJobs.length
        },
        chart_data
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

    const result = await prisma.$transaction(async (tx: any) => {
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
