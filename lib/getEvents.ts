import { createClient } from "@supabase/supabase-js"

import { normalizeEvent } from "@/lib/content"
import { getGoogleCalendarEvents, getHiddenGoogleEventIds } from "@/lib/googleCalendar"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export async function getEvents(limit?: number) {
  try {
    const now = new Date().toISOString()
    const [manualResult, googleEvents, hiddenGoogleEventIds] = await Promise.all([
      supabase.from("events").select("*").gte("start_time", now).order("start_time", { ascending: true }),
      getGoogleCalendarEvents(),
      getHiddenGoogleEventIds(supabase),
    ])

    if (manualResult.error) {
      console.error("[v0] Failed to fetch manual events:", manualResult.error)
    }

    const manualEvents = (manualResult.data || [])
      .filter((event: any) => event.title !== "__HIDDEN_GOOGLE_EVENT__")
      .map((event: any) => ({
        ...normalizeEvent(event),
        source: "manual",
        editable: true,
        google_event_id: null,
      }))

    const visibleGoogleEvents = googleEvents.filter((event) => !hiddenGoogleEventIds.has(event.google_event_id))

    const merged = [...visibleGoogleEvents, ...manualEvents]
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())

    return typeof limit === "number" ? merged.slice(0, limit) : merged
  } catch (error) {
    console.error("[v0] Error in getEvents:", error)
    return []
  }
}
