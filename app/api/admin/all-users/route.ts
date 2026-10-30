import { NextResponse } from "next/server"
import { apiError } from "@/lib/api-error"
import { requireRole } from "@/lib/auth"
import { getDatabase } from "@/lib/db"

export async function GET() {
  try {
    await requireRole(["super_admin"])
    const rows = await getDatabase()`
      SELECT p.id, p.name, p.email, p.department, p.series, p.photo, p.role, p.created_at,
        m.position, m.phone, m.join_date, m.is_alumni
      FROM profiles p LEFT JOIN members m ON m.profile_id = p.id
      WHERE p.approved = TRUE ORDER BY p.created_at DESC
    `
    return NextResponse.json(rows.map((row) => ({
      id: row.id, name: row.name, email: row.email, department: row.department || "",
      series: row.series || "", photo: row.photo || "", role: row.role || "member",
      position: row.position || "Committee Member", phone: row.phone || "",
      joinDate: row.join_date || row.created_at, isAlumni: Boolean(row.is_alumni),
    })))
  } catch (error) {
    console.error("All users query failed", error)
    return apiError(error, "Failed to fetch users")
  }
}
