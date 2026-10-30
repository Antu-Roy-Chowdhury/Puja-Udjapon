import { NextResponse } from "next/server"

import { apiError } from "@/lib/api-error"
import { requireUser } from "@/lib/auth"
import { getDatabase } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const user = await requireUser()
    const { name, department, series, photo, contact, bloodGroup, bio } = await req.json()
    const sql = getDatabase()
    const rows = await sql`
      WITH updated_profile AS (
        UPDATE profiles
        SET name = ${String(name || user.name).trim()},
            department = ${department || null},
            series = ${series || null},
            photo = ${photo || null},
            contact = ${contact || null},
            blood_group = ${bloodGroup || null},
            bio = ${bio || null},
            updated_at = NOW()
        WHERE id = ${user.id}
        RETURNING *
      ), updated_member AS (
        UPDATE members
        SET name = (SELECT name FROM updated_profile),
            department = (SELECT department FROM updated_profile),
            series = (SELECT series FROM updated_profile),
            phone = (SELECT contact FROM updated_profile),
            avatar = (SELECT photo FROM updated_profile),
            bio = (SELECT bio FROM updated_profile),
            updated_at = NOW()
        WHERE profile_id = ${user.id} OR id = ${user.id}
      )
      SELECT * FROM updated_profile
    `

    const profile = rows[0] as Record<string, any>
    const approved = Boolean(profile.approved)
    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        approved,
        isApproved: approved,
        department: profile.department || "",
        series: profile.series || "",
        photo: profile.photo || "",
        contact: profile.contact || "",
        bloodGroup: profile.blood_group || "",
        bio: profile.bio || "",
      },
    })
  } catch (error) {
    console.error("Profile update failed", error)
    return apiError(error, "Failed to update profile")
  }
}
