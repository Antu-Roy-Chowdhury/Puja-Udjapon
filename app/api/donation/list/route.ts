import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const limit = searchParams.get("limit") || "50"

    let query = supabase
      .from("donations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(Number(limit))

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query

    if (error) {
      console.error("[v0] Donations fetch error:", error)
      return NextResponse.json(
        { error: error.message || "Failed to fetch donations" },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
      count: data?.length || 0,
    })
  } catch (error) {
    console.error("[v0] Donations list error:", error)
    return NextResponse.json(
      { error: "An error occurred while fetching donations" },
      { status: 500 }
    )
  }
}
