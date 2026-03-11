import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

import { normalizeActivity } from "@/lib/content"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function GET() {
  try {
    const { data, error } = await supabase.from("activities").select("*")
    if (error) throw error

    const activities = (data || []).map((activity) => normalizeActivity(activity)).sort((a, b) => a.name.localeCompare(b.name))
    return NextResponse.json({ activities })
  } catch (error) {
    console.error("[v0] Activities list error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to fetch activities" }, { status: 500 })
  }
}
