import { NextResponse } from "next/server"
import { getSheet } from "@/lib/googleSheets"

export async function GET() {
  const rows = await getSheet("gallery")

  const items = rows
    .filter((r) => r[8] === "TRUE")
    .map((r) => ({
      id: r[0],
      title: r[1],
      type: r[2],
      url: r[3],
      thumbnail: r[4],
      uploadedBy: r[5],
      uploadedAt: r[6],
      description: r[10],
      tags: r[11]?.split(",") || [],
      approved: true,
    }))

  return NextResponse.json(items)
}
