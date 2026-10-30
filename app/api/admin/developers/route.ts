import { NextResponse } from "next/server"
import { apiError } from "@/lib/api-error"
import { requireRole } from "@/lib/auth"
import { getDatabase } from "@/lib/db"

export async function GET() {
  try {
    await requireRole(["super_admin"])
    const rows = await getDatabase()`
      SELECT p.id, p.name, p.email, p.photo, p.department, p.series,
        d.designation, d.contribution, d.display_order, d.is_founder
      FROM profiles p LEFT JOIN developer_profiles d ON d.profile_id = p.id
      WHERE p.approved = TRUE ORDER BY p.name`
    return NextResponse.json(rows)
  } catch (error) { return apiError(error, "Failed to load members") }
}

export async function POST(req: Request) {
  try {
    const actor = await requireRole(["super_admin"])
    const body = await req.json()
    if (typeof body.profileId !== "string") return NextResponse.json({ error: "Member is required" }, { status: 400 })
    const sql = getDatabase()
    if (body.action === "remove") {
      const rows = await sql`DELETE FROM developer_profiles WHERE profile_id = ${body.profileId} RETURNING profile_id`
      if (!rows[0]) return NextResponse.json({ error: "Developer not found" }, { status: 404 })
      await sql`INSERT INTO admin_audit_log (actor_id, action, target_id) VALUES (${actor.id}, 'developer.remove', ${body.profileId})`
      return NextResponse.json({ success: true })
    }
    if (body.action !== "save") return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    const designation = String(body.designation || "Developer").trim()
    const contribution = String(body.contribution || "").trim()
    const order = Number(body.displayOrder)
    if (!designation || designation.length > 120 || contribution.length > 2000 || !Number.isInteger(order) || order < 0) return NextResponse.json({ error: "Invalid developer details" }, { status: 400 })
    const eligible = await sql`SELECT id FROM profiles WHERE id = ${body.profileId} AND approved = TRUE`
    if (!eligible[0]) return NextResponse.json({ error: "Choose an approved registered member" }, { status: 400 })
    const founder = body.isFounder === true
    if (founder) {
      const existing = await sql`SELECT profile_id FROM developer_profiles WHERE is_founder = TRUE AND profile_id <> ${body.profileId}`
      if (existing[0]) return NextResponse.json({ error: "Remove the current Founder designation first" }, { status: 409 })
    }
    await sql`
      INSERT INTO developer_profiles (profile_id, designation, contribution, display_order, is_founder, updated_by)
      VALUES (${body.profileId}, ${designation}, ${contribution}, ${order}, ${founder}, ${actor.id})
      ON CONFLICT (profile_id) DO UPDATE SET designation = EXCLUDED.designation,
        contribution = EXCLUDED.contribution, display_order = EXCLUDED.display_order,
        is_founder = EXCLUDED.is_founder, updated_by = EXCLUDED.updated_by, updated_at = NOW()`
    await sql`INSERT INTO admin_audit_log (actor_id, action, target_id) VALUES (${actor.id}, 'developer.save', ${body.profileId})`
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error?.code === "23505") return NextResponse.json({ error: "A Founder is already assigned" }, { status: 409 })
    return apiError(error, "Failed to update developer")
  }
}
