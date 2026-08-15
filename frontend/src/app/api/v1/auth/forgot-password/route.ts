import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendOtpEmail } from '@/lib/resend';

// Ensure password_resets table exists
async function ensureTable() {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "password_resets" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "email" VARCHAR(255) NOT NULL,
        "otp" VARCHAR(10) NOT NULL,
        "expires_at" TIMESTAMPTZ(6) NOT NULL,
        "used" BOOLEAN NOT NULL DEFAULT false,
        "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS "idx_password_resets_email" ON "password_resets" ("email");
    `);
  } catch (err) {
    console.error("Error creating password_resets table:", err);
  }
}

export async function POST(request: Request) {
  try {
    await ensureTable();
    const body = await request.json();
    let { email } = body;

    if (!email || !email.trim()) {
      return NextResponse.json({ success: false, detail: 'Email wajib diisi' }, { status: 400 });
    }

    email = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true }
    });

    if (!user) {
      // Return 200 with generic message for security, or friendly message
      return NextResponse.json({
        success: false,
        detail: 'Email tidak terdaftar dalam sistem Kerjain.'
      }, { status: 404 });
    }

    // Generate 6 digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Exactly 5 minutes expiration
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Invalidate previous unused OTPs for this email
    await prisma.$executeRawUnsafe(`
      UPDATE "password_resets" 
      SET "used" = true 
      WHERE "email" = $1 AND "used" = false
    `, email);

    // Insert new OTP record
    await prisma.$executeRawUnsafe(`
      INSERT INTO "password_resets" ("email", "otp", "expires_at", "used", "created_at")
      VALUES ($1, $2, $3, false, NOW())
    `, email, otp, expiresAt.toISOString());

    // Send email via Resend
    try {
      const emailResult = await sendOtpEmail(email, otp, user.name);
      if (emailResult.error) {
        console.error("Resend delivery error:", emailResult.error);
        return NextResponse.json({
          success: false,
          detail: `Gagal mengirim email OTP: ${emailResult.error.message || 'Layanan email sedang sibuk'}`
        }, { status: 500 });
      }
    } catch (mailError: any) {
      console.error("Failed to send OTP email via Resend:", mailError);
      return NextResponse.json({
        success: false,
        detail: `Gagal mengirim email: ${mailError.message || 'Periksa koneksi Resend'}`
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Kode OTP 6-digit telah dikirim ke email Anda (berlaku selama 5 menit).'
    });
  } catch (error: any) {
    console.error("POST /api/v1/auth/forgot-password error:", error);
    return NextResponse.json({ success: false, detail: error.message || 'Terjadi kesalahan internal' }, { status: 500 });
  }
}
