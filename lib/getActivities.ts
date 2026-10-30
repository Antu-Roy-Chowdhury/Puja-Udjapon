import { normalizeActivity } from "@/lib/content"
import { getDatabase } from "@/lib/db"

export async function getActivities(limit?: number) {
  try {
    const sql = getDatabase()
    const rows = limit
      ? await sql`SELECT * FROM activities ORDER BY name ASC LIMIT ${limit}`
      : await sql`SELECT * FROM activities ORDER BY name ASC`
    return rows.map((row) => normalizeActivity(row))
  } catch (error) {
    console.error("Failed to fetch activities", error)
    return []
  }
}
