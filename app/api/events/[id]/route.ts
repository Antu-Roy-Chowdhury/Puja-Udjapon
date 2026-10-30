import { NextResponse } from "next/server"
import { apiError } from "@/lib/api-error"
import { requireAdmin } from "@/lib/auth"
import { normalizeEvent } from "@/lib/content"
import { getDatabase } from "@/lib/db"
import { toDhakaIso } from "@/lib/dates"
import { HIDDEN_GOOGLE_EVENT_TITLE } from "@/lib/googleCalendar"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const { title, description, start_date, end_date, location, image_url } = await req.json()
    const rows = await getDatabase()`
      UPDATE events SET title = ${title}, description = ${description || ""}, start_time = ${toDhakaIso(start_date)},
        end_time = ${toDhakaIso(end_date)}, location = ${location || ""}, image_url = ${image_url || ""}, updated_at = NOW()
      WHERE id = ${id} RETURNING *
    `
    if (!rows[0]) return NextResponse.json({ error: "Event not found" }, { status: 404 })
    return NextResponse.json({ event: { ...normalizeEvent(rows[0]), source: "manual", editable: true, google_event_id: null } })
  } catch (error) {
    console.error("Update event failed", error)
    return apiError(error, "Failed to update event")
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAdmin()
    const { id } = await params
    const body = await req.json().catch(() => ({}))
    const sql = getDatabase()
    if (body?.source === "google" && body?.google_event_id) {
      await sql`INSERT INTO events (title, description, start_time, end_time, location, created_by, approved)
        VALUES (${HIDDEN_GOOGLE_EVENT_TITLE}, ${body.google_event_id}, NOW(), NOW(), 'hidden-google-event', ${user.id}, FALSE)`
    } else {
      await sql`DELETE FROM events WHERE id = ${id}`
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete event failed", error)
    return apiError(error, "Failed to delete event")
  }
}
