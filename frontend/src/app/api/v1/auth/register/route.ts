import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rate = checkRateLimit(`register:${ip}`, 10, 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json({ success: false, detail: 'Terlalu banyak permintaan registrasi. Silakan tunggu 1 menit.' }, { status: 429 });
    }
    const body = await request.json();
    let { name, email, password, role, phone, address, gender } = body;
    
    if (email) email = email.toLowerCase();

    if (!name || !email || !password || !role || !phone) {
      return NextResponse.json({ success: false, detail: 'Nama, email, password, peran, dan nomor telepon wajib diisi' }, { status: 200 });
    }

    phone = phone.trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ success: false, detail: 'Email sudah terdaftar. Silakan gunakan email lain atau masuk.' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    let user: any;

    try {
      user = await prisma.user.create({
        data: {
          name,
          email,
          hashed_password: hashedPassword,
          role,
          phone,
          address,
          gender: gender || 'MALE'
        }
      });
    } catch {
      user = await prisma.user.create({
        data: {
          name,
          email,
          hashed_password: hashedPassword,
          role,
          phone,
          address,
        }
      });

      if (gender) {
        try {
          await prisma.$executeRawUnsafe(
            `UPDATE users SET gender = $1 WHERE id = $2::uuid;`,
            gender,
            user.id
          );
          user.gender = gender;
        } catch {}
      }
    }

    // Remove password from response
    const { hashed_password, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      message: "Registrasi berhasil",
      data: userWithoutPassword
    });
  } catch (error: any) {
    return NextResponse.json({ detail: error.message }, { status: 500 });
  }
}
