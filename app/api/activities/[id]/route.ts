import { NextResponse } from "next/server"

import { apiError } from "@/lib/api-error"
import { requireAdmin } from "@/lib/auth"
import { normalizeActivity } from "@/lib/content"
import { getDatabase } from "@/lib/db"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const { name, description, image_url, schedule, duration, level, active } = await req.json()
    const rows = await getDatabase()`
      UPDATE activities
      SET name = ${name}, description = ${description}, image = ${image_url || ""},
          schedule = ${schedule || ""}, duration = ${duration || ""}, level = ${level || "beginner"},
          active = ${typeof active === "boolean" ? active : true}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    if (!rows[0]) return NextResponse.json({ error: "Activity not found" }, { status: 404 })
    return NextResponse.json({ activity: normalizeActivity(rows[0]) })
  } catch (error) {
    console.error("Update activity failed", error)
    return apiError(error, "Failed to update activity")
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    await getDatabase()`DELETE FROM activities WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete activity failed", error)
    return apiError(error, "Failed to delete activity")
  }
}
