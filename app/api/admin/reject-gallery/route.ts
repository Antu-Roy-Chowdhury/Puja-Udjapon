import { NextResponse } from "next/server"
import { apiError } from "@/lib/api-error"
import { requireAdmin } from "@/lib/auth"
import { getDatabase } from "@/lib/db"

export async function POST(req: Request) {
  try {
    await requireAdmin()
    const { id, removeApproved } = await req.json()
    const rows = await getDatabase()`DELETE FROM gallery WHERE id = ${id} AND (approved = FALSE OR ${removeApproved === true}) RETURNING id`
    if (!rows[0]) return NextResponse.json({ error: "Pending gallery item not found" }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Gallery rejection failed", error)
    return apiError(error, "Failed to remove gallery item")
  }
}
