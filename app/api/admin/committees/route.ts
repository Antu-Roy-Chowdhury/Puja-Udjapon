import { NextResponse } from "next/server"
import { apiError } from "@/lib/api-error"
import { requireRole } from "@/lib/auth"
import { getDatabase } from "@/lib/db"

export async function POST(req: Request) {
  try {
    await requireRole(["super_admin"])
    const body = await req.json()
    const sql = getDatabase()

    if (body.action === "create") {
      const year = Number(body.year)
      if (!Number.isInteger(year) || year < 1900 || year > 2200) return NextResponse.json({ error: "Enter a valid committee year" }, { status: 400 })
      const rows = await sql`
        INSERT INTO committees (year, title, description)
        VALUES (${year}, ${body.title || `${year} Committee`}, ${body.description || ""})
        ON CONFLICT (year) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, updated_at = NOW()
        RETURNING *
      `
      return NextResponse.json({ committee: rows[0] })
    }

    if (body.action === "assign") {
      if (!body.committeeId || !body.memberId || !body.position) return NextResponse.json({ error: "Committee, member, and position are required" }, { status: 400 })
      const rows = await sql`
        INSERT INTO committee_members (committee_id, member_id, position, display_order)
        VALUES (${body.committeeId}, ${body.memberId}, ${String(body.position).trim()}, ${Number(body.displayOrder) || 0})
        ON CONFLICT (committee_id, member_id) DO UPDATE
        SET position = EXCLUDED.position, display_order = EXCLUDED.display_order, updated_at = NOW()
        RETURNING *
      `
      return NextResponse.json({ committeeMember: rows[0] })
    }

    if (body.action === "update_member") {
      const rows = await sql`
        UPDATE committee_members SET position = ${String(body.position || "Committee Member").trim()},
          display_order = ${Number(body.displayOrder) || 0}, updated_at = NOW()
        WHERE id = ${body.committeeMemberId} RETURNING *
      `
      if (!rows[0]) return NextResponse.json({ error: "Committee member not found" }, { status: 404 })
      return NextResponse.json({ committeeMember: rows[0] })
    }

    if (body.action === "remove") {
      await sql`DELETE FROM committee_members WHERE id = ${body.committeeMemberId}`
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Unknown committee action" }, { status: 400 })
  } catch (error: any) {
    console.error("Committee update failed", error)
    if (error?.code === "23505") return NextResponse.json({ error: "This member is already assigned to the committee" }, { status: 409 })
    return apiError(error, "Failed to update committee")
  }
}
