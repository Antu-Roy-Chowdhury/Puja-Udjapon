import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

import { normalizeActivity } from "@/lib/content"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(req: Request) {
  try {
    const { name, description, image_url, schedule, duration, level, active } = await req.json()

    if (!name || !description) {
      return NextResponse.json({ error: "Name and description are required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("activities")
      .insert({
        name,
        description,
        image: image_url || "",
        schedule: schedule || "",
        duration: duration || "",
        level: level || "beginner",
        active: typeof active === "boolean" ? active : true,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ status: "OK", activity: normalizeActivity(data) })
  } catch (error) {
    console.error("[v0] Create activity error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create activity" },
      { status: 500 },
    )
  }
}

