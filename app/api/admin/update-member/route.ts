import { NextResponse } from "next/server"
import { apiError } from "@/lib/api-error"
import { requireRole } from "@/lib/auth"
import { getDatabase } from "@/lib/db"

export async function POST(req: Request) {
  try {
    await requireRole(["super_admin"])
    const { userId, position, department, series, phone } = await req.json()
    if (!userId) return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    const rows = await getDatabase()`
      WITH updated_profile AS (
        UPDATE profiles SET department = COALESCE(${department || null}, department),
          series = COALESCE(${series || null}, series), updated_at = NOW()
        WHERE id = ${userId} RETURNING *
      )
      INSERT INTO members (id, profile_id, name, position, role, department, series, email, phone, avatar, bio, join_date, is_alumni)
      SELECT id, id, name, ${position || "Committee Member"}, role, department, series, email,
        ${phone || ""}, photo, bio, created_at::date,
        CASE WHEN series ~ '^\\d{4}$' THEN series::integer <= 2019 ELSE FALSE END
      FROM updated_profile
      ON CONFLICT (id) DO UPDATE SET profile_id = EXCLUDED.profile_id, name = EXCLUDED.name,
        position = EXCLUDED.position, role = EXCLUDED.role, department = EXCLUDED.department,
        series = EXCLUDED.series, email = EXCLUDED.email, phone = EXCLUDED.phone,
        avatar = EXCLUDED.avatar, bio = EXCLUDED.bio, is_alumni = EXCLUDED.is_alumni, updated_at = NOW()
      RETURNING id
    `
    if (!rows[0]) return NextResponse.json({ error: "User not found" }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Member update failed", error)
    return apiError(error, "Failed to update member")
  }
}
