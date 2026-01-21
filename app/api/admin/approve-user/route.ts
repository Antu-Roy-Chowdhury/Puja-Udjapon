import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Helper function to calculate alumni status based on series year
function isAlumni(seriesYear: string): boolean {
  if (!seriesYear) return false
  const currentYear = new Date().getFullYear()
  const yearNum = parseInt(seriesYear, 10)
  
  // 2020 = current student, 2019 and before = alumni
  return yearNum <= 2019
}

export async function POST(req: Request) {
  try {
    const userRole = req.headers.get("x-user-role")
    const { targetEmail } = await req.json()

    // Only admin and super_admin can approve
    if (userRole !== "admin" && userRole !== "super_admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    // Fetch the user to approve
    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", targetEmail)
      .single()

    if (fetchError || !profile) {
      console.error("[v0] User not found:", fetchError)
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Prevent double approval
    if (profile.approved) {
      return NextResponse.json(
        { error: "User already approved" },
        { status: 400 }
      )
    }

    // Calculate alumni status
    const alumnusStatus = isAlumni(profile.series)

    // 1️⃣ Approve user in profiles table
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ approved: true })
      .eq("email", targetEmail)

    if (updateError) {
      console.error("[v0] Update error:", updateError)
      return NextResponse.json(
        { error: "Failed to approve user" },
        { status: 500 }
      )
    }

    // 2️⃣ Add to members table
    const { error: insertError } = await supabase
      .from("members")
      .insert({
        id: profile.id,
        name: profile.name,
        position: "Member",
        role: profile.role,
        department: profile.department,
        series: profile.series,
        email: profile.email,
        avatar: profile.photo,
        join_date: new Date().toISOString().split("T")[0],
        is_alumni: alumnusStatus,
      })
      .select()

    if (insertError) {
      // Check if it's a duplicate key error (member already exists)
      if (insertError.code !== "23505") {
        console.error("[v0] Insert error:", insertError)
        return NextResponse.json(
          { error: "Failed to add to members list" },
          { status: 500 }
        )
      }
    }

    console.log(`[v0] User approved: ${targetEmail}, Alumni: ${alumnusStatus}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Approve user endpoint error:", error)
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    )
  }
}
