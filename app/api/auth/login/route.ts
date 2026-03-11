import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    console.log("[v0] Login attempt for:", email)

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !authData.user) {
      console.error("[v0] Auth error:", error?.message)
      return NextResponse.json(
        { status: "INVALID", error: "Invalid email or password" },
        { status: 401 },
      )
    }

    const userId = authData.user.id

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()

    if (profileError || !profile) {
      console.error("[v0] Profile error:", profileError?.message)
      return NextResponse.json(
        { status: "INVALID", error: "User profile not found" },
        { status: 401 },
      )
    }

    const isApproved = Boolean(profile.approved ?? profile.isApproved)

    if (!isApproved) {
      return NextResponse.json({
        status: "PENDING",
        error: "Your account is pending admin approval",
      })
    }

    const metadata = authData.user.user_metadata || {}
    const mergedUser = {
      ...profile,
      approved: isApproved,
      isApproved,
      contact: metadata.contact || "",
      bloodGroup: metadata.bloodGroup || "",
      bio: metadata.bio || "",
      photo: profile.photo || metadata.photo || "",
    }

    console.log("[v0] Login successful for:", email)
    return NextResponse.json({
      status: "OK",
      user: mergedUser,
    })
  } catch (error) {
    console.error("[v0] Login endpoint error:", error)
    return NextResponse.json(
      { status: "INVALID", error: "An error occurred during login" },
      { status: 500 },
    )
  }
}
