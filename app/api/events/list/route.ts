import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    // Fetch approved events, ordered by start date
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("approved", true)
      .order("start_time", { ascending: true })

    if (error) throw error

    console.log("[v0] Fetched events:", data)
    return NextResponse.json({ events: data || [] })
  } catch (error) {
    console.error("[v0] Get events error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch events" },
      { status: 500 }
    )
  }
}
