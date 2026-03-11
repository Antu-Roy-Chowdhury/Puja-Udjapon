import { createClient } from "@supabase/supabase-js"

import { getApprovalValue, normalizeGalleryItem } from "@/lib/content"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export async function getGallery(limit?: number) {
  try {
    let query = supabase.from("gallery").select("*").order("created_at", { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("[v0] Failed to fetch gallery:", error)
      return []
    }

    return (data || [])
      .filter((item) => getApprovalValue(item))
      .map((item) => normalizeGalleryItem(item, "Community Member"))
  } catch (error) {
    console.error("[v0] Error in getGallery:", error)
    return []
  }
}
