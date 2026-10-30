import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const alumni = searchParams.get("alumni")
    const sql = getDatabase()
    const rows = alumni === "true"
      ? await sql`SELECT * FROM members WHERE is_alumni = TRUE ORDER BY position, name`
      : alumni === "false"
        ? await sql`SELECT * FROM members WHERE is_alumni = FALSE ORDER BY position, name`
        : await sql`SELECT * FROM members ORDER BY position, name`
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
    })))
  } catch (error) {
    console.error("Members query failed", error)
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 })
  }
}
