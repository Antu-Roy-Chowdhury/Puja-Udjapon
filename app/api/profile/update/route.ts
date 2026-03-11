import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(req: Request) {
  try {
    const { userId, name, department, series, photo, contact, bloodGroup, bio } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const profilePayload = {
      name,
      department,
      series,
      photo,
    }

    let data: any[] | null = null
    let error: any = null

    const primaryUpdate = await supabase
      .from("profiles")
      .update(profilePayload)
      .eq("id", userId)
      .select()

    data = primaryUpdate.data
    error = primaryUpdate.error

    if (error) {
      console.error("[v0] Profile update error:", error)
      return NextResponse.json({ error: error.message || "Failed to update profile" }, { status: 400 })
    }

    const currentAuthUser = await supabase.auth.admin.getUserById(userId)
    const currentMetadata = currentAuthUser.data.user?.user_metadata || {}

    const metadataPayload = {
      ...currentMetadata,
      contact: contact || "",
      bloodGroup: bloodGroup || "",
      bio: bio || "",
      photo: photo || currentMetadata.photo || "",
    }

    const metadataUpdate = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: metadataPayload,
    })

    if (metadataUpdate.error) {
      console.error("[v0] Profile metadata update error:", metadataUpdate.error)
      return NextResponse.json({ error: metadataUpdate.error.message || "Failed to update profile" }, { status: 400 })
    }

    await supabase
      .from("members")
      .update({
        name,
        department,
        series,
        phone: contact || null,
        avatar: photo || null,
        bio: bio || null,
      })
      .eq("id", userId)

    const updatedUser = {
      ...(data?.[0] || {}),
      approved: Boolean(data?.[0]?.approved ?? data?.[0]?.isApproved),
      isApproved: Boolean(data?.[0]?.approved ?? data?.[0]?.isApproved),
      contact: metadataPayload.contact,
      bloodGroup: metadataPayload.bloodGroup,
      bio: metadataPayload.bio,
      photo: data?.[0]?.photo || metadataPayload.photo,
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    })
  } catch (error) {
    console.error("[v0] Profile update error:", error)
    return NextResponse.json({ error: "An error occurred while updating profile" }, { status: 500 })
  }
}
