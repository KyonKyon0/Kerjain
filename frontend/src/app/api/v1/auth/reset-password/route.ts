import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { email, otp, new_password } = body;

    if (!email || !otp || !new_password) {
      return NextResponse.json({
        success: false,
        detail: 'Email, kode OTP, dan kata sandi baru wajib diisi.'
      }, { status: 400 });
    }

    email = email.trim().toLowerCase();
    otp = otp.trim();

    if (new_password.length < 8) {
      return NextResponse.json({
        success: false,
        detail: 'Kata sandi minimal 8 karakter.'
      }, { status: 400 });
    }

    // Query valid OTP from password_resets
    const records = await prisma.$queryRawUnsafe<any[]>(`
      SELECT * FROM "password_resets"
      WHERE "email" = $1 
        AND "otp" = $2 
        AND "used" = false 
        AND "expires_at" > NOW()
      ORDER BY "created_at" DESC
      LIMIT 1
    `, email, otp);

    if (!records || records.length === 0) {
      return NextResponse.json({
        success: false,
        detail: 'Kode OTP tidak valid atau sudah kadaluarsa (berlaku maksimal 5 menit).'
      }, { status: 400 });
    }

    const resetRecord = records[0];

    // Mark OTP as used
    await prisma.$executeRawUnsafe(`
      UPDATE "password_resets"
      SET "used" = true
      WHERE "id"::text = $1
    `, String(resetRecord.id));


    // Hash the new password
    const hashedPassword = await hashPassword(new_password);

    // Update user password in database
    await prisma.user.update({
      where: { email },
      data: {
        hashed_password: hashedPassword,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Kata sandi Anda berhasil diperbarui. Silakan login kembali dengan kata sandi baru.'
    });
  } catch (error: any) {
    console.error("POST /api/v1/auth/reset-password error:", error);
    return NextResponse.json({ success: false, detail: error.message || 'Gagal mereset kata sandi' }, { status: 500 });
  }
}
