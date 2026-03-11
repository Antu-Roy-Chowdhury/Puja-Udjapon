import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

import { normalizeEvent } from "@/lib/content"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(req: Request) {
  try {
    const { title, description, start_date, end_date, location, image_url } = await req.json()

    if (!title || !start_date || !end_date) {
      return NextResponse.json({ error: "Title, start time, and end time are required" }, { status: 400 })
    }

    const payloads = [
      { title, description: description || "", start_time: start_date, end_time: end_date, location: location || "", image_url: image_url || "", created_by: null, approved: true },
      { title, description: description || "", start_time: start_date, end_time: end_date, location: location || "", created_by: null, approved: true },
      { title, description: description || "", start_time: start_date, end_time: end_date, location: location || "", created_by: null },
      { title, description: description || "", start_time: start_date, end_time: end_date, location: location || "" },
    ]

    let created = null
    let lastError: any = null

    for (const payload of payloads) {
      const result = await supabase.from("events").insert(payload).select().single()
      if (!result.error) {
        created = result.data
        lastError = null
        break
      }
      lastError = result.error
    }

    if (lastError) throw lastError

    return NextResponse.json({ status: "OK", event: normalizeEvent(created) })
  } catch (error) {
    console.error("[v0] Create event error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to create event" }, { status: 500 })
  }
}
