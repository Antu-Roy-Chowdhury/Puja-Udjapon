import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    // Fetch all events (unapproved for admins, approved for public)
    const { data, error } = await supabase
      .from("events")
      .select("id, title, description, start_time, end_time, location, approved")
      .order("start_time", { ascending: true })

    if (error) throw error

    // Transform data to match expected format
    const events = data?.map((event: any) => ({
      ...event,
      start_time: event.start_time,
      end_date: event.end_time,
    })) || []

    console.log("[v0] Fetched events:", events)
    return NextResponse.json({ events })
  } catch (error) {
    console.error("[v0] Get events error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch events" },
      { status: 500 }
    )
  }
}
