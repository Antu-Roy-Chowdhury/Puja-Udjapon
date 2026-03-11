import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

function normalizeAmount(value: unknown) {
  const amount = typeof value === "number" ? value : Number(value)
  return Number.isFinite(amount) ? amount : 0
}

export async function GET() {
  try {
    const { data: donations, error } = await supabase.from("donations").select("*").order("created_at", { ascending: false })

    if (error) throw error

    const normalizedDonations = (donations || []).map((donation) => ({
      ...donation,
      amount: normalizeAmount(donation.amount),
    }))

    const totalAmount = normalizedDonations.reduce((sum, donation) => sum + donation.amount, 0)

    const stats = {
      totalDonations: normalizedDonations.length,
      totalAmount,
      averageDonation: normalizedDonations.length > 0 ? Number((totalAmount / normalizedDonations.length).toFixed(2)) : 0,
      donations: normalizedDonations,
      statusBreakdown: {
        pending: normalizedDonations.filter((donation) => donation.status === "pending").length,
        completed: normalizedDonations.filter((donation) => donation.status === "completed").length,
        failed: normalizedDonations.filter((donation) => donation.status === "failed").length,
      },
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("[v0] Donation stats error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch donation statistics" },
      { status: 500 },
    )
  }
}

