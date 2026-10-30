import { normalizeGalleryItem } from "@/lib/content"
import { getDatabase } from "@/lib/db"

export async function getGallery(limit?: number) {
  try {
    const sql = getDatabase()
    const rows = limit
      ? await sql`SELECT g.*, COALESCE(p.name, p.email, 'Community Member') AS uploader_name
          FROM gallery g LEFT JOIN profiles p ON p.id = g.uploaded_by
          WHERE g.approved = TRUE ORDER BY g.created_at DESC LIMIT ${limit}`
      : await sql`SELECT g.*, COALESCE(p.name, p.email, 'Community Member') AS uploader_name
          FROM gallery g LEFT JOIN profiles p ON p.id = g.uploaded_by
          WHERE g.approved = TRUE ORDER BY g.created_at DESC`
    return rows.map((row) => normalizeGalleryItem(row, String(row.uploader_name)))
  } catch (error) {
    console.error("Failed to fetch gallery", error)
    return []
  }
}
