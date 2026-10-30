import { randomUUID } from "node:crypto"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

import { getDatabase } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, department, series, contact, bloodGroup, photo } = body
    if (!name || !email || !password || !department || !series || !contact || !bloodGroup) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    if (String(password).length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const id = randomUUID()
    const normalizedEmail = String(email).trim().toLowerCase()
    const passwordHash = await bcrypt.hash(String(password), 12)
    const sql = getDatabase()
    await sql`
      WITH new_user AS (
        INSERT INTO users (id, email, password_hash, email_confirmed_at)
        VALUES (${id}, ${normalizedEmail}, ${passwordHash}, NOW())
        RETURNING id
      )
      INSERT INTO profiles (
        id, name, email, role, approved, department, series, photo, contact, blood_group, bio
      )
      SELECT id, ${String(name).trim()}, ${normalizedEmail}, 'member', FALSE,
        ${String(department)}, ${String(series)}, ${photo || null}, ${String(contact)}, ${String(bloodGroup)}, ''
      FROM new_user
    `
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Signup failed", error)
    if (error?.code === "23505") {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }
    return NextResponse.json({ error: "An error occurred during signup" }, { status: 500 })
  }
}
