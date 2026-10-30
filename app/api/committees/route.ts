import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const requestedYear = Number(searchParams.get("year"))
    const sql = getDatabase()
    const committees = await sql`SELECT id, year, title, description, created_at FROM committees ORDER BY year DESC`
    const selected = Number.isInteger(requestedYear)
      ? committees.find((committee) => Number(committee.year) === requestedYear)
      : committees[0]
    if (!selected) return NextResponse.json({ committees, committee: null })
    const members = await sql`
      SELECT cm.id AS committee_member_id, cm.position, cm.display_order,
        m.id, m.name, m.department, m.series, m.email, m.phone, m.avatar, m.bio
      FROM committee_members cm JOIN members m ON m.id = cm.member_id
      WHERE cm.committee_id = ${selected.id}
      ORDER BY cm.display_order ASC, cm.position ASC, m.name ASC
    `
    return NextResponse.json({ committees, committee: { ...selected, members } })
  } catch (error) {
    console.error("Committees query failed", error)
    return NextResponse.json({ error: "Failed to fetch committees" }, { status: 500 })
  }
}
