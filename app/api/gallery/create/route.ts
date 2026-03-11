import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

import { encodeGalleryDescription, getVideoThumbnail } from "@/lib/content"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      title,
      type,
      url,
      thumbnail = "",
      uploadedBy,
      description = "",
      tags = [],
      albumUrls = [],
      embedUrl = "",
      postKind = "gallery",
      videoLayout = "auto",
    } = body

    if (!url) {
      return NextResponse.json({ error: "A media URL is required" }, { status: 400 })
    }

    const { data: profile } = await supabase.from("profiles").select("id").eq("email", uploadedBy).single()

    const safeTags = Array.isArray(tags) ? tags : []
    const computedThumbnail = thumbnail || (type === "video" ? getVideoThumbnail(url) : url)
    const descriptionPayload = encodeGalleryDescription({
      text: description,
      albumUrls: Array.isArray(albumUrls) ? albumUrls : [],
      embedUrl,
      postKind,
      videoLayout,
    })

    const insertPayload = {
      id: crypto.randomUUID(),
      title,
      type,
      url,
      thumbnail: computedThumbnail,
      uploaded_by: profile?.id || null,
      description: descriptionPayload,
      tags: safeTags,
    }

    let insertResult = await supabase.from("gallery").insert({ ...insertPayload, approved: false })

    if (insertResult.error) {
      insertResult = await supabase.from("gallery").insert({ ...insertPayload, isApproved: false })
    }

    if (insertResult.error) {
      console.error("[v0] Supabase error:", insertResult.error)
      return NextResponse.json({ error: insertResult.error.message || "Failed to create gallery item" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Gallery create error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
