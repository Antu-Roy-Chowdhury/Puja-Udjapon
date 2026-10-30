import { NextResponse } from "next/server"
import { normalizeGalleryItem } from "@/lib/content"
import { getDatabase } from "@/lib/db"

export async function GET() {
  try {
    const rows = await getDatabase()`
      SELECT g.*, COALESCE(p.name, p.email, 'Community Member') AS uploader_name
      FROM gallery g LEFT JOIN profiles p ON p.id = g.uploaded_by
      WHERE g.approved = TRUE ORDER BY g.created_at DESC
    `
    return NextResponse.json(rows.map((row) => normalizeGalleryItem(row, String(row.uploader_name))))
  } catch (error) {
    console.error("Gallery list failed", error)
    return NextResponse.json({ error: "Failed to fetch gallery items" }, { status: 500 })
  }
}
