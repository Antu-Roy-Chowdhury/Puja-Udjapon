import { NextResponse } from "next/server"

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID!
const API_KEY = process.env.GOOGLE_CALENDAR_API_KEY!

export async function GET() {
  // Start from beginning of current month
  const timeMin = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  ).toISOString()

  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
    CALENDAR_ID
  )}/events?key=${API_KEY}&timeMin=${timeMin}&singleEvents=true&orderBy=startTime`

  const res = await fetch(url, { cache: "no-store" })
  const data = await res.json()

  const events = (data.items || []).map((event: any) => {
    const startRaw = event.start.dateTime || event.start.date
    const endRaw = event.end.dateTime || event.end.date

    const startDate = new Date(startRaw)
    const endDate = endRaw ? new Date(endRaw) : startDate

    return {
      id: event.id,
      title: event.summary || "Untitled Event",
      description: event.description || "",
      location: event.location || "Temple",
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      date: startDate.toISOString().split("T")[0],
      month: startDate.toLocaleString("en-US", {
        month: "long",
        timeZone: "UTC",
      }),
      time: event.start.dateTime
        ? `${startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
        : "All day",
      registered: Number(event.extendedProperties?.shared?.registered || 0),
      capacity: Number(event.extendedProperties?.shared?.capacity || 0),
    }
  })

  return NextResponse.json(events)
}
