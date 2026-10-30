import { getDatabase } from "@/lib/db"

export type HomepageSettings = {
  heroTag: string; heroTitle: string; heroSubtitle: string; heroBgImage: string
  fallbackImg1: string; fallbackImg2: string
  promoVideo: null | { title: string; description: string; url: string; layout: "auto" | "portrait" | "landscape" }
  hasPublishedSettings?: boolean
}

export const defaultHomepage: HomepageSettings = {
  heroTag: "ওঁ তৎ সৎ",
  heroTitle: "সার্বজনীন পূজা উদযাপন পরিষদ, রুয়েট",
  heroSubtitle: "রুয়েটের সনাতন ধর্মাবলম্বীদের আস্থার সংঘঠন যা বিভিন্ন পূজা-পার্বণ, ধর্মীয় উৎসব যথাযথ মর্যাদায় পালন করে",
  heroBgImage: "https://res.cloudinary.com/djt70cy8p/image/upload/v1768999776/hero_qytbzo.jpg",
  fallbackImg1: "https://res.cloudinary.com/djt70cy8p/image/upload/v1768999779/buddhist-meditation-cave-peaceful_c9hc1o.jpg",
  fallbackImg2: "https://res.cloudinary.com/djt70cy8p/image/upload/v1769127833/IMG_0834_azjooq.jpg",
  promoVideo: null,
}

export async function getHomepageSettings(kind: "draft" | "published" = "published") {
  const rows = await getDatabase()`SELECT draft, published, published_at FROM homepage_settings WHERE id = 1`
  return { ...defaultHomepage, ...(rows[0]?.[kind] || {}), hasPublishedSettings: Boolean(rows[0]?.published_at) } as HomepageSettings
}
