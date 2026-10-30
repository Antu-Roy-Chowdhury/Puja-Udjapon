import { NextResponse } from "next/server"
import { apiError } from "@/lib/api-error"
import { requireAdmin } from "@/lib/auth"
import { getDatabase } from "@/lib/db"
import { getGallery } from "@/lib/getGallery"
import { getHomepageSettings } from "@/lib/homepage"

export async function GET(req: Request) {
  try {
    const draft = new URL(req.url).searchParams.get("draft") === "1"
    if (draft) await requireAdmin()
    const settings = await getHomepageSettings(draft ? "draft" : "published")
    const legacyPromo = draft && !settings.hasPublishedSettings
      ? (await getGallery()).find((item) => item.postKind === "promo-video")
      : null
    return NextResponse.json({ settings, legacyPromo })
  } catch (error) { return apiError(error, "Failed to load homepage settings") }
}

export async function POST(req: Request) {
  try {
    const actor = await requireAdmin()
    const body = await req.json()
    const mode = body.mode === "save" ? "save" : body.mode === "publish" ? "publish" : null
    if (!mode) return NextResponse.json({ error: "Invalid save mode" }, { status: 400 })
    const fields = ["heroTag", "heroTitle", "heroSubtitle", "heroBgImage", "fallbackImg1", "fallbackImg2"] as const
    const settings: Record<string, unknown> = {}
    for (const field of fields) {
      if (typeof body[field] !== "string" || !body[field].trim() || body[field].length > 2000) return NextResponse.json({ error: `Invalid ${field}` }, { status: 400 })
      settings[field] = body[field].trim()
    }
    for (const field of ["heroBgImage", "fallbackImg1", "fallbackImg2"] as const) {
      try { if (new URL(settings[field] as string).protocol !== "https:") throw new Error() }
      catch { return NextResponse.json({ error: `${field} must be an HTTPS URL` }, { status: 400 }) }
    }
    const video = body.promoVideo
    if (video !== null && video !== undefined) {
      if (typeof video !== "object" || typeof video.url !== "string" || !/^https:\/\//.test(video.url) || !["auto", "portrait", "landscape"].includes(video.layout) || typeof video.title !== "string" || typeof video.description !== "string") return NextResponse.json({ error: "Invalid promo video" }, { status: 400 })
      settings.promoVideo = { title: video.title.slice(0, 200), description: video.description.slice(0, 2000), url: video.url, layout: video.layout }
    } else settings.promoVideo = null
    const sql = getDatabase()
    const payload = JSON.stringify(settings)
    if (mode === "publish") await sql`
      INSERT INTO homepage_settings (id, draft, published, updated_by, published_at)
      VALUES (1, ${payload}::jsonb, ${payload}::jsonb, ${actor.id}, NOW())
      ON CONFLICT (id) DO UPDATE SET draft = EXCLUDED.draft, published = EXCLUDED.published,
        updated_by = EXCLUDED.updated_by, updated_at = NOW(), published_at = NOW()`
    else await sql`
      INSERT INTO homepage_settings (id, draft, updated_by)
      VALUES (1, ${payload}::jsonb, ${actor.id})
      ON CONFLICT (id) DO UPDATE SET draft = EXCLUDED.draft,
        updated_by = EXCLUDED.updated_by, updated_at = NOW()`
    return NextResponse.json({ success: true })
  } catch (error) { return apiError(error, "Failed to save homepage settings") }
}
