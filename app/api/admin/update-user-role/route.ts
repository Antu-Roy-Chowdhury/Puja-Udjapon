import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(req: Request) {
  try {
    const userRole = req.headers.get("x-user-role")
    const { userId, newRole } = await req.json()

    if (userRole !== "super_admin") {
      return NextResponse.json({ error: "Only super_admin can change user roles" }, { status: 403 })
    }

    if (!["member", "admin", "super_admin"].includes(newRole)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    const { error: updateError } = await supabase.from("profiles").update({ role: newRole }).eq("id", userId)

    if (updateError) {
      console.error("[v0] Update error:", updateError)
      return NextResponse.json({ error: "Failed to update user role" }, { status: 500 })
    }

    let memberUpdate = await supabase.from("members").update({ role: newRole }).eq("id", userId)

    if (memberUpdate.error && String(memberUpdate.error.message || "").includes("No rows")) {
      memberUpdate = await supabase.from("members").update({ role: newRole }).eq("profile_id", userId)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Update role endpoint error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}

