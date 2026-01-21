import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const filterAlumni = searchParams.get("alumni")

    // Fetch all members from members table
    const { data: members, error } = await supabase
      .from("members")
      .select("id, name, position, role, department, series, email, phone, location, avatar, join_date, bio, is_alumni")
      .order("join_date", { ascending: false })

    if (error) {
      console.error("[v0] Supabase error:", error)
      return NextResponse.json(
        { error: "Failed to fetch members" },
        { status: 500 }
      )
    }

    // Filter by alumni status if requested
    let result = members || []
    if (filterAlumni === "true") {
      result = result.filter((m) => m.is_alumni === true)
    } else if (filterAlumni === "false") {
      result = result.filter((m) => m.is_alumni === false)
    }

    // Transform to match expected format
    const formattedMembers = result.map((member) => ({
      id: member.id,
      name: member.name,
      position: member.position || "Member",
      role: member.role,
      department: member.department,
      series: member.series,
      email: member.email,
      phone: member.phone,
      location: member.location,
      avatar: member.avatar,
      joinDate: member.join_date,
      bio: member.bio,
      isAlumni: member.is_alumni,
    }))

    return NextResponse.json(formattedMembers)
  } catch (error) {
    console.error("[v0] Members endpoint error:", error)
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    )
  }
}
