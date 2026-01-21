import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("[v0] Signup request received:", { ...body, password: "***" })
    const { name, email, password, department, series, photo } = body

    // Validate input
    if (!name || !email || !password || !department || !series) {
      console.log("[v0] Missing required fields:", { name: !!name, email: !!email, password: !!password, department: !!department, series: !!series })
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const { data: existingUsers } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      )
    }

    // Create auth user
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (error) {
      console.error("[v0] Auth creation error:", error)
      return NextResponse.json(
        { error: error.message || "Failed to create account" },
        { status: 400 }
      )
    }

    const userId = data.user.id

    // Create profile
    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      name,
      email,
      department,
      series,
      photo,
      role: "member",
      approved: false,
    })

    if (profileError) {
      console.error("[v0] Profile creation error:", profileError)
      // Delete the auth user if profile creation fails
      await supabase.auth.admin.deleteUser(userId)
      return NextResponse.json(
        { error: profileError.message || "Failed to create profile" },
        { status: 400 }
      )
    }

    console.log("[v0] Signup successful for:", email)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json(
      { error: "An error occurred during signup" },
      { status: 500 }
    )
  }
}
