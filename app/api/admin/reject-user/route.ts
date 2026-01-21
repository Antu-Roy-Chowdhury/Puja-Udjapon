import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const userRole = req.headers.get("x-user-role")
    const { targetEmail } = await req.json()

    // Only admin and super_admin can reject
    if (userRole !== "admin" && userRole !== "super_admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    // Fetch the user to reject
    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", targetEmail)
      .single()

    if (fetchError || !profile) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Delete from auth and profiles (cascade will handle it)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(
      profile.id
    )

    if (deleteError && !deleteError.message.includes("not found")) {
      console.error("[v0] Delete auth user error:", deleteError)
      return NextResponse.json(
        { error: "Failed to reject user" },
        { status: 500 }
      )
    }

    console.log(`[v0] User rejected: ${targetEmail}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Reject user endpoint error:", error)
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    )
  }
}
