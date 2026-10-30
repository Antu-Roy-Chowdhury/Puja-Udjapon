import { NextResponse } from "next/server"

import { normalizeActivity } from "@/lib/content"
import { getDatabase } from "@/lib/db"

export async function GET() {
  try {
    const rows = await getDatabase()`SELECT * FROM activities ORDER BY name ASC`
    return NextResponse.json({ activities: rows.map((row) => normalizeActivity(row)) })
  } catch (error) {
    console.error("Activities list failed", error)
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 })
  }
}
