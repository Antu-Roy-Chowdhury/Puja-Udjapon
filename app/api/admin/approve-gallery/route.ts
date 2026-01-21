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

    // Only admin and super_admin can approve
    if (userRole !== "admin" && userRole !== "super_admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    // Update gallery item to approved
    const { error } = await supabase
      .from("gallery")
      .update({ approved: true })
      .eq("id", id)

    if (error) {
      console.error("[v0] Supabase error:", error)
      return NextResponse.json(
        { error: "Failed to approve gallery item" },
        { status: 500 }
      )
    }

    console.log(`[v0] Gallery item approved: ${id}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Approve gallery endpoint error:", error)
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    )
  }
}
