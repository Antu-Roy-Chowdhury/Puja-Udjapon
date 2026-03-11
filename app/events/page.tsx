"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getBanglaMonthCalendar, getBanglaTodayCard } from "@/lib/bangla-calendar"
import { getBanglaCalendarParts, toBanglaNumber } from "@/lib/content"

const months = ["All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

type EventItem = {
  id: string
  title: string
  description: string
  location: string
  start_time: string
  end_time: string
  time: string
  month: string
}

export default function EventsPage() {
  const today = useMemo(() => new Date(), [])
  const banglaToday = useMemo(() => getBanglaTodayCard(today), [today])
  const [events, setEvents] = useState<EventItem[]>([])
  const [selectedMonth, setSelectedMonth] = useState("All")
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth())
  const [calendarYear, setCalendarYear] = useState(today.getFullYear())

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events/list")
        const data = await res.json()
        if (Array.isArray(data.events)) setEvents(data.events)
      } catch (error) {
        console.error("[v0] Failed to fetch events:", error)
      }
    }
    void fetchEvents()
  }, [])

  useEffect(() => {
    if (selectedMonth !== "All") {
      const index = months.indexOf(selectedMonth) - 1
      if (index >= 0) setCalendarMonth(index)
    }
  }, [selectedMonth])

  const englishCalendar = useMemo(() => {
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate()
    const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay()
    const days: Array<number | null> = []
    for (let i = 0; i < firstDayOfWeek; i += 1) days.push(null)
    for (let day = 1; day <= daysInMonth; day += 1) days.push(day)
    const eventDays = new Set<number>()
    events.forEach((event) => {
      const start = new Date(event.start_time)
      const end = new Date(event.end_time || event.start_time)
      const current = new Date(start)
      while (current <= end) {
        if (current.getMonth() === calendarMonth && current.getFullYear() === calendarYear) eventDays.add(current.getDate())
        current.setDate(current.getDate() + 1)
      }
    })
    return { days, eventDays, monthName: months[calendarMonth + 1] }
  }, [calendarMonth, calendarYear, events])

  const banglaCalendar = useMemo(() => getBanglaMonthCalendar(new Date(calendarYear, calendarMonth, 1)), [calendarMonth, calendarYear])
  const filteredEvents = selectedMonth === "All" ? events : events.filter((event) => event.month === selectedMonth)

  return (
    <div className="min-h-screen">
      <main>
        <section className="relative py-24 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="max-w-[90rem] mx-auto px-4 sm:px-5 lg:px-6 text-center">
            <Badge className="bg-orange-100 text-orange-800 mb-4">তিথি</Badge>
            <h1 className="font-serif text-5xl font-bold text-gray-900 mb-6">আগামী দিনের মাঙ্গলিক তিথি</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">পুণ্যলগ্নের আহ্বান: আমাদের মন্দির প্রাঙ্গণের সকল পূজা, উৎসব এবং সেবামূলক আয়োজনের সময়সূচী এখানে দেওয়া হলো।</p>
          </div>
        </section>

        <div className="max-w-[90rem] mx-auto px-4 sm:px-5 lg:px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-6 border-orange-100 shadow-sm bg-[radial-gradient(circle_at_top,#fff8ef,white_60%)]">
                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2 text-center">বাংলা ক্যালেন্ডার</h3>
                <p className="text-center text-sm text-gray-500 mb-4">{banglaCalendar.label}</p>
                <div className="grid grid-cols-7 gap-2 mb-4">{banglaCalendar.weekdays.map((day) => <div key={day} className="text-center text-[11px] font-semibold text-gray-600">{day}</div>)}</div>
                <div className="grid grid-cols-7 gap-2">
                  {banglaCalendar.cells.map((cell, index) => (
                    <div key={index} className={["min-h-[72px] rounded-2xl border p-2 shadow-sm", !cell ? "invisible" : "bg-white", cell?.isToday ? "border-orange-500 ring-1 ring-orange-300" : "border-orange-100"].join(" ")}>
                      {cell ? (
                        <>
                          <div className="text-xs text-gray-400">{cell.englishDay}</div>
                          <div className="font-semibold text-gray-900">{cell.banglaDay}</div>
                          <div className="text-[10px] text-gray-500 leading-tight">{cell.banglaMonth}</div>
                        </>
                      ) : null}
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="p-6 border-orange-100 shadow-sm bg-[radial-gradient(circle_at_top,#fff8ef,white_60%)]">
                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-6 text-center">Event Calendar</h3>
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => calendarMonth === 0 ? (setCalendarMonth(11), setCalendarYear((year) => year - 1)) : setCalendarMonth((month) => month - 1)} className="px-2 py-1 rounded hover:bg-gray-100"><ChevronLeft className="w-4 h-4" /></button>
                  <div className="text-sm font-semibold text-gray-700">{englishCalendar.monthName} {calendarYear}</div>
                  <button onClick={() => calendarMonth === 11 ? (setCalendarMonth(0), setCalendarYear((year) => year + 1)) : setCalendarMonth((month) => month + 1)} className="px-2 py-1 rounded hover:bg-gray-100"><ChevronRight className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-7 gap-2 mb-4">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <div key={day} className="text-center text-sm font-semibold text-gray-600">{day}</div>)}</div>
                <AnimatePresence mode="wait">
                  <motion.div key={`${calendarMonth}-${calendarYear}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="grid grid-cols-7 gap-2">
                    {englishCalendar.days.map((day, index) => {
                      const isToday = day && today.getDate() === day && today.getMonth() === calendarMonth && today.getFullYear() === calendarYear
                      const hasEvent = day ? englishCalendar.eventDays.has(day) : false
                      return <div key={index} className={["relative text-center py-2 text-sm rounded-lg min-h-[32px] transition-colors", day === null ? "invisible" : "", isToday ? "border-2 border-green-500 font-bold" : "", hasEvent ? "bg-primary text-white" : "hover:bg-gray-100"].join(" ")}>{day}</div>
                    })}
                  </motion.div>
                </AnimatePresence>
              </Card>

              {/* <Card className="p-6 bg-orange-50 border-orange-200">
                <h3 className="font-serif text-xl font-bold text-gray-900 mb-3">আজকের বাংলা তারিখ</h3>
                <p className="text-2xl font-bold text-orange-700 mb-2">{banglaToday.formatted}</p>
                <p className="text-sm text-gray-600">{banglaToday.englishDate}</p>
              </Card> */}

              
            </div>

            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-gray-900">Event Schedule</h2>
                  <p className="text-sm text-gray-500 mt-1">Today: {today.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} • {banglaToday.formatted}</p>
                </div>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-48"><SelectValue placeholder="Filter by month" /></SelectTrigger>
                  <SelectContent>{months.map((month) => <SelectItem key={month} value={month}>{month}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-6">
                {filteredEvents.map((event) => (
                  <Card key={event.id} className="p-6 hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex items-start space-x-6 flex-1">
                          <div className="text-center flex-shrink-0"><div className="text-3xl font-bold text-gray-900">{new Date(event.start_time).getDate()}</div><div className="text-sm text-primary font-semibold uppercase">{new Date(event.start_time).toLocaleDateString("en-US", { month: "short" })}</div><div className="text-xs text-gray-500 mt-1">{toBanglaNumber(getBanglaCalendarParts(new Date(event.start_time)).dayNumber)}</div></div>
                          <div className="flex-1"><h3 className="font-semibold text-xl text-gray-900 mb-1">{event.title}</h3><p className="text-gray-600 mb-3 leading-relaxed">{event.description}</p><div className="flex flex-wrap gap-4 text-sm text-gray-600"><div className="flex items-center"><Clock className="w-4 h-4 mr-1" />{event.time}</div><div className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{event.location}</div></div></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {filteredEvents.length === 0 && <div className="text-center py-12"><Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" /><h3 className="text-xl font-semibold text-gray-600 mb-2">No events found</h3><p className="text-gray-500">Try selecting a different month or check back later.</p></div>}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

