import { NextResponse } from "next/server"
import { apiError } from "@/lib/api-error"
import { requireAdmin } from "@/lib/auth"
import { getDatabase } from "@/lib/db"

export async function POST(req: Request) {
  try {
    await requireAdmin()
    const { id } = await req.json()
    await getDatabase()`DELETE FROM gallery WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Gallery rejection failed", error)
    return apiError(error, "Failed to remove gallery item")
  }
}
