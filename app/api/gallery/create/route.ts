import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      title,
      type,
      url,
      thumbnail = "",
      uploadedBy,
      description = "",
      tags = [],
    } = body

    // Get user ID from uploaded_by (email)
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", uploadedBy)
      .single()

    const id = crypto.randomUUID()

    const { error } = await supabase
      .from("gallery")
      .insert({
        id,
        title,
        type,
        url,
        thumbnail,
        uploaded_by: profile?.id,
        description,
        tags,
        approved: false,
      })

    if (error) {
      console.error("[v0] Supabase error:", error)
      return NextResponse.json(
        { error: "Failed to create gallery item" },
        { status: 500 }
      )
    }

    console.log(`[v0] Gallery item created: ${id}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Gallery create error:", error)
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    )
  }
}
