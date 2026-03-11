import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

import { getApprovalValue } from "@/lib/content"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

async function fetchMembers() {
  const primary = await supabase
    .from("members")
    .select("id, profile_id, name, position, department, series, email, phone, location, avatar, join_date, bio, is_alumni")

  if (!primary.error) {
    return primary
  }

  if (!String(primary.error.message || "").includes("profile_id")) {
    return primary
  }

  return supabase
    .from("members")
    .select("id, name, position, department, series, email, phone, location, avatar, join_date, bio, is_alumni")
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const filterAlumni = searchParams.get("alumni")

    const [{ data: members, error: memberError }, { data: profiles, error: profileError }] = await Promise.all([
      fetchMembers(),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    ])

    if (memberError || profileError) {
      console.error("[v0] Members endpoint error:", memberError || profileError)
      return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 })
    }

    const memberMap = new Map<string, any>()

    for (const member of members || []) {
      const key = (member as any).profile_id || member.id
      memberMap.set(key, {
        id: member.id,
        profileId: key,
        name: member.name,
        position: member.position || "Committee Member",
        department: member.department,
        series: member.series,
        email: member.email,
        phone: member.phone,
        location: member.location,
        avatar: member.avatar,
        joinDate: member.join_date,
        bio: member.bio,
        isAlumni: Boolean(member.is_alumni),
      })
    }

    for (const profile of profiles || []) {
      if (!getApprovalValue(profile)) continue
      if (!memberMap.has(profile.id)) {
        memberMap.set(profile.id, {
          id: profile.id,
          profileId: profile.id,
          name: profile.name,
          position: "Committee Member",
          department: profile.department,
          series: profile.series,
          email: profile.email,
          phone: "",
          location: "",
          avatar: profile.photo,
          joinDate: profile.created_at,
          bio: "",
          isAlumni: false,
        })
      }
    }

    let result = Array.from(memberMap.values())
    if (filterAlumni === "true") result = result.filter((member) => member.isAlumni)
    if (filterAlumni === "false") result = result.filter((member) => !member.isAlumni)

    result.sort((a, b) => a.position.localeCompare(b.position) || a.name.localeCompare(b.name))
    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Members endpoint error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
