import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

import { normalizeEvent } from "@/lib/content"
import { HIDDEN_GOOGLE_EVENT_TITLE } from "@/lib/googleCalendar"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { title, description, start_date, end_date, location, image_url } = await req.json()

    const payloads = [
      { title, description, start_time: start_date, end_time: end_date, location, image_url: image_url || "" },
      { title, description, start_time: start_date, end_time: end_date, location },
    ]

    let updated = null
    let lastError: any = null

    for (const payload of payloads) {
      const result = await supabase.from("events").update(payload).eq("id", id).select().single()
      if (!result.error) {
        updated = result.data
        lastError = null
        break
      }
      lastError = result.error
    }

    if (lastError) throw lastError

    return NextResponse.json({ event: { ...normalizeEvent(updated), source: "manual", editable: true, google_event_id: null } })
  } catch (error) {
    console.error("[v0] Update event error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to update event" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json().catch(() => ({}))

    if (body?.source === "google" && body?.google_event_id) {
      const hideAttempts = [
        { title: HIDDEN_GOOGLE_EVENT_TITLE, description: body.google_event_id, start_time: new Date().toISOString(), end_time: new Date().toISOString(), location: "hidden-google-event", created_by: null },
        { title: HIDDEN_GOOGLE_EVENT_TITLE, description: body.google_event_id, start_time: new Date().toISOString(), end_time: new Date().toISOString(), location: "hidden-google-event" },
      ]

      let hideError: any = null
      for (const payload of hideAttempts) {
        const result = await supabase.from("events").insert(payload)
        if (!result.error) {
          hideError = null
          break
        }
        hideError = result.error
      }

      if (hideError) throw hideError
      return NextResponse.json({ success: true })
    }

    const { error } = await supabase.from("events").delete().eq("id", id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete event error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to delete event" }, { status: 500 })
  }
}
