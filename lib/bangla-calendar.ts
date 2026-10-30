import { BanglaDate } from "@subrotosaha/bangla-date"

import { getDhakaDateKey } from "@/lib/dates"

const banglaWeekdays = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহস্পতি", "শুক্র", "শনি"]
const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"]

export type BanglaMonthCursor = { year: number; month: number }

export function bnNumber(n: number | string) {
  return String(n).split("").map((digit) => (/\d/.test(digit) ? banglaDigits[Number(digit)] : digit)).join("")
}

export function formatBanglaDate(date = new Date(), pattern = "WWWW, DD MMMM YYYY") {
  return new BanglaDate(date, "bn").format(pattern)
}

export function getBanglaTodayCard(date = new Date()) {
  return { formatted: formatBanglaDate(date), englishDate: date.toDateString() }
}

export function getBanglaCursor(date = new Date()): BanglaMonthCursor {
  const banglaDate = new BanglaDate(date, "bn")
  return { year: banglaDate.getFullYear(), month: banglaDate.getMonth() }
}

export function moveBanglaMonth(cursor: BanglaMonthCursor, amount: number): BanglaMonthCursor {
  const zeroBased = cursor.year * 12 + (cursor.month - 1) + amount
  return { year: Math.floor(zeroBased / 12), month: ((zeroBased % 12) + 12) % 12 + 1 }
}

export function getBanglaMonthCalendar(cursor: BanglaMonthCursor) {
  const first = BanglaDate.fromBanglaDate(cursor.year, cursor.month, 1, "bn")
  const totalDays = first.endOfMonth().getDate()
  const cells: Array<null | {
    banglaDay: string
    englishDay: number
    englishMonth: string
    dateKey: string
    isToday: boolean
  }> = Array.from({ length: first.getDay() }, () => null)
  const todayKey = getDhakaDateKey(new Date())

  for (let day = 1; day <= totalDays; day += 1) {
    const banglaDate = BanglaDate.fromBanglaDate(cursor.year, cursor.month, day, "bn")
    const gregorianDate = new Date(Number(banglaDate))
    const dateKey = getDhakaDateKey(gregorianDate)
    cells.push({
      banglaDay: bnNumber(day),
      englishDay: Number(dateKey.slice(8, 10)),
      englishMonth: gregorianDate.toLocaleDateString("en-US", { month: "short", timeZone: "Asia/Dhaka" }),
      dateKey,
      isToday: dateKey === todayKey,
    })
  }

  return {
    label: first.format("MMMM YYYY"),
    weekdays: banglaWeekdays,
    cells,
    year: bnNumber(cursor.year),
    month: cursor.month,
  }
}
