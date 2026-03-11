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
    .select("id, profile_id, position, department, series, email, phone, avatar, join_date, bio, is_alumni, role")

  if (!primary.error) {
    return primary
  }

  if (!String(primary.error.message || "").includes("profile_id")) {
    return primary
  }

  return supabase
    .from("members")
    .select("id, position, department, series, email, phone, avatar, join_date, bio, is_alumni, role")
}

export async function GET(req: Request) {
  try {
    const userRole = req.headers.get("x-user-role")

    if (userRole !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const [{ data: allUsers, error }, { data: members, error: memberError }] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      fetchMembers(),
    ])

    if (error || memberError) {
      console.error("[v0] All users fetch error:", error || memberError)
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }

    const memberMap = new Map<string, any>()

    for (const member of members || []) {
      const key = (member as any).profile_id || member.id
      memberMap.set(key, member)
    }

    const approvedUsers = (allUsers || [])
      .filter((user) => getApprovalValue(user))
      .map((user) => {
        const member = memberMap.get(user.id)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          department: member?.department || user.department || "",
          series: member?.series || user.series || "",
          photo: user.photo || member?.avatar || "",
          role: member?.role || user.role || "member",
          position: member?.position || "Committee Member",
          phone: member?.phone || user.contact || "",
          joinDate: member?.join_date || user.created_at,
          isAlumni: Boolean(member?.is_alumni),
        }
      })

    return NextResponse.json(approvedUsers)
  } catch (error) {
    console.error("[v0] All users endpoint error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}

