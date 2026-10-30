import { NextResponse } from "next/server"
import { apiError } from "@/lib/api-error"
import { requireRole, type UserRole } from "@/lib/auth"
import { getDatabase } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const actor = await requireRole(["super_admin"])
    const { userId, newRole } = await req.json()
    if (!["member", "admin", "super_admin"].includes(newRole)) return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    if (actor.id === userId && newRole !== "super_admin") return NextResponse.json({ error: "You cannot remove your own super admin role" }, { status: 400 })
    const rows = await getDatabase()`
      WITH changed AS (
        UPDATE profiles SET role = ${newRole as UserRole}, updated_at = NOW() WHERE id = ${userId} RETURNING id
      )
      UPDATE members SET role = ${newRole as UserRole}, updated_at = NOW()
      WHERE profile_id IN (SELECT id FROM changed) OR id IN (SELECT id FROM changed)
      RETURNING id
    `
    if (!rows[0]) {
      const exists = await getDatabase()`SELECT id FROM profiles WHERE id = ${userId}`
      if (!exists[0]) return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Role update failed", error)
    return apiError(error, "Failed to update user role")
  }
}
