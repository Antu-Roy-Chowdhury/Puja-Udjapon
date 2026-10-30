import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"

export async function GET() {
  try {
    const rows = await getDatabase()`
      SELECT p.id, p.name, p.photo, p.department, p.series, d.designation, d.contribution,
        d.display_order, d.is_founder
      FROM developer_profiles d JOIN profiles p ON p.id = d.profile_id
      WHERE p.approved = TRUE ORDER BY d.is_founder DESC, d.display_order, p.name`
    return NextResponse.json(rows)
  } catch (error) {
    console.error("Developer query failed", error)
    return NextResponse.json({ error: "Failed to load developer team" }, { status: 500 })
  }
}
