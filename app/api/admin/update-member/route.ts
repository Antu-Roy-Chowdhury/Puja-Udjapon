import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

function isAlumni(seriesYear: string) {
  const yearNum = parseInt(seriesYear, 10)
  return Number.isFinite(yearNum) && yearNum <= 2019
}

export async function POST(req: Request) {
  try {
    const userRole = req.headers.get("x-user-role")
    if (userRole !== "super_admin") {
      return NextResponse.json({ error: "Only super admins can update committee assignments" }, { status: 403 })
    }

    const { userId, position, department, series, phone } = await req.json()
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", userId).single()
    if (profileError || !profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const safeDepartment = department || profile.department || ""
    const safeSeries = series || profile.series || ""
    const safePosition = position || "Committee Member"
    const safePhone = phone || ""

    const profileUpdate = await supabase.from("profiles").update({ department: safeDepartment, series: safeSeries }).eq("id", userId)
    if (profileUpdate.error) {
      console.error("[v0] Profile update error:", profileUpdate.error)
      return NextResponse.json({ error: profileUpdate.error.message || "Failed to update profile information" }, { status: 500 })
    }

    const memberPayload = {
      id: userId,
      profile_id: userId,
      name: profile.name,
      position: safePosition,
      role: profile.role || "member",
      department: safeDepartment,
      series: safeSeries,
      email: profile.email,
      phone: safePhone,
      avatar: profile.photo || null,
      bio: profile.bio || null,
      join_date: new Date(profile.created_at || new Date().toISOString()).toISOString().split("T")[0],
      is_alumni: isAlumni(safeSeries),
    }

    let memberResult = await supabase.from("members").upsert(memberPayload, { onConflict: "id" })
    if (memberResult.error && String(memberResult.error.message || "").includes("profile_id")) {
      const { profile_id, ...fallbackPayload } = memberPayload
      memberResult = await supabase.from("members").upsert(fallbackPayload, { onConflict: "id" })
    }

    if (memberResult.error) {
      console.error("[v0] Member update error:", memberResult.error)
      return NextResponse.json({ error: memberResult.error.message || "Failed to update committee assignment" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Update member endpoint error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
