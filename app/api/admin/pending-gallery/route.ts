import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

import { getApprovalValue, normalizeGalleryItem } from "@/lib/content"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function GET(req: Request) {
  try {
    const userRole = req.headers.get("x-user-role")

    if (userRole !== "admin" && userRole !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { data: galleryItems, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: "Failed to fetch pending gallery items" }, { status: 500 })
    }

    const pendingItems = (galleryItems || []).filter((item) => !getApprovalValue(item))
    const uploaderIds = pendingItems.map((item) => item.uploaded_by).filter(Boolean)
    const { data: profiles } = uploaderIds.length
      ? await supabase.from("profiles").select("id, name, email").in("id", uploaderIds)
      : { data: [] as any[] }

    const profileMap = new Map((profiles || []).map((profile) => [profile.id, profile.name || profile.email]))

    return NextResponse.json(
      pendingItems.map((item) => normalizeGalleryItem(item, profileMap.get(item.uploaded_by) || "Community Member")),
    )
  } catch (error) {
    console.error("[v0] Pending gallery endpoint error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
