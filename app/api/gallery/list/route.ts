import { NextResponse } from "next/server"
import { getSheet } from "@/lib/googleSheets"

export async function GET() {
  const rows = await getSheet("gallery")
  const [, ...data] = rows

  const approved = data.filter(row => row[8] === "TRUE")

  return NextResponse.json(
    approved.map(row => ({
      id: row[0],
      title: row[1],
      type: row[2],
      url: row[3],
      uploadedBy: row[5],
      uploadedAt: row[6],
      description: row[10],
      tags: row[11]?.split(",") || [],
    }))
  )
}
