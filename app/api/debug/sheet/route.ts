import { NextResponse } from "next/server"
import { getSheet } from "@/lib/googleSheets"

export async function GET() {
  const members = await getSheet("members")
  return NextResponse.json({ rows: members.length })
}
