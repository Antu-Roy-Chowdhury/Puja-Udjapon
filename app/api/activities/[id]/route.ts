import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

import { normalizeActivity } from "@/lib/content"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { name, description, image_url, schedule, duration, level, active } = await req.json()

    const { data, error } = await supabase
      .from("activities")
      .update({
        name,
        description,
        image: image_url || "",
        schedule: schedule || "",
        duration: duration || "",
        level: level || "beginner",
        active: typeof active === "boolean" ? active : true,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ activity: normalizeActivity(data) })
  } catch (error) {
    console.error("[v0] Update activity error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update activity" },
      { status: 500 },
    )
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { error } = await supabase.from("activities").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete activity error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete activity" },
      { status: 500 },
    )
  }
}

