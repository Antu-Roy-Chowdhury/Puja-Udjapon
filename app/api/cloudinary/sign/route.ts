import { NextResponse } from "next/server"
import crypto from "crypto"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const folder = searchParams.get("folder") || "gallery"

    const timestamp = Math.floor(Date.now() / 1000)
    const toSign = `folder=${folder}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`

    const signature = crypto.createHash("sha1").update(toSign).digest("hex")

    return NextResponse.json({
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      timestamp,
      signature,
      folder,
    })
  } catch (error) {
    console.error("[v0] Cloudinary sign error:", error)
    return NextResponse.json(
      { error: "Failed to sign request" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const { folder } = await req.json()

    const timestamp = Math.floor(Date.now() / 1000)
    const toSign = `folder=${folder}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`

    const signature = crypto.createHash("sha1").update(toSign).digest("hex")

    return NextResponse.json({
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      timestamp,
      signature,
      folder,
    })
  } catch (error) {
    console.error("[v0] Cloudinary sign error:", error)
    return NextResponse.json(
      { error: "Failed to sign request" },
      { status: 500 }
    )
  }
}
