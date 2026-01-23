import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  try {
    const { title, description, start_date, end_date, location, image_url } = await req.json()

    if (!title || !start_date || !end_date) {
      return NextResponse.json({ error: "Title, start time, and end time are required" }, { status: 400 })
    }

    // Create event - use start_time and end_time columns per database schema
    const { data: event, error } = await supabase.from("events").insert({
      title,
      description,
      start_time: start_date,
      end_time: end_date,
      location,
      created_by: null, // Will be updated by admin action
    })

    if (error) throw error

    console.log("[v0] Event created:", event)
    return NextResponse.json({ status: "OK", event })
  } catch (error) {
    console.error("[v0] Create event error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create event" },
      { status: 500 }
    )
  }
}
