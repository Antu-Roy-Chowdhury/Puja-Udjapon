import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"

export async function GET() {
  try {
    const events = await getDatabase()`
      SELECT id, title, description, start_time, end_time, location, approved
      FROM events WHERE title <> '__HIDDEN_GOOGLE_EVENT__' ORDER BY start_time ASC
    `
    return NextResponse.json({ events })
  } catch (error) {
    console.error("Get events failed", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}
