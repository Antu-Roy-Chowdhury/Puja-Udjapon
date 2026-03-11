import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const PAYMENT_METHOD_VARIANTS: Record<string, string[]> = {
  bkash: ["bkash", "Bkash", "bKash"],
  nagad: ["nagad", "Nagad"],
  bank_transfer: ["bank_transfer", "BankTransfer", "BankAccount"],
  cash: ["cash", "Cash"],
}

export async function POST(req: Request) {
  try {
    const { donor_name, amount, payment_method, transaction_id, email, phone } = await req.json()

    if (!donor_name || !amount || !payment_method || !transaction_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (amount <= 0) {
      return NextResponse.json({ error: "Amount must be greater than 0" }, { status: 400 })
    }

    const variants = PAYMENT_METHOD_VARIANTS[payment_method] || [payment_method]
    let lastError: any = null
    let insertedData: any = null

    for (const methodVariant of variants) {
      const result = await supabase.from("donations").insert({
        donor_name,
        amount,
        payment_method: methodVariant,
        transaction_id,
        email,
        phone,
        status: "pending",
        created_at: new Date().toISOString(),
      }).select()

      if (!result.error) {
        insertedData = result.data
        lastError = null
        break
      }

      lastError = result.error
      if (!String(result.error.message || "").toLowerCase().includes("check constraint")) {
        break
      }
    }

    if (lastError) {
      console.error("[v0] Donation creation error:", lastError)
      return NextResponse.json({ error: lastError.message || "Failed to create donation" }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: "Donation recorded successfully.", data: insertedData })
  } catch (error) {
    console.error("[v0] Donation error:", error)
    return NextResponse.json({ error: "An error occurred while processing donation" }, { status: 500 })
  }
}
