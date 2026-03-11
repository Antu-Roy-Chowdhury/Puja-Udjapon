import { createClient } from "@supabase/supabase-js"

import { formatEventTime } from "@/lib/content"

const HIDDEN_GOOGLE_EVENT_TITLE = "__HIDDEN_GOOGLE_EVENT__"

export type CalendarEvent = {
  id: string
  title: string
  description: string
  location: string
  start_time: string
  end_time: string
  image_url: string
  time: string
  month: string
  source: "google"
  editable: false
  google_event_id: string
}

function getDateValue(dateField: { dateTime?: string; date?: string } | null | undefined, isEnd = false) {
  if (!dateField) return ""
  if (dateField.dateTime) return dateField.dateTime
  if (dateField.date) {
    const suffix = isEnd ? "T23:59:59.000Z" : "T00:00:00.000Z"
    return new Date(`${dateField.date}${suffix}`).toISOString()
  }
  return ""
}

function parseCalendarIdFromUrl(url?: string) {
  if (!url) return ""

  try {
    const decoded = decodeURIComponent(url)
    const cidMatch = decoded.match(/[?&]cid=([^&]+)/)
    if (cidMatch?.[1]) return decodeURIComponent(cidMatch[1])

    const srcMatch = decoded.match(/src=([^&]+)/)
    if (srcMatch?.[1]) return decodeURIComponent(srcMatch[1])
  } catch {
    return ""
  }

  return ""
}

function getConfiguredCalendarId() {
  return (
    process.env.GOOGLE_CALENDAR_ID ||
    parseCalendarIdFromUrl(process.env.GOOGLE_CALENDAR_WEB_PUBLIC_URL) ||
    parseCalendarIdFromUrl(process.env.GOOGLE_CALENDAR_SHAREABLE_LINK) ||
    ""
  )
}

async function fetchWithApiKey(calendarId: string) {
  const apiKey = process.env.GOOGLE_CALENDAR_API_KEY
  if (!apiKey || !calendarId) return []

  const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`)
  url.searchParams.set("key", apiKey)
  url.searchParams.set("singleEvents", "true")
  url.searchParams.set("orderBy", "startTime")
  url.searchParams.set("timeMin", new Date().toISOString())
  url.searchParams.set("maxResults", "100")

  const res = await fetch(url.toString(), { next: { revalidate: 300 } })
  if (!res.ok) {
    throw new Error(`Google Calendar request failed with ${res.status}`)
  }

  const payload = await res.json()
  return payload.items || []
}

export async function getGoogleCalendarEvents() {
  const calendarId = getConfiguredCalendarId()
  if (!calendarId) {
    return [] as CalendarEvent[]
  }

  try {
    const items = await fetchWithApiKey(calendarId)

    return items
      .filter((item: any) => item.status !== "cancelled")
      .map((item: any) => {
        const start_time = getDateValue(item.start)
        const end_time = getDateValue(item.end, true) || start_time
        return {
          id: `google:${item.id}`,
          title: item.summary || "Untitled event",
          description: item.description || "",
          location: item.location || "Venue to be announced",
          start_time,
          end_time,
          image_url: "",
          time: formatEventTime(start_time, end_time),
          month: start_time ? new Date(start_time).toLocaleString("en-US", { month: "long" }) : "",
          source: "google",
          editable: false,
          google_event_id: item.id,
        } satisfies CalendarEvent
      })
  } catch (error) {
    console.error("[v0] Failed to fetch Google Calendar events:", error)
    return [] as CalendarEvent[]
  }
}

export async function getHiddenGoogleEventIds(supabase?: any) {
  const client =
    supabase ||
    createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  try {
    const { data, error } = await client
      .from("events")
      .select("id, title, description")
      .eq("title", HIDDEN_GOOGLE_EVENT_TITLE)

    if (error) {
      console.error("[v0] Failed to fetch hidden Google events:", error)
      return new Set<string>()
    }

    return new Set((data || []).map((item: any) => item.description).filter(Boolean))
  } catch (error) {
    console.error("[v0] Failed to load hidden Google events:", error)
    return new Set<string>()
  }
}

export { HIDDEN_GOOGLE_EVENT_TITLE, getConfiguredCalendarId }

