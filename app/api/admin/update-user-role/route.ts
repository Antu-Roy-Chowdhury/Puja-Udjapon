import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const userRole = req.headers.get("x-user-role")
    const { userId, newRole } = await req.json()

    // Only super_admin can change roles
    if (userRole !== "super_admin") {
      return NextResponse.json(
        { error: "Only super_admin can change user roles" },
        { status: 403 }
      )
    }

    // Validate new role
    if (!["member", "admin", "super_admin"].includes(newRole)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      )
    }

    // Update user role in profiles table
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId)

    if (updateError) {
      console.error("[v0] Update error:", updateError)
      return NextResponse.json(
        { error: "Failed to update user role" },
        { status: 500 }
      )
    }

    // Also update in members table if exists
    await supabase
      .from("members")
      .update({ role: newRole })
      .eq("id", userId)

    console.log(`[v0] User role updated: ${userId} -> ${newRole}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Update role endpoint error:", error)
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    )
  }
}
