import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // 1. Fetch from Supabase instead of Google Sheets
    // We only fetch 'approved' items to match your previous logic
    const { data: galleryItems, error } = await supabase
      .from("gallery")
      .select("*")
      .eq("approved", true) // Only show items where approved is TRUE
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Supabase Gallery error:", error)
      return NextResponse.json(
        { error: "Failed to fetch gallery items" },
        { status: 500 }
      )
    }

    // 2. Transform the data to match your frontend's expected format
    const formattedGallery = (galleryItems || []).map((item) => ({
      id: item.id,
      title: item.title,
      type: item.type,
      url: item.url,
      thumbnail: item.thumbnail,
      uploadedBy: item.uploaded_by, // Matches your old 'row[5]'
      uploadedAt: item.created_at,  // Matches your old 'row[6]'
      description: item.description,
      tags: item.tags || [],        // Supabase returns text[] as an array, so no .split(",") needed
    }))

    return NextResponse.json(formattedGallery)
  } catch (error) {
    console.error("[v0] Gallery endpoint error:", error)
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    )
  }
}