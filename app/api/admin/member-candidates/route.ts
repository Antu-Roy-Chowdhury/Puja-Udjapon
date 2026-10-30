import { NextResponse } from "next/server"
import { apiError } from "@/lib/api-error"
import { requireRole } from "@/lib/auth"
import { getDatabase } from "@/lib/db"

export async function GET(req: Request) {
  try {
    await requireRole(["super_admin"])
    const { searchParams } = new URL(req.url)
    const department = searchParams.get("department")?.trim() || ""
    const series = searchParams.get("series")?.trim() || ""
    const search = searchParams.get("search")?.trim() || ""
    const rows = await getDatabase()`
      SELECT m.id, m.name, m.department, m.series, m.email, m.phone, m.avatar, m.position
      FROM members m
      WHERE m.profile_id IS NOT NULL
        AND (${department} = '' OR m.department = ${department})
        AND (${series} = '' OR m.series = ${series})
        AND (${search} = '' OR m.name ILIKE ${`%${search}%`} OR m.email ILIKE ${`%${search}%`})
      ORDER BY m.name ASC LIMIT 100
    `
    return NextResponse.json(rows)
  } catch (error) {
    console.error("Member candidates query failed", error)
    return apiError(error, "Failed to fetch members")
  }
}
