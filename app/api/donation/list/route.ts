import { NextResponse } from "next/server"
import { apiError } from "@/lib/api-error"
import { requireRole } from "@/lib/auth"
import { getDatabase } from "@/lib/db"

export async function GET(req: Request) {
  try {
    await requireRole(["super_admin"])
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const requestedLimit = Number(searchParams.get("limit") || "50")
    const limit = Math.min(Math.max(Number.isFinite(requestedLimit) ? requestedLimit : 50, 1), 250)
    const sql = getDatabase()
    const rows = status
      ? await sql`SELECT * FROM donations WHERE status = ${status} ORDER BY created_at DESC LIMIT ${limit}`
      : await sql`SELECT * FROM donations ORDER BY created_at DESC LIMIT ${limit}`
    const donations = rows.map((item) => ({ ...item, amount: Number(item.amount || 0) }))
    return NextResponse.json({ success: true, data: donations, count: donations.length })
  } catch (error) {
    console.error("Donation list failed", error)
    return apiError(error, "Failed to fetch donations")
  }
}
