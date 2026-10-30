const DHAKA_TIME_ZONE = "Asia/Dhaka"
const dhakaDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: DHAKA_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
})

export function toDhakaIso(value: string) {
  if (!value) return ""
  if (/[zZ]$|[+-]\d{2}:?\d{2}$/.test(value)) return new Date(value).toISOString()
  return new Date(`${value}:00+06:00`).toISOString()
}

export function getDhakaDateKey(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value)
  return dhakaDateFormatter.format(date)
}

export function getDhakaEventDateKeys(startValue: string, endValue?: string) {
  if (!startValue) return []
  const startKey = getDhakaDateKey(startValue)
  const endKey = getDhakaDateKey(endValue || startValue)
  const keys: string[] = []
  const cursor = new Date(`${startKey}T12:00:00+06:00`)
  const end = new Date(`${endKey}T12:00:00+06:00`)

  while (cursor <= end && keys.length < 370) {
    keys.push(getDhakaDateKey(cursor))
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }
  return keys
}

export function dateKeyFromParts(year: number, monthIndex: number, day: number) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

export { DHAKA_TIME_ZONE }
