export function getApprovalValue(record: Record<string, any> | null | undefined) {
  if (!record) return true
  if (typeof record.approved === "boolean") return record.approved
  if (typeof record.isApproved === "boolean") return record.isApproved
  return true
}

const BANGLA_MONTHS = [
  "\u09ac\u09c8\u09b6\u09be\u0996",
  "\u099c\u09cd\u09af\u09c8\u09b7\u09cd\u09a0",
  "\u0986\u09b7\u09be\u09a2\u09bc",
  "\u09b6\u09cd\u09b0\u09be\u09ac\u09a3",
  "\u09ad\u09be\u09a6\u09cd\u09b0",
  "\u0986\u09b6\u09cd\u09ac\u09bf\u09a8",
  "\u0995\u09be\u09b0\u09cd\u09a4\u09bf\u0995",
  "\u0985\u0997\u09cd\u09b0\u09b9\u09be\u09af\u09bc\u09a3",
  "\u09aa\u09cc\u09b7",
  "\u09ae\u09be\u0998",
  "\u09ab\u09be\u09b2\u09cd\u0997\u09c1\u09a8",
  "\u099a\u09c8\u09a4\u09cd\u09b0",
]
const BANGLA_DIGITS = ["\u09e6", "\u09e7", "\u09e8", "\u09e9", "\u09ea", "\u09eb", "\u09ec", "\u09ed", "\u09ee", "\u09ef"]
const BANGLA_WEEKDAYS = [
  "\u09b0\u09ac\u09bf",
  "\u09b8\u09cb\u09ae",
  "\u09ae\u0999\u09cd\u0997\u09b2",
  "\u09ac\u09c1\u09a7",
  "\u09ac\u09c3\u09b9\u09b8\u09cd\u09aa\u09a4\u09bf",
  "\u09b6\u09c1\u0995\u09cd\u09b0",
  "\u09b6\u09a8\u09bf",
]
const BANGLA_MONTH_STARTS = [
  [3, 14],
  [4, 15],
  [5, 15],
  [6, 16],
  [7, 16],
  [8, 16],
  [9, 16],
  [10, 15],
  [11, 15],
  [0, 14],
  [1, 13],
  [2, 15],
]

type VideoLayout = "auto" | "portrait" | "landscape"

type GalleryMeta = {
  text?: string
  albumUrls?: string[]
  embedUrl?: string
  postKind?: "gallery" | "promo-video"
  videoLayout?: VideoLayout
}

export function toBanglaNumber(value: number | string) {
  return String(value)
    .split("")
    .map((char) => (/[0-9]/.test(char) ? BANGLA_DIGITS[Number(char)] : char))
    .join("")
}

export function formatEventTime(startTime?: string | null, endTime?: string | null) {
  if (!startTime) return "Time not announced"

  const start = new Date(startTime)
  const end = endTime ? new Date(endTime) : null
  const startLabel = start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  if (!end) return startLabel

  const endLabel = end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  return `${startLabel} - ${endLabel}`
}

export function normalizeEvent(event: Record<string, any>) {
  return {
    id: event.id,
    title: event.title,
    description: event.description || "",
    location: event.location || "Venue to be announced",
    start_time: event.start_time,
    end_time: event.end_time || event.start_time,
    created_at: event.created_at,
    image_url: event.image_url || "",
    time: formatEventTime(event.start_time, event.end_time),
    month: event.start_time ? new Date(event.start_time).toLocaleString("en-US", { month: "long" }) : "",
  }
}

export function normalizeActivity(activity: Record<string, any>) {
  return {
    id: activity.id,
    name: activity.name,
    description: activity.description || "",
    image: activity.image || activity.image_url || "",
    image_url: activity.image || activity.image_url || "",
    schedule: activity.schedule || "Schedule to be announced",
    duration: activity.duration || "Duration to be announced",
    level: activity.level || "beginner",
    active: typeof activity.active === "boolean" ? activity.active : true,
    created_at: activity.created_at,
  }
}

export function encodeGalleryDescription(meta: GalleryMeta) {
  return `__GALLERY_META__${JSON.stringify(meta)}`
}

export function parseGalleryDescription(description?: string | null) {
  if (!description) {
    return {
      text: "",
      albumUrls: [] as string[],
      embedUrl: "",
      postKind: "gallery" as "gallery" | "promo-video",
      videoLayout: "auto" as VideoLayout,
    }
  }

  if (!description.startsWith("__GALLERY_META__")) {
    return {
      text: description,
      albumUrls: [] as string[],
      embedUrl: "",
      postKind: "gallery" as "gallery" | "promo-video",
      videoLayout: "auto" as VideoLayout,
    }
  }

  try {
    const parsed = JSON.parse(description.replace("__GALLERY_META__", "")) as GalleryMeta
    return {
      text: parsed.text || "",
      albumUrls: Array.isArray(parsed.albumUrls) ? parsed.albumUrls : [],
      embedUrl: parsed.embedUrl || "",
      postKind: parsed.postKind || "gallery",
      videoLayout: parsed.videoLayout || "auto",
    }
  } catch {
    return {
      text: description,
      albumUrls: [] as string[],
      embedUrl: "",
      postKind: "gallery" as "gallery" | "promo-video",
      videoLayout: "auto" as VideoLayout,
    }
  }
}

export function getVideoPlatform(url?: string | null) {
  if (!url) return "unknown"

  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, "")

    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtu.be") {
      return "youtube"
    }

    if (host.includes("facebook.com") || host.includes("fb.watch")) {
      return "facebook"
    }
  } catch {
    return "unknown"
  }

  return "unknown"
}

export function getEmbedUrl(url?: string | null, autoplay = false) {
  if (!url) return ""

  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, "")

    if (host === "youtube.com" || host === "m.youtube.com") {
      const videoId = parsed.searchParams.get("v")
      if (!videoId) return url
      return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&mute=${autoplay ? 1 : 0}&rel=0&playsinline=1`
    }

    if (host === "youtu.be") {
      const videoId = parsed.pathname.replace("/", "")
      return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&mute=${autoplay ? 1 : 0}&rel=0&playsinline=1`
    }

    if (host.includes("facebook.com") || host.includes("fb.watch")) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=${autoplay ? "true" : "false"}&allowfullscreen=true`
    }

    return url
  } catch {
    return url
  }
}

export function getVideoThumbnail(url?: string | null) {
  if (!url) return "/placeholder.svg"

  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, "")

    if (host === "youtube.com" || host === "m.youtube.com") {
      const videoId = parsed.searchParams.get("v")
      return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "/placeholder.svg"
    }

    if (host === "youtu.be") {
      const videoId = parsed.pathname.replace("/", "")
      return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "/placeholder.svg"
    }

    return "/placeholder.svg"
  } catch {
    return "/placeholder.svg"
  }
}

export function getPreferredVideoLayout(layout: VideoLayout | undefined, url?: string | null) {
  if (layout && layout !== "auto") return layout
  return getVideoPlatform(url) === "facebook" ? "portrait" : "landscape"
}

export function normalizeGalleryItem(item: Record<string, any>, uploadedBy: string) {
  const meta = parseGalleryDescription(item.description)
  const primaryUrl = item.url
  const albumUrls = meta.albumUrls.length > 0 ? meta.albumUrls : [primaryUrl]
  const embedUrl = meta.embedUrl || (item.type === "video" ? getEmbedUrl(primaryUrl) : "")

  return {
    id: item.id,
    title: item.title || "Untitled",
    type: item.type || "image",
    url: primaryUrl,
    thumbnail: item.thumbnail || (item.type === "video" ? getVideoThumbnail(primaryUrl) : primaryUrl || "/placeholder.svg"),
    uploadedBy,
    uploadedAt: item.created_at,
    approved: getApprovalValue(item),
    description: meta.text,
    tags: Array.isArray(item.tags) ? item.tags : [],
    albumUrls,
    embedUrl,
    postKind: meta.postKind,
    videoPlatform: getVideoPlatform(primaryUrl),
    videoLayout: getPreferredVideoLayout(meta.videoLayout, primaryUrl),
  }
}

export function getBanglaCalendarParts(date = new Date()) {
  const year = date.getFullYear()
  const banglaYear = date >= new Date(year, 3, 14) ? year - 593 : year - 594
  let monthIndex = 0
  let startDate = new Date(year, 3, 14)

  for (let i = 0; i < BANGLA_MONTH_STARTS.length; i += 1) {
    const [month, day] = BANGLA_MONTH_STARTS[i]
    const candidateYear = month >= 3 ? year : year + 1
    const candidate = new Date(candidateYear, month, day)
    if (date >= candidate) {
      monthIndex = i
      startDate = candidate
    }
  }

  const dayNumber = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

  return {
    day: toBanglaNumber(dayNumber),
    month: BANGLA_MONTHS[monthIndex],
    year: toBanglaNumber(banglaYear),
    monthIndex,
    dayNumber,
    weekday: BANGLA_WEEKDAYS[date.getDay()],
  }
}

export function getBanglaMonthView(date = new Date()) {
  const baseDate = new Date(date.getFullYear(), date.getMonth(), 1)
  const year = baseDate.getFullYear()
  const month = baseDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const cells: Array<null | { gregorianDay: number; banglaDay: string; banglaMonth: string; isToday: boolean }> = []

  for (let i = 0; i < firstDayOfWeek; i += 1) {
    cells.push(null)
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const currentDate = new Date(year, month, day)
    const bangla = getBanglaCalendarParts(currentDate)
    const now = new Date()

    cells.push({
      gregorianDay: day,
      banglaDay: bangla.day,
      banglaMonth: bangla.month,
      isToday:
        now.getDate() === currentDate.getDate() &&
        now.getMonth() === currentDate.getMonth() &&
        now.getFullYear() === currentDate.getFullYear(),
    })
  }

  const firstBangla = getBanglaCalendarParts(new Date(year, month, 1))
  const lastBangla = getBanglaCalendarParts(new Date(year, month, daysInMonth))
  const label =
    firstBangla.month === lastBangla.month
      ? `${firstBangla.month} ${firstBangla.year}`
      : `${firstBangla.month} - ${lastBangla.month} ${lastBangla.year}`

  return {
    label,
    weekdays: BANGLA_WEEKDAYS,
    cells,
  }
}
