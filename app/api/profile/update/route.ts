import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { userId, name, email, department, series, photo } = await req.json()

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    // Update profile with only columns that exist in the schema
    const { data, error } = await supabase
      .from("profiles")
      .update({
        name,
        email,
        department,
        series,
        photo,
      })
      .eq("id", userId)
      .select()

    if (error) {
      console.error("[v0] Profile update error:", error)
      return NextResponse.json(
        { error: error.message || "Failed to update profile" },
        { status: 400 }
      )
    }

    console.log("[v0] Profile updated:", data)
    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: data?.[0],
    })
  } catch (error) {
    console.error("[v0] Profile update error:", error)
    return NextResponse.json(
      { error: "An error occurred while updating profile" },
      { status: 500 }
    )
  }
}
