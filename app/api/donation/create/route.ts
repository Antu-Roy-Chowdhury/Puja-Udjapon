import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"

const paymentMethods = new Set(["bkash", "nagad", "bank_transfer", "cash"])

export async function POST(req: Request) {
  try {
    const { donor_name, amount, payment_method, transaction_id, email, phone } = await req.json()
    const normalizedAmount = Number(amount)
    if (!donor_name || !transaction_id || !paymentMethods.has(payment_method)) {
      return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 })
    }
    if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      return NextResponse.json({ error: "Amount must be greater than 0" }, { status: 400 })
    }
    const rows = await getDatabase()`
      INSERT INTO donations (donor_name, amount, payment_method, transaction_id, email, phone, status)
      VALUES (${String(donor_name).trim()}, ${normalizedAmount}, ${payment_method}, ${String(transaction_id).trim()}, ${email || null}, ${phone || null}, 'pending')
      RETURNING *
    `
    return NextResponse.json({ success: true, message: "Donation recorded successfully.", data: rows })
  } catch (error: any) {
    console.error("Donation creation failed", error)
    if (error?.code === "23505") return NextResponse.json({ error: "This transaction reference has already been submitted" }, { status: 409 })
    return NextResponse.json({ error: "An error occurred while processing donation" }, { status: 500 })
  }
}
