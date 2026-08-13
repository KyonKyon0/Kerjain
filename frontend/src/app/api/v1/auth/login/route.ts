import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyPassword, signToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    // Form data parsing (OAuth2 password request form style from FastAPI)
    // FastAPI normally expects form-data for login: `username` and `password`
    // We will support both form-data and json for safety.
    
    let email = ''
    let password = ''
    
    const contentType = request.headers.get('content-type') || ''
    
    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      email = formData.get('username') as string // FastAPI OAuth2 uses 'username' field for email
      password = formData.get('password') as string
    } else {
      const body = await request.json()
      email = body.username || body.email
      password = body.password
    }
    
    if (email) email = email.toLowerCase()

    if (!email || !password) {
      console.log("Login failed: missing email or password. Email:", email, "Password provided:", !!password);
      return NextResponse.json({ success: false, detail: 'Incorrect email or password' }, { status: 200 })
    }

    console.log("Attempting to find user with email:", email);
    const user = await prisma.user.findUnique({ where: { email } })
    
    if (!user) {
      console.log("Login failed: user not found for email:", email);
      return NextResponse.json({ success: false, detail: 'Pengguna tidak ditemukan atau email salah' }, { status: 200 })
    }

    const isValidPassword = await verifyPassword(password, user.hashed_password);
    console.log("Password verification result:", isValidPassword);

    if (!isValidPassword) {
      console.log("Login failed: invalid password for email:", email);
      return NextResponse.json({ success: false, detail: 'Password yang Anda masukkan salah' }, { status: 200 })
    }

    const token = await signToken({ sub: user.id, email: user.email, role: user.role })

    // Remove password from user
    const { hashed_password, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      message: "Login berhasil",
      data: {
        user: userWithoutPassword,
        token: token,
        role: user.role
      }
    })
  } catch (error: any) {
    return NextResponse.json({ detail: error.message }, { status: 500 })
  }
}
