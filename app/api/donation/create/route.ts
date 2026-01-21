import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const {
      donor_name,
      amount,
      payment_method,
      transaction_id,
      email,
      phone,
    } = await req.json()

    // Validate required fields
    if (!donor_name || !amount || !payment_method || !transaction_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate amount
    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 }
      )
    }

    // Create donation record
    const { data, error } = await supabase.from("donations").insert({
      donor_name,
      amount,
      payment_method,
      transaction_id,
      email,
      phone,
      status: "pending",
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("[v0] Donation creation error:", error)
      return NextResponse.json(
        { error: error.message || "Failed to create donation" },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Donation recorded successfully. Thank you for your contribution!",
      data,
    })
  } catch (error) {
    console.error("[v0] Donation error:", error)
    return NextResponse.json(
      { error: "An error occurred while processing donation" },
      { status: 500 }
    )
  }
}
