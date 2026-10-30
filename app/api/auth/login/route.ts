import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

import { createSession } from "@/lib/auth"
import { getDatabase } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ status: "INVALID", error: "Email and password are required" }, { status: 400 })
    }

    const sql = getDatabase()
    const rows = await sql`
      SELECT u.id, u.email, u.password_hash, p.name, p.role, p.approved,
        p.department, p.series, p.photo, p.contact, p.blood_group, p.bio
      FROM users u
      JOIN profiles p ON p.id = u.id
      WHERE LOWER(u.email) = LOWER(${String(email).trim()})
      LIMIT 1
    `
    const account = rows[0] as Record<string, any> | undefined
    const passwordMatches = account?.password_hash
      ? await bcrypt.compare(String(password), account.password_hash)
      : false

    if (!account || !passwordMatches) {
      return NextResponse.json({ status: "INVALID", error: "Invalid email or password" }, { status: 401 })
    }
    if (!account.approved) {
      return NextResponse.json({ status: "PENDING", error: "Your account is pending admin approval" })
    }

    await createSession(account.id)
    const approved = Boolean(account.approved)
    return NextResponse.json({
      status: "OK",
      user: {
        id: account.id,
        email: account.email,
        name: account.name,
        role: account.role,
        approved,
        isApproved: approved,
        department: account.department || "",
        series: account.series || "",
        photo: account.photo || "",
        contact: account.contact || "",
        bloodGroup: account.blood_group || "",
        bio: account.bio || "",
      },
    })
  } catch (error) {
    console.error("Login failed", error)
    return NextResponse.json({ status: "INVALID", error: "An error occurred during login" }, { status: 500 })
  }
}
