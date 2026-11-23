import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { invalidateUserCache } from '@/lib/current-user';
import crypto from 'crypto';

const SECRET_KEY = process.env.SECRET_KEY || 'default-secret-key';

function hashOtp(otp: string): string {
  return crypto.createHash('sha256').update(`${otp}:${SECRET_KEY}`).digest('hex');
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rate = checkRateLimit(`reset-pass:${ip}`, 5, 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json({ success: false, detail: 'Terlalu banyak percobaan reset sandi. Tunggu 1 menit.' }, { status: 429 });
    }

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

    // Query valid OTP from password_resets (supports both hashed and legacy raw OTP)
    const hashed = hashOtp(otp);
    const records = await prisma.$queryRawUnsafe<any[]>(`
      SELECT * FROM "password_resets"
      WHERE "email" = $1 
        AND ("otp" = $2 OR "otp" = $3) 
        AND "used" = false 
        AND "expires_at" > NOW()
      ORDER BY "created_at" DESC
      LIMIT 1
    `, email, hashed, otp);

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

    // Update user password in database and invalidate auth cache
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        hashed_password: hashedPassword,
      },
      select: { id: true }
    });

    invalidateUserCache(updatedUser.id);

    return NextResponse.json({
      success: true,
      message: 'Kata sandi Anda berhasil diperbarui. Silakan login kembali dengan kata sandi baru.'
    });
  } catch (error: any) {
    console.error("POST /api/v1/auth/reset-password error:", error);
    return NextResponse.json({ success: false, detail: error.message || 'Gagal mereset kata sandi' }, { status: 500 });
  }
}
