import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    // Fetch all donations
    const { data: donations, error } = await supabase
      .from("donations")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    // Calculate statistics
    const stats = {
      totalDonations: donations?.length || 0,
      totalAmount: donations?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0,
      averageDonation: donations && donations.length > 0
        ? (donations.reduce((sum, d) => sum + (d.amount || 0), 0) / donations.length).toFixed(2)
        : 0,
      donations: donations || [],
      statusBreakdown: {
        pending: donations?.filter(d => d.status === 'pending').length || 0,
        completed: donations?.filter(d => d.status === 'completed').length || 0,
        failed: donations?.filter(d => d.status === 'failed').length || 0,
      }
    }

    console.log("[v0] Donation stats:", stats)
    return NextResponse.json(stats)
  } catch (error) {
    console.error("[v0] Donation stats error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch donation statistics" },
      { status: 500 }
    )
  }
}
