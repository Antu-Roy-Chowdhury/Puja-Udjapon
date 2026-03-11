import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

import { getApprovalValue } from "@/lib/content"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function GET(req: Request) {
  try {
    const userRole = req.headers.get("x-user-role")

    if (userRole !== "admin" && userRole !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { data: profiles, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Pending users fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch pending users" }, { status: 500 })
    }

    const pendingUsers = (profiles || []).filter((profile) => !getApprovalValue(profile))
    return NextResponse.json(pendingUsers)
  } catch (error) {
    console.error("[v0] Pending users endpoint error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
