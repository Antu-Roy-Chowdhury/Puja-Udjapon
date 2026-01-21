export interface Donation {
  id?: string
  donor_name: string
  amount: number
  payment_method: "Bkash" | "Nagad" | "BankAccount" | "Cash"
  transaction_id: string
  email?: string
  phone?: string
  status: "pending" | "completed" | "failed"
  created_at?: string
}

export async function createDonation(
  donationData: Omit<Donation, "id" | "created_at">
): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    const res = await fetch("/api/donations/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(donationData),
    })

    const data = await res.json()

    if (!res.ok) {
      return {
        success: false,
        message: "Donation failed",
        error: data.error || "Unknown error",
      }
    }

    return {
      success: true,
      message: data.message || "Donation created successfully",
    }
  } catch (error) {
    console.error("[v0] Donation error:", error)
    return {
      success: false,
      message: "Donation failed",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function getDonations(
  status?: string,
  limit?: number
): Promise<{ success: boolean; donations: Donation[]; count: number; error?: string }> {
  try {
    const params = new URLSearchParams()
    if (status) params.append("status", status)
    if (limit) params.append("limit", limit.toString())

    const res = await fetch(`/api/donations/list?${params}`)
    const data = await res.json()

    if (!res.ok) {
      return {
        success: false,
        donations: [],
        count: 0,
        error: data.error || "Failed to fetch donations",
      }
    }

    return {
      success: true,
      donations: data.data || [],
      count: data.count || 0,
    }
  } catch (error) {
    console.error("[v0] Fetch donations error:", error)
    return {
      success: false,
      donations: [],
      count: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
