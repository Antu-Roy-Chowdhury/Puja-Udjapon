import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

import { getApprovalValue, normalizeGalleryItem } from "@/lib/content"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function GET() {
  try {
    const { data: galleryItems, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Supabase Gallery error:", error)
      return NextResponse.json({ error: "Failed to fetch gallery items" }, { status: 500 })
    }

    const approvedItems = (galleryItems || []).filter((item) => getApprovalValue(item))
    const uploaderIds = approvedItems.map((item) => item.uploaded_by).filter(Boolean)
    const { data: profiles } = uploaderIds.length
      ? await supabase.from("profiles").select("id, name, email").in("id", uploaderIds)
      : { data: [] as any[] }

    const profileMap = new Map((profiles || []).map((profile) => [profile.id, profile.name || profile.email]))
    const formattedGallery = approvedItems.map((item) => normalizeGalleryItem(item, profileMap.get(item.uploaded_by) || "Community Member"))

    return NextResponse.json(formattedGallery)
  } catch (error) {
    console.error("[v0] Gallery endpoint error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
