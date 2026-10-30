import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const alumni = searchParams.get("alumni")
    const sql = getDatabase()
    const rows = alumni === "true"
      ? await sql`SELECT m.*, d.designation AS developer_designation FROM members m LEFT JOIN developer_profiles d ON d.profile_id = m.profile_id WHERE m.is_alumni = TRUE ORDER BY m.position, m.name`
      : alumni === "false"
        ? await sql`SELECT m.*, d.designation AS developer_designation FROM members m LEFT JOIN developer_profiles d ON d.profile_id = m.profile_id WHERE m.is_alumni = FALSE ORDER BY m.position, m.name`
        : await sql`SELECT m.*, d.designation AS developer_designation FROM members m LEFT JOIN developer_profiles d ON d.profile_id = m.profile_id ORDER BY m.position, m.name`
    return NextResponse.json(rows.map((member) => ({
      id: member.id,
      profileId: member.profile_id || member.id,
      name: member.name,
      position: member.position || "Committee Member",
      department: member.department,
      series: member.series,
      email: member.email,
      phone: member.phone,
      location: member.location,
      avatar: member.avatar,
      joinDate: member.join_date,
      bio: member.bio,
      isAlumni: Boolean(member.is_alumni),
      developerDesignation: member.developer_designation || null,
    })))
  } catch (error) {
    console.error("Members query failed", error)
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 })
  }
}
