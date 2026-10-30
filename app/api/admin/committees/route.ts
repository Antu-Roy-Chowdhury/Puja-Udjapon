import { NextResponse } from "next/server"
import { apiError } from "@/lib/api-error"
import { requireRole } from "@/lib/auth"
import { getDatabase } from "@/lib/db"
import { validCommitteeTerm } from "@/lib/admin-rules"

export async function POST(req: Request) {
  try {
    await requireRole(["super_admin"])
    const body = await req.json()
    const sql = getDatabase()

    if (body.action === "create") {
      const year = Number(body.year)
      if (!Number.isInteger(year) || year < 1900 || year > 2200) return NextResponse.json({ error: "Enter a valid committee year" }, { status: 400 })
      const start = body.termStart || null, end = body.termEnd || null
      if (!validCommitteeTerm(start, end)) return NextResponse.json({ error: "Enter valid term dates" }, { status: 400 })
      const rows = await sql`
        INSERT INTO committees (year, title, description, term_start, term_end)
        VALUES (${year}, ${String(body.title || `${year} Committee`).trim()}, ${String(body.description || "").trim()}, ${start}, ${end})
        RETURNING *
      `
      return NextResponse.json({ committee: rows[0] })
    }

    if (body.action === "edit") {
      const start = body.termStart || null, end = body.termEnd || null
      if (!validCommitteeTerm(start, end) || !String(body.title || "").trim()) return NextResponse.json({ error: "Enter a title and valid term dates" }, { status: 400 })
      const rows = await sql`UPDATE committees SET title = ${String(body.title).trim()}, description = ${String(body.description || "").trim()}, term_start = ${start}, term_end = ${end}, updated_at = NOW() WHERE id = ${body.committeeId} RETURNING *`
      if (!rows[0]) return NextResponse.json({ error: "Committee not found" }, { status: 404 })
      return NextResponse.json({ committee: rows[0] })
    }

    if (body.action === "assign") {
      const order = Number(body.displayOrder)
      if (!body.committeeId || !body.memberId || !String(body.position || "").trim() || !Number.isInteger(order) || order < 0) return NextResponse.json({ error: "Committee, member, position and valid order are required" }, { status: 400 })
      const rows = await sql`
        INSERT INTO committee_members (committee_id, member_id, position, display_order)
        SELECT ${body.committeeId}, m.id, ${String(body.position).trim()}, ${order}
        FROM members m LEFT JOIN profiles p ON p.id = m.profile_id
        WHERE m.id = ${body.memberId} AND (m.profile_id IS NULL OR p.approved = TRUE)
        RETURNING *
      `
      if (!rows[0]) return NextResponse.json({ error: "Eligible member not found" }, { status: 400 })
      return NextResponse.json({ committeeMember: rows[0] })
    }

    if (body.action === "update_member") {
      const order = Number(body.displayOrder)
      if (!String(body.position || "").trim() || !Number.isInteger(order) || order < 0) return NextResponse.json({ error: "Enter a position and valid order" }, { status: 400 })
      const rows = await sql`
        UPDATE committee_members SET position = ${String(body.position).trim()},
          display_order = ${order}, updated_at = NOW()
        WHERE id = ${body.committeeMemberId} RETURNING *
      `
      if (!rows[0]) return NextResponse.json({ error: "Committee member not found" }, { status: 404 })
      return NextResponse.json({ committeeMember: rows[0] })
    }

    if (body.action === "remove") {
      const rows = await sql`DELETE FROM committee_members WHERE id = ${body.committeeMemberId} RETURNING id`
      if (!rows[0]) return NextResponse.json({ error: "Committee member not found" }, { status: 404 })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Unknown committee action" }, { status: 400 })
  } catch (error: any) {
    console.error("Committee update failed", error)
    if (error?.code === "23505") return NextResponse.json({ error: "This member is already assigned to the committee" }, { status: 409 })
    return apiError(error, "Failed to update committee")
  }
}
