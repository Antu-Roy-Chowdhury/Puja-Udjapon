import { createHash } from "node:crypto"
import { NextResponse } from "next/server"
import { apiError } from "@/lib/api-error"
import { requireRole, requireUser } from "@/lib/auth"

const memberFolders = new Set(["temple/gallery"])
const adminFolders = new Set(["temple/hero", "temple/fallback", "temple/events", "temple/activities"])

async function sign(folder: string) {
  if (folder !== "temple/profile" && !memberFolders.has(folder) && !adminFolders.has(folder)) return NextResponse.json({ error: "Invalid upload folder" }, { status: 400 })
  if (adminFolders.has(folder)) await requireRole(["admin", "super_admin"])
  else await requireUser()
  if (!process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) throw new Error("Cloudinary is not configured")
  const timestamp = Math.floor(Date.now() / 1000)
  const signature = createHash("sha1").update(`folder=${folder}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`).digest("hex")
  return NextResponse.json({ cloudName: process.env.CLOUDINARY_CLOUD_NAME, apiKey: process.env.CLOUDINARY_API_KEY, timestamp, signature, folder })
}

export async function GET(req: Request) {
  try { return await sign(new URL(req.url).searchParams.get("folder") || "") }
  catch (error) { return apiError(error, "Failed to sign upload") }
}
export async function POST(req: Request) {
  try { const { folder } = await req.json(); return await sign(String(folder || "")) }
  catch (error) { return apiError(error, "Failed to sign upload") }
}
