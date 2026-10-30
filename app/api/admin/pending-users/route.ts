import { NextResponse } from "next/server"
import { apiError } from "@/lib/api-error"
import { requireAdmin } from "@/lib/auth"
import { getDatabase } from "@/lib/db"

export async function GET() {
  try {
    await requireAdmin()
    const rows = await getDatabase()`SELECT * FROM profiles WHERE approved = FALSE ORDER BY created_at DESC`
    return NextResponse.json(rows)
  } catch (error) {
    console.error("Pending users query failed", error)
    return apiError(error, "Failed to fetch pending users")
  }
}
