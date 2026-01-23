import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    // Fetch approved gallery items from Supabase
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false })

    if (error) throw error

    console.log("[v0] Gallery items fetched:", data)
    return NextResponse.json({ gallery: data })
  } catch (error) {
    console.error("[v0] Gallery list error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch gallery" },
      { status: 500 }
    )
  }
}
