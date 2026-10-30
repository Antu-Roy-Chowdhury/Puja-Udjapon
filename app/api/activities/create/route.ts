import { NextResponse } from "next/server"

import { apiError } from "@/lib/api-error"
import { requireAdmin } from "@/lib/auth"
import { normalizeActivity } from "@/lib/content"
import { getDatabase } from "@/lib/db"

export async function POST(req: Request) {
  try {
    await requireAdmin()
    const { name, description, image_url, schedule, duration, level, active } = await req.json()
    if (!name || !description) {
      return NextResponse.json({ error: "Name and description are required" }, { status: 400 })
    }
    const rows = await getDatabase()`
      INSERT INTO activities (name, description, image, schedule, duration, level, active)
      VALUES (${name}, ${description}, ${image_url || ""}, ${schedule || ""}, ${duration || ""}, ${level || "beginner"}, ${typeof active === "boolean" ? active : true})
      RETURNING *
    `
    return NextResponse.json({ status: "OK", activity: normalizeActivity(rows[0]) })
  } catch (error) {
    console.error("Create activity failed", error)
    return apiError(error, "Failed to create activity")
  }
}
