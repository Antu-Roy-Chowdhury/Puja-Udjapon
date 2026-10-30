import { NextResponse } from "next/server"
import { apiError } from "@/lib/api-error"
import { requireAdmin } from "@/lib/auth"
import { getDatabase } from "@/lib/db"
import { normalizeMemberEmail } from "@/lib/admin-rules"

export async function POST(req: Request) {
  try {
    const actor = await requireAdmin()
    const body = await req.json()
    const name = String(body.name || "").trim()
    const email = normalizeMemberEmail(body.email)
    const department = String(body.department || "").trim()
    const series = String(body.series || "").trim()
    const phone = String(body.phone || "").trim()
    const bio = String(body.bio || "").trim()
    if (!name || name.length > 150 || !email || department.length > 100 || series.length > 30 || phone.length > 30 || bio.length > 2000) return NextResponse.json({ error: "Enter a valid name and email" }, { status: 400 })
    const sql = getDatabase()
    const existing = await sql`SELECT id, name, role, approved, department, series, contact, bio, photo FROM profiles WHERE lower(email::text) = ${email} LIMIT 1`
    if (existing[0] && !existing[0].approved) return NextResponse.json({ error: "This account is pending approval. Use the Approval Panel first." }, { status: 409 })
    const duplicate = await sql`SELECT id FROM members WHERE lower(email::text) = ${email} OR profile_id = ${existing[0]?.id || null} LIMIT 1`
    if (duplicate[0]) return NextResponse.json({ error: "This person is already a member" }, { status: 409 })
    const profileId = existing[0]?.id || null
    const rows = await sql`
      INSERT INTO members (profile_id, name, position, role, department, series, email, phone, avatar, bio, is_alumni)
      VALUES (${profileId}, ${profileId ? existing[0].name : name}, 'Member', ${profileId ? existing[0].role : "member"}, ${profileId ? existing[0].department : department || null}, ${profileId ? existing[0].series : series || null}, ${email}, ${profileId ? existing[0].contact : phone || null}, ${profileId ? existing[0].photo : null}, ${profileId ? existing[0].bio : bio || null},
        CASE WHEN ${series} ~ '^\\d{4}$' THEN ${series}::integer <= 2019 ELSE FALSE END)
      RETURNING id`
    await sql`INSERT INTO admin_audit_log (actor_id, action, target_id, details) VALUES (${actor.id}, 'member.add', ${rows[0].id}, ${JSON.stringify({ email, existingAccount: !!profileId })}::jsonb)`
    return NextResponse.json({ success: true, id: rows[0].id, linkedExistingAccount: !!profileId })
  } catch (error: any) {
    if (error?.code === "23505") return NextResponse.json({ error: "This person is already a member" }, { status: 409 })
    return apiError(error, "Failed to add member")
  }
}
