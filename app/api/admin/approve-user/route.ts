import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

function isAlumni(seriesYear: string): boolean {
  if (!seriesYear) return false
  const yearNum = parseInt(seriesYear, 10)
  return yearNum <= 2019
}

export async function POST(req: Request) {
  try {
    const userRole = req.headers.get("x-user-role")
    const { targetEmail } = await req.json()

    if (userRole !== "admin" && userRole !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", targetEmail)
      .single()

    if (fetchError || !profile) {
      console.error("[v0] User not found:", fetchError)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (profile.approved || profile.isApproved) {
      return NextResponse.json({ error: "User already approved" }, { status: 400 })
    }

    const alumniStatus = isAlumni(profile.series)
    const approvalUpdate = await supabase
      .from("profiles")
      .update({ approved: true })
      .eq("email", targetEmail)

    if (approvalUpdate.error) {
      const fallbackUpdate = await supabase
        .from("profiles")
        .update({ isApproved: true })
        .eq("email", targetEmail)

      if (fallbackUpdate.error) {
        console.error("[v0] Update error:", fallbackUpdate.error)
        return NextResponse.json({ error: "Failed to approve user" }, { status: 500 })
      }
    }

    const authUser = await supabase.auth.admin.getUserById(profile.id)
    const metadata = authUser.data.user?.user_metadata || {}

    const memberPayload = {
      id: profile.id,
      profile_id: profile.id,
      name: profile.name,
      position: "Member",
      role: profile.role,
      department: profile.department,
      series: profile.series,
      email: profile.email,
      phone: metadata.contact || null,
      avatar: profile.photo || metadata.photo || null,
      bio: metadata.bio || null,
      join_date: new Date().toISOString().split("T")[0],
      is_alumni: alumniStatus,
    }

    const insertError = await supabase.from("members").upsert(memberPayload, { onConflict: "id" })

    if (insertError.error) {
      console.error("[v0] Insert error:", insertError.error)
      return NextResponse.json({ error: "Failed to add to members list" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Approve user endpoint error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
