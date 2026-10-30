import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"

export async function GET() {
  try {
    const rows = await getDatabase()`SELECT * FROM gallery WHERE approved = TRUE ORDER BY created_at DESC`
    return NextResponse.json(rows)
  } catch (error) {
    console.error("Gallery query failed", error)
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 })
  }
}
