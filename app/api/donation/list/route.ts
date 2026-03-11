import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

function normalizeAmount(value: unknown) {
  const amount = typeof value === "number" ? value : Number(value)
  return Number.isFinite(amount) ? amount : 0
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const limit = Number(searchParams.get("limit") || "50")

    let query = supabase.from("donations").select("*").order("created_at", { ascending: false }).limit(limit)

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query

    if (error) {
      console.error("[v0] Donations fetch error:", error)
      return NextResponse.json({ error: error.message || "Failed to fetch donations" }, { status: 400 })
    }

    const donations = (data || []).map((item) => ({ ...item, amount: normalizeAmount(item.amount) }))

    return NextResponse.json({
      success: true,
      data: donations,
      count: donations.length,
    })
  } catch (error) {
    console.error("[v0] Donations list error:", error)
    return NextResponse.json({ error: "An error occurred while fetching donations" }, { status: 500 })
  }
}

