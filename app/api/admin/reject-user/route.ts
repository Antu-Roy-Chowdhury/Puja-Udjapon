import { NextResponse } from "next/server"
import { apiError } from "@/lib/api-error"
import { requireAdmin } from "@/lib/auth"
import { getDatabase } from "@/lib/db"

export async function POST(req: Request) {
  try {
    await requireAdmin()
    const { targetEmail } = await req.json()
    const rows = await getDatabase()`
      DELETE FROM users WHERE id IN (
        SELECT id FROM profiles WHERE LOWER(email) = LOWER(${targetEmail}) AND approved = FALSE
      ) RETURNING id
    `
    if (!rows[0]) return NextResponse.json({ error: "Pending user not found" }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Reject user failed", error)
    return apiError(error, "Failed to reject user")
  }
}
