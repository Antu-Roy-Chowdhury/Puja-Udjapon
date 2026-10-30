"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getBanglaCursor, getBanglaMonthCalendar, getBanglaTodayCard, moveBanglaMonth } from "@/lib/bangla-calendar"
import { dateKeyFromParts, getDhakaEventDateKeys } from "@/lib/dates"

const months = ["All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

type EventItem = {
  id: string
  title: string
  description: string
  location: string
  start_time: string
  end_time: string
  time: string
  image_url?: string
}

export default function EventsPage() {
  const today = useMemo(() => new Date(), [])
  const banglaToday = useMemo(() => getBanglaTodayCard(today), [today])
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("All")
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth())
  const [calendarYear, setCalendarYear] = useState(today.getFullYear())
  const [banglaCursor, setBanglaCursor] = useState(() => getBanglaCursor(today))

  useEffect(() => {
    fetch("/api/events/list")
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || "Failed to load events")
        setEvents(Array.isArray(data.events) ? data.events : [])
      })
      .catch((error) => setLoadError(error instanceof Error ? error.message : "Failed to load events"))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (selectedMonth === "All") return
    const index = months.indexOf(selectedMonth) - 1
    if (index >= 0) setCalendarMonth(index)
  }, [selectedMonth])

  const eventCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const event of events) {
      for (const key of getDhakaEventDateKeys(event.start_time, event.end_time)) {
        counts.set(key, (counts.get(key) || 0) + 1)
      }
    }
    return counts
  }, [events])

  const scrollToEvent = (dateKey: string) => {
    const targetEvent = events.find((event) => 
      getDhakaEventDateKeys(event.start_time, event.end_time).includes(dateKey)
    )
    if (targetEvent) {
      const el = document.getElementById(`event-card-${targetEvent.id}`)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" })
        el.classList.add("ring-2", "ring-orange-500", "transition-all")
        setTimeout(() => {
          el.classList.remove("ring-2", "ring-orange-500")
        }, 2000)
      }
    }
  }

  const englishCalendar = useMemo(() => {
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate()
    const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay()
    const days: Array<number | null> = Array.from({ length: firstDayIndex }, () => null)
    for (let day = 1; day <= daysInMonth; day += 1) days.push(day)
    return { days, monthName: months[calendarMonth + 1] }
  }, [calendarMonth, calendarYear])

  const banglaCalendar = useMemo(() => getBanglaMonthCalendar(banglaCursor), [banglaCursor])
  
  const filteredEvents = selectedMonth === "All" 
    ? events 
    : events.filter((event) => new Date(event.start_time).toLocaleString("en-US", { month: "long", timeZone: "Asia/Dhaka" }) === selectedMonth)

  const moveEnglish = (amount: number) => {
    const next = new Date(calendarYear, calendarMonth + amount, 1)
    setCalendarMonth(next.getMonth())
    setCalendarYear(next.getFullYear())
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent py-14 sm:py-20 lg:py-24 border-b border-orange-100/50">
          <div className="mx-auto max-w-[90rem] px-4 text-center sm:px-5 lg:px-6">
            <Badge className="mb-4 bg-orange-100 text-orange-800 border border-orange-200 px-3 py-1 rounded-full font-semibold">তিথি</Badge>
            <h1 className="mb-5 font-serif text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">আগামী দিনের মাঙ্গলিক তিথি</h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-gray-600 sm:text-lg lg:text-xl font-light">
              পুণ্যলগ্নের আহ্বান: আমাদের মন্দির প্রাঙ্গণের সকল পূজা, উৎসব এবং সেবামূলক আয়োজনের সময়সূচী এখানে দেওয়া হলো।
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-[90rem] px-3 py-8 sm:px-5 sm:py-12 lg:px-6 lg:py-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
            
            {/* Calendars Column */}
            <div className="space-y-6 lg:col-span-1">
              
              {/* Bangla Calendar */}
              <Card className="border-orange-100 bg-white shadow-sm rounded-2xl p-4 sm:p-6">
                <h2 className="mb-3 text-center font-serif text-xl font-bold text-gray-900 sm:text-2xl">বাংলা ক্যালেন্ডার</h2>
                <CalendarHeader 
                  label={banglaCalendar.label} 
                  previousLabel="আগের বাংলা মাস" 
                  nextLabel="পরের বাংলা মাস" 
                  onPrevious={() => setBanglaCursor((cursor) => moveBanglaMonth(cursor, -1))} 
                  onNext={() => setBanglaCursor((cursor) => moveBanglaMonth(cursor, 1))} 
                />
                <div className="mb-2 grid grid-cols-7 gap-1 sm:gap-2">
                  {banglaCalendar.weekdays.map((day) => (
                    <div key={day} className="text-center text-[11px] font-bold text-orange-700 sm:text-xs">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {banglaCalendar.cells.map((cell, index) => {
                    const count = cell ? eventCounts.get(cell.dateKey) || 0 : 0
                    return (
                      <div 
                        key={index} 
                        onClick={() => {
                          if (count > 0 && cell?.dateKey) {
                            scrollToEvent(cell.dateKey)
                          }
                        }}
                        className={[
                          "relative min-h-12 rounded-xl border p-1 text-center sm:min-h-[68px] sm:p-2 transition-all flex flex-col justify-center items-center", 
                          !cell ? "invisible border-transparent" : "bg-white", 
                          cell?.isToday ? "border-orange-500 ring-2 ring-orange-200 font-bold" : "border-gray-100", 
                          count > 0 ? "bg-orange-500 text-white border-orange-600 shadow-sm cursor-pointer hover:bg-red-200" : "hover:bg-orange-50/50"
                        ].join(" ")}
                      >
                        {cell ? (
                          <>
                            <div className={`font-bold text-sm sm:text-base ${count > 0 ? "text-orange-500" : "text-gray-900"}`}>{cell.banglaDay}</div>
                            <div className={`text-[10px] leading-tight font-medium ${count > 0 ? "text-orange-500" : "text-gray-500"}`}>
                              {cell.englishDay} {cell.englishMonth}
                            </div>
                            {count > 0 && (
                              <span className="absolute right-1 top-1 rounded-full bg-white px-1.5 py-0.2 text-[9px] font-bold text-orange-700 shadow-sm">
                                {count}
                              </span>
                            )}
                          </>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              </Card>

              {/* English Calendar */}
              <Card className="border-orange-100 bg-white shadow-sm rounded-2xl p-4 sm:p-6">
                <h2 className="mb-3 text-center font-serif text-xl font-bold text-gray-900 sm:text-2xl">Event Calendar</h2>
                <CalendarHeader 
                  label={`${englishCalendar.monthName} ${calendarYear}`} 
                  previousLabel="Previous month" 
                  nextLabel="Next month" 
                  onPrevious={() => moveEnglish(-1)} 
                  onNext={() => moveEnglish(1)} 
                />
                <div className="mb-2 grid grid-cols-7 gap-1 sm:gap-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center text-[11px] font-bold text-orange-700 sm:text-xs">{day}</div>
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={`${calendarMonth}-${calendarYear}`} 
                    initial={{ opacity: 0, y: 8 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -8 }} 
                    className="grid grid-cols-7 gap-1 sm:gap-2"
                  >
                    {englishCalendar.days.map((day, index) => {
                      const key = day ? dateKeyFromParts(calendarYear, calendarMonth, day) : ""
                      const count = eventCounts.get(key) || 0
                      const isToday = day === today.getDate() && calendarMonth === today.getMonth() && calendarYear === today.getFullYear()
                      return (
                        <div 
                          key={index} 
                          onClick={() => {
                            if (count > 0 && key) {
                              scrollToEvent(key)
                            }
                          }}
                          className={[
                            "relative min-h-[44px] rounded-xl flex flex-col items-center justify-center text-sm transition-all", 
                            day === null ? "invisible" : "", 
                            isToday ? "border-2 border-green-600 font-bold bg-green-50/50" : "border border-gray-100", 
                            count > 0 ? "bg-primary text-white font-bold shadow-sm cursor-pointer hover:opacity-90" : "hover:bg-orange-50/50 text-gray-800"
                          ].join(" ")}
                        >
                          <span>{day}</span>
                          {count > 0 && (
                            <span className="absolute right-1 top-1 rounded-full bg-white px-1.5 text-[9px] font-bold text-primary shadow-sm">
                              {count}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </motion.div>
                </AnimatePresence>
              </Card>

            </div>

            {/* Events List Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-gray-900 sm:text-3xl">Event Schedule</h2>
                  <p className="mt-1 text-l text-gray-600 font-medium">
                    Today:  <span className="font-bold text-orange-600">{banglaToday.formatted} </span> | {today.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Dhaka" })}
                  </p>
                </div>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-full sm:w-48 rounded-xl border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {months.map((month) => (
                      <SelectItem key={month} value={month}>{month}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }, (_, i) => (
                    <div key={i} className="h-44 animate-pulse rounded-2xl bg-white border border-gray-100 shadow-sm" />
                  ))}
                </div>
              ) : loadError ? (
                <Card className="rounded-2xl border-gray-100 shadow-sm"><CardContent className="py-12 text-center text-red-600 font-medium">{loadError}</CardContent></Card>
              ) : (
                <div className="space-y-6">
                  {filteredEvents.map((event) => (
                    <Card key={event.id} id={`event-card-${event.id}`} className="rounded-2xl border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden scroll-mt-6">
                      <CardContent className="p-5 sm:p-7">
                        <div className="flex flex-col md:flex-row items-start gap-6">
                          
                          {/* Date Badge Box */}
                          <div className="flex flex-row md:flex-col items-center justify-center bg-orange-50 border border-orange-100 rounded-2xl p-3 min-w-[80px] text-center shadow-sm shrink-0 gap-2 md:gap-0">
                            <div className="text-3xl font-bold text-gray-900 leading-none">
                              {new Date(event.start_time).toLocaleDateString("en-US", { day: "numeric", timeZone: "Asia/Dhaka" })}
                            </div>
                            <div className="text-xs font-bold uppercase text-orange-600 md:mt-1">
                              {new Date(event.start_time).toLocaleDateString("en-US", { month: "short", timeZone: "Asia/Dhaka" })}
                            </div>
                          </div>

                          {/* Event Info & Image */}
                          <div className="min-w-0 flex-1 space-y-4 w-full">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">{event.title}</h3>
                              <p className="text-sm sm:text-base leading-relaxed text-gray-600 font-light">{event.description || "Details will be announced soon."}</p>
                            </div>

                            {event.image_url && (
                              <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-xl overflow-hidden border border-gray-100 shadow-inner group bg-gray-50">
                                <img 
                                  src={event.image_url} 
                                  alt={event.title} 
                                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                                />
                              </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3 text-sm text-gray-700 pt-2 border-t border-gray-100">
                              {event.time && (
                                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                                  <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                                  <span>{event.time}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                                <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                                <span>{event.location || "Location pending"}</span>
                              </div>
                            </div>
                          </div>

                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {!loading && !loadError && filteredEvents.length === 0 ? (
                <Card className="rounded-2xl border-gray-100 shadow-sm bg-white">
                  <CardContent className="py-16 text-center">
                    <Calendar className="mx-auto mb-4 h-16 w-16 text-orange-400 stroke-[1.5]" />
                    <h3 className="mb-2 text-xl font-bold text-gray-800">No events found</h3>
                    <p className="text-gray-500 text-sm">Try a different month or check back later.</p>
                  </CardContent>
                </Card>
              ) : null}

            </div>

          </div>
        </div>
      </main>
    </div>
  )
}

function CalendarHeader({ label, previousLabel, nextLabel, onPrevious, onNext }: { label: string; previousLabel: string; nextLabel: string; onPrevious: () => void; onNext: () => void }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <Button type="button" variant="ghost" size="icon" aria-label={previousLabel} onClick={onPrevious} className="rounded-xl hover:bg-orange-50 text-gray-700">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="text-sm font-bold text-gray-800">{label}</div>
      <Button type="button" variant="ghost" size="icon" aria-label={nextLabel} onClick={onNext} className="rounded-xl hover:bg-orange-50 text-gray-700">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}