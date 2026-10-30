import { NextResponse } from "next/server"
import { apiError } from "@/lib/api-error"
import { requireRole, requireUser } from "@/lib/auth"
import { encodeGalleryDescription, getVideoThumbnail } from "@/lib/content"
import { getDatabase } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const user = body.postKind === "promo-video"
      ? await requireRole(["admin", "super_admin"])
      : await requireUser()
    const { title, type, url, thumbnail = "", description = "", tags = [], albumUrls = [], embedUrl = "", postKind = "gallery", videoLayout = "auto" } = body
    if (!url || !title || !["image", "video"].includes(type)) {
      return NextResponse.json({ error: "A title and valid media URL are required" }, { status: 400 })
    }
    const safeTags = Array.isArray(tags) ? tags.map(String) : []
    const computedThumbnail = thumbnail || (type === "video" ? getVideoThumbnail(url) : url)
    const descriptionPayload = encodeGalleryDescription({
      text: description,
      albumUrls: Array.isArray(albumUrls) ? albumUrls : [],
      embedUrl,
      postKind,
      videoLayout,
    })
    await getDatabase()`
      INSERT INTO gallery (title, type, url, thumbnail, uploaded_by, approved, description, tags)
      VALUES (${title}, ${type}, ${url}, ${computedThumbnail}, ${user.id}, FALSE, ${descriptionPayload}, ${safeTags})
    `
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Gallery create failed", error)
    return apiError(error, "Failed to create gallery item")
  }
}
