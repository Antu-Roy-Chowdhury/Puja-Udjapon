import { NextResponse } from "next/server"
import { apiError } from "@/lib/api-error"
import { requireAdmin } from "@/lib/auth"
import { getDatabase } from "@/lib/db"

export async function POST(req: Request) {
  try {
    await requireAdmin()
    const { targetEmail } = await req.json()
    const rows = await getDatabase()`
      WITH approved_profile AS (
        UPDATE profiles SET approved = TRUE, updated_at = NOW()
        WHERE LOWER(email) = LOWER(${targetEmail}) AND approved = FALSE
        RETURNING *
      ), added_member AS (
        INSERT INTO members (id, profile_id, name, position, role, department, series, email, phone, avatar, bio, join_date, is_alumni)
        SELECT id, id, name, 'Member', role, department, series, email, contact, photo, bio, CURRENT_DATE,
          CASE WHEN series ~ '^\\d{4}$' THEN series::integer <= 2019 ELSE FALSE END
        FROM approved_profile
        ON CONFLICT (id) DO UPDATE SET profile_id = EXCLUDED.profile_id, name = EXCLUDED.name,
          role = EXCLUDED.role, department = EXCLUDED.department, series = EXCLUDED.series,
          email = EXCLUDED.email, phone = EXCLUDED.phone, avatar = EXCLUDED.avatar, bio = EXCLUDED.bio,
          updated_at = NOW()
      )
      SELECT id FROM approved_profile
    `
    if (!rows[0]) return NextResponse.json({ error: "User not found or already approved" }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Approve user failed", error)
    return apiError(error, "Failed to approve user")
  }
}
