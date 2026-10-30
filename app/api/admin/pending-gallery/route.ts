import { NextResponse } from "next/server"
import { apiError } from "@/lib/api-error"
import { requireAdmin } from "@/lib/auth"
import { normalizeGalleryItem } from "@/lib/content"
import { getDatabase } from "@/lib/db"

export async function GET() {
  try {
    await requireAdmin()
    const rows = await getDatabase()`
      SELECT g.*, COALESCE(p.name, p.email, 'Community Member') AS uploader_name
      FROM gallery g LEFT JOIN profiles p ON p.id = g.uploaded_by
      WHERE g.approved = FALSE ORDER BY g.created_at DESC
    `
    return NextResponse.json(rows.map((row) => normalizeGalleryItem(row, String(row.uploader_name))))
  } catch (error) {
    console.error("Pending gallery query failed", error)
    return apiError(error, "Failed to fetch pending gallery items")
  }
}
