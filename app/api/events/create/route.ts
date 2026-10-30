import { NextResponse } from "next/server"
import { apiError } from "@/lib/api-error"
import { requireAdmin } from "@/lib/auth"
import { normalizeEvent } from "@/lib/content"
import { getDatabase } from "@/lib/db"
import { toDhakaIso } from "@/lib/dates"

export async function POST(req: Request) {
  try {
    const user = await requireAdmin()
    const { title, description, start_date, end_date, location, image_url } = await req.json()
    if (!title || !start_date || !end_date) return NextResponse.json({ error: "Title, start time, and end time are required" }, { status: 400 })
    const startTime = toDhakaIso(start_date)
    const endTime = toDhakaIso(end_date)
    if (new Date(endTime) < new Date(startTime)) return NextResponse.json({ error: "End time must be after start time" }, { status: 400 })
    const rows = await getDatabase()`
      INSERT INTO events (title, description, start_time, end_time, location, image_url, created_by, approved)
      VALUES (${title}, ${description || ""}, ${startTime}, ${endTime}, ${location || ""}, ${image_url || ""}, ${user.id}, TRUE)
      RETURNING *
    `
    return NextResponse.json({ status: "OK", event: normalizeEvent(rows[0]) })
  } catch (error) {
    console.error("Create event failed", error)
    return apiError(error, "Failed to create event")
  }
}
