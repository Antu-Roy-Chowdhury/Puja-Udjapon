import { BanglaDate } from "@subrotosaha/bangla-date"

const banglaMonths = [
  "বৈশাখ",
  "জ্যৈষ্ঠ",
  "আষাঢ়",
  "শ্রাবণ",
  "ভাদ্র",
  "আশ্বিন",
  "কার্তিক",
  "অগ্রহায়ণ",
  "পৌষ",
  "মাঘ",
  "ফাল্গুন",
  "চৈত্র",
]

const banglaWeekdays = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহস্পতি", "শুক্র", "শনি"]
const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"]

export function bnNumber(n: number | string) {
  return String(n)
    .split("")
    .map((digit) => (/\d/.test(digit) ? banglaDigits[Number(digit)] : digit))
    .join("")
}

export function formatBanglaDate(date = new Date(), pattern = "WWWW, DD MMMM YYYY") {
  return new BanglaDate(date, "bn").format(pattern)
}

export function getBanglaTodayCard(date = new Date()) {
  const formatted = formatBanglaDate(date, "WWWW, DD MMMM YYYY")
  const englishDate = date.toDateString()
  return { formatted, englishDate }
}

export function getBanglaMonthCalendar(date = new Date()) {
  const now = new Date(date.getFullYear(), date.getMonth(), 1)
  const start = new Date(now.getFullYear(), 3, 14)
  const year = now < start ? now.getFullYear() - 594 : now.getFullYear() - 593
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  const firstWeekday = firstDay.getDay()
  const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const monthDays = [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29, 30]
  const cells: Array<null | { englishDay: number; banglaDay: string; banglaMonth: string; isToday: boolean }> = []

  for (let i = 0; i < firstWeekday; i += 1) cells.push(null)

  for (let day = 1; day <= totalDays; day += 1) {
    const current = new Date(now.getFullYear(), now.getMonth(), day)
    const yearStart = new Date(current.getFullYear(), 3, 14)
    let diff = Math.floor((current.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24))
    let banglaYear = current.getFullYear() - 593

    if (current < yearStart) {
      banglaYear -= 1
      diff = Math.floor((current.getTime() - new Date(current.getFullYear() - 1, 3, 14).getTime()) / (1000 * 60 * 60 * 24))
    }

    let monthIndex = 0
    while (monthIndex < monthDays.length - 1 && diff >= monthDays[monthIndex]) {
      diff -= monthDays[monthIndex]
      monthIndex += 1
    }

    const today = new Date()
    cells.push({
      englishDay: day,
      banglaDay: bnNumber(diff + 1),
      banglaMonth: banglaMonths[monthIndex],
      isToday:
        current.getDate() === today.getDate() &&
        current.getMonth() === today.getMonth() &&
        current.getFullYear() === today.getFullYear(),
    })
  }

  const banglaHeader = new BanglaDate(now, "bn").format("MMMM YYYY")

  return {
    label: banglaHeader,
    weekdays: banglaWeekdays,
    cells,
    year: bnNumber(year),
  }
}
