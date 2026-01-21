import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  try {
    const userRole = req.headers.get("x-user-role")

    // Only admin and super_admin can access
    if (userRole !== "admin" && userRole !== "super_admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    // Fetch pending gallery items (approved = false)
    const { data: pendingGallery, error } = await supabase
      .from("gallery")
      .select("id, title, type, url, thumbnail, uploaded_by, description, created_at")
      .eq("approved", false)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Supabase error:", error)
      return NextResponse.json(
        { error: "Failed to fetch pending gallery items" },
        { status: 500 }
      )
    }

    return NextResponse.json(pendingGallery || [])
  } catch (error) {
    console.error("[v0] Pending gallery endpoint error:", error)
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    )
  }
}
