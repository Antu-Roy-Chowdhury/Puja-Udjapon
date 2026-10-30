import { normalizeEvent } from "@/lib/content"
import { getDatabase } from "@/lib/db"
import { getGoogleCalendarEvents, getHiddenGoogleEventIds } from "@/lib/googleCalendar"

export async function getEvents(limit?: number) {
  try {
    const sql = getDatabase()
    const [manualRows, googleEvents, hiddenGoogleEventIds] = await Promise.all([
      sql`SELECT * FROM events WHERE start_time >= NOW() ORDER BY start_time ASC`,
      getGoogleCalendarEvents(),
      getHiddenGoogleEventIds(),
    ])
    const manualEvents = manualRows
      .filter((event) => event.title !== "__HIDDEN_GOOGLE_EVENT__")
      .map((event) => ({ ...normalizeEvent(event), source: "manual", editable: true, google_event_id: null }))
    const visibleGoogleEvents = googleEvents.filter((event) => !hiddenGoogleEventIds.has(event.google_event_id))
    const merged = [...visibleGoogleEvents, ...manualEvents]
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    return typeof limit === "number" ? merged.slice(0, limit) : merged
  } catch (error) {
    console.error("Failed to fetch events", error)
    return []
  }
}
