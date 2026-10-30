import { NextResponse } from "next/server"
import { apiError } from "@/lib/api-error"
import { requireRole } from "@/lib/auth"
import { getDatabase } from "@/lib/db"

export async function GET() {
  try {
    await requireRole(["super_admin"])
    const rows = await getDatabase()`
      SELECT COUNT(*)::integer AS total_donations,
        COALESCE(SUM(amount), 0)::float8 AS total_amount,
        COALESCE(AVG(amount), 0)::float8 AS average_donation,
        COUNT(*) FILTER (WHERE status = 'pending')::integer AS pending,
        COUNT(*) FILTER (WHERE status = 'completed')::integer AS completed,
        COUNT(*) FILTER (WHERE status = 'failed')::integer AS failed
      FROM donations
    `
    const stats = rows[0]
    return NextResponse.json({
      totalDonations: stats.total_donations,
      totalAmount: Number(stats.total_amount),
      averageDonation: Number(Number(stats.average_donation).toFixed(2)),
      statusBreakdown: { pending: stats.pending, completed: stats.completed, failed: stats.failed },
    })
  } catch (error) {
    console.error("Donation stats failed", error)
    return apiError(error, "Failed to fetch donation statistics")
  }
}
