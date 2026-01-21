import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const userRole = req.headers.get("x-user-role")
    const { id } = await req.json()

    // Only admin and super_admin can reject
    if (userRole !== "admin" && userRole !== "super_admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    // Delete gallery item
    const { error } = await supabase
      .from("gallery")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("[v0] Supabase error:", error)
      return NextResponse.json(
        { error: "Failed to reject gallery item" },
        { status: 500 }
      )
    }

    console.log(`[v0] Gallery item rejected: ${id}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Reject gallery endpoint error:", error)
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    )
  }
}
