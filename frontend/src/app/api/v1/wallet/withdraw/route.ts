import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/current-user'

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user || user.role !== 'partner') {
      return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { amount, bank_name, bank_account } = body

    if (!amount || amount <= 0 || !bank_name || !bank_account) {
      return NextResponse.json({ detail: 'Data tidak lengkap atau tidak valid' }, { status: 400 })
    }

    // Check balance
    const wallet = await prisma.wallet.findUnique({
      where: { user_id: user.id }
    })

    if (!wallet || wallet.balance < amount) {
      return NextResponse.json({ detail: 'Saldo tidak mencukupi' }, { status: 400 })
    }

    // Deduct balance and create withdrawal record
    const result = await prisma.$transaction(async (tx) => {
      const updatedWallet = await tx.wallet.update({
        where: { user_id: user.id },
        data: { balance: { decrement: amount } }
      })

      const withdrawal = await tx.withdrawal.create({
        data: {
          user_id: user.id,
          amount,
          bank_name,
          bank_account,
          status: 'PENDING'
        }
      })

      return { updatedWallet, withdrawal }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Permintaan penarikan berhasil diajukan',
      data: result 
    })
  } catch (error: any) {
    return NextResponse.json({ detail: error.message }, { status: 500 })
  }
}
