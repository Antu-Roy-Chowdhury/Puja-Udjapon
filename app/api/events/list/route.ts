import { NextResponse } from "next/server"

import { getEvents } from "@/lib/getEvents"

export async function GET() {
  try {
    const events = await getEvents()
    return NextResponse.json({ events })
  } catch (error) {
    console.error("[v0] Get events error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch events" },
      { status: 500 },
    )
  }
}
