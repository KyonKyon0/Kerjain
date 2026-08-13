import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  return NextResponse.json({ success: true, message: "Daftar notifikasi", data: [] })
}

export async function POST(request: Request) {
  return NextResponse.json({ success: true })
}

export async function PUT(request: Request) {
  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  return NextResponse.json({ success: true })
}
