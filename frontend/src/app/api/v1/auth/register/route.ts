import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    let { name, email, password, role, phone, address } = body
    
    if (email) email = email.toLowerCase()

    if (!name || !email || !password || !role) {
      console.log("Register failed: missing required fields", { name: !!name, email: !!email, password: !!password, role: !!role })
      return NextResponse.json({ success: false, detail: 'Missing required fields' }, { status: 200 })
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name,
        hashed_password: hashedPassword,
        role,
        phone,
        address
      },
      create: {
        name,
        email,
        hashed_password: hashedPassword,
        role,
        phone,
        address
      }
    })

    // Remove password from response
    const { hashed_password, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      message: "Registrasi berhasil",
      data: userWithoutPassword
    })
  } catch (error: any) {
    return NextResponse.json({ detail: error.message }, { status: 500 })
  }
}
