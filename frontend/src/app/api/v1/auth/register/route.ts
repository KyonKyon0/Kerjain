import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { name, email, password, role, phone, address, gender } = body;
    
    if (email) email = email.toLowerCase();

    if (!name || !email || !password || !role || !phone) {
      return NextResponse.json({ success: false, detail: 'Nama, email, password, peran, dan nomor telepon wajib diisi' }, { status: 200 });
    }

    phone = phone.trim();

    const hashedPassword = await hashPassword(password);
    let user: any;

    try {
      user = await prisma.user.upsert({
        where: { email },
        update: {
          name,
          hashed_password: hashedPassword,
          role,
          phone,
          address,
          gender: gender || 'MALE'
        },
        create: {
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
      user = await prisma.user.upsert({
        where: { email },
        update: {
          name,
          hashed_password: hashedPassword,
          role,
          phone,
          address,
        },
        create: {
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
