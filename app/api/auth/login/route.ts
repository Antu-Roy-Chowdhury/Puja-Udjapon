import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    console.log("[v0] Login attempt for:", email)

    // 1️⃣ Auth check
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !authData.user) {
      console.error("[v0] Auth error:", error?.message)
      return NextResponse.json(
        { status: "INVALID", error: "Invalid email or password" },
        { status: 401 }
      )
    }

    console.log("[v0] Auth success, user ID:", authData.user.id)
    const userId = authData.user.id

    // 2️⃣ Profile check
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()

    if (profileError || !profile) {
      console.error("[v0] Profile error:", profileError?.message)
      return NextResponse.json(
        { status: "INVALID", error: "User profile not found" },
        { status: 401 }
      )
    }

    console.log("[v0] Profile found:", profile.email, "Approved:", profile.approved)

    // 3️⃣ Approval gate
    if (!profile.approved) {
      console.log("[v0] User not approved yet")
      return NextResponse.json({ 
        status: "PENDING",
        error: "Your account is pending admin approval" 
      })
    }

    // 4️⃣ Success
    console.log("[v0] Login successful for:", email)
    return NextResponse.json({
      status: "OK",
      user: profile,
    })
  } catch (error) {
    console.error("[v0] Login endpoint error:", error)
    return NextResponse.json(
      { status: "INVALID", error: "An error occurred during login" },
      { status: 500 }
    )
  }
}
