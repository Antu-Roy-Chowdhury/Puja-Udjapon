import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  try {
    const { name, description, image_url, schedule, duration, level } = await req.json()

    if (!name) {
      return NextResponse.json({ error: "Activity name is required" }, { status: 400 })
    }

    // Create activity with correct column name 'image'
    const { data: activity, error } = await supabase.from("activities").insert({
      name,
      description,
      image: image_url, // Use 'image' column as per database schema
      schedule,
      duration,
      level,
      active: true, // New activities are active by default
    })

    if (error) throw error

    console.log("[v0] Activity created:", activity)
    return NextResponse.json({ status: "OK", activity })
  } catch (error) {
    console.error("[v0] Create activity error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create activity" },
      { status: 500 }
    )
  }
}
