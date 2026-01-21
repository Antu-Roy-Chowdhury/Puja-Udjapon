"use client"

import { useEffect, useState, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Clock, Users } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"



const months = [
  "All","January","February","March","April","May","June",
  "July","August","September","October","November","December"
]

export default function EventsPage() {
  // =========================
  // STATE
  // =========================
  const [events, setEvents] = useState<any[]>([])
  const [selectedMonth, setSelectedMonth] = useState("All")
  const eventRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const today = new Date()

  const [calendarMonth, setCalendarMonth] = useState(today.getMonth()) // 0–11
  const [calendarYear, setCalendarYear] = useState(today.getFullYear())

  // =========================
  // FETCH EVENTS (Google Calendar)
  // =========================
  useEffect(() => {
    fetch("/api/events")
      .then(res => res.json())
      .then(setEvents)
      .catch(console.error)
  }, [])

  // =========================
  // AUTO-FOCUS FIRST EVENT
  // =========================
  useEffect(() => {
    if (events.length > 0 && selectedMonth === "All") {
      const firstDate = new Date(events[0].date)
      setCalendarMonth(firstDate.getMonth())
      setCalendarYear(firstDate.getFullYear())
      setSelectedMonth(firstDate.toLocaleString("en-US", { month: "long" }))
    }
  }, [events])

  // =========================
  // SYNC MONTH DROPDOWN → CALENDAR
  // =========================
  useEffect(() => {
    if (selectedMonth !== "All") {
      const index = months.indexOf(selectedMonth) - 1
      if (index >= 0) setCalendarMonth(index)
    }
  }, [selectedMonth])

  // =========================
  // CALENDAR DATA (SINGLE SOURCE)
  // =========================
  const {
    calendarDays,
    eventDays,
    displayMonth,
    displayYear,
    monthName,
  } = useMemo(() => {
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate()
    const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay()

const calendarDays: (number | null)[] = []
    for (let i = 0; i < firstDayOfWeek; i++) calendarDays.push(null)
    for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d)

    // 2. Multi-day event highlighting logic
    const eventDaysSet = new Set<number>()

    events.forEach(e => {
      // Use startDate and endDate from your API response
      const start = new Date(e.startDate)
      const end = new Date(e.endDate)

      const current = new Date(start)
      
      // Loop through every day between start and end
      while (current <= end) {
        if (
          current.getMonth() === calendarMonth &&
          current.getFullYear() === calendarYear
        ) {
          eventDaysSet.add(current.getDate())
        }
        current.setDate(current.getDate() + 1)
      }
    })

    return {
      calendarDays,
      eventDays: Array.from(eventDaysSet), // Convert Set back to Array for the .includes() check
      displayMonth: calendarMonth,
      displayYear: calendarYear,
      monthName: months[calendarMonth + 1],
    }
  }, [events, calendarMonth, calendarYear])

  // =========================
  // FILTERED EVENTS
  // =========================
  const filteredEvents =
    selectedMonth === "All"
      ? events
      : events.filter(e => e.month === selectedMonth)

  // =========================
  // JSX
  // =========================
  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section */}
        <section className="relative py-24 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="bg-orange-100 text-orange-800 mb-4">OUR TEMPLE</Badge>
            <h1 className="font-serif text-5xl font-bold text-gray-900 mb-6">Upcoming Events</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join us for spiritual gatherings, celebrations, and community events throughout the year
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Calendar Section */}
            
 <div className="lg:col-span-1">
  <Card className="p-6">
    <h3 className="font-serif text-2xl font-bold text-gray-900 mb-6 text-center">
      Event Calendar
    </h3>

    {/* Month Navigation Row */}
    <div className="flex items-center justify-between mb-4">
      <button
        onClick={() =>
          calendarMonth === 0
            ? (setCalendarMonth(11), setCalendarYear((y) => y - 1))
            : setCalendarMonth((m) => m - 1)
        }
        className="px-2 py-1 rounded hover:bg-gray-100"
      >
        ◀
      </button>

      <div className="text-sm font-semibold text-gray-700">
        {monthName} {displayYear}
      </div>

      <button
        onClick={() =>
          calendarMonth === 11
            ? (setCalendarMonth(0), setCalendarYear((y) => y + 1))
            : setCalendarMonth((m) => m + 1)
        }
        className="px-2 py-1 rounded hover:bg-gray-100"
      >
        ▶
      </button>
    </div>

    {/* Year Selector */}
    <div className="flex justify-center mb-4">
      <select
        value={calendarYear}
        onChange={(e) => setCalendarYear(Number(e.target.value))}
        className="border rounded px-2 py-1 text-sm"
      >
        {Array.from({ length: 6 }).map((_, i) => {
          const year = new Date().getFullYear() - 2 + i;
          return <option key={year} value={year}>{year}</option>;
        })}
      </select>
    </div>

    {/* Weekdays Header */}
    <div className="grid grid-cols-7 gap-2 mb-4">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div key={day} className="text-center text-sm font-semibold text-gray-600">
          {day}
        </div>
      ))}
    </div>

    {/* Animated Days Grid */}
    <AnimatePresence mode="wait">
      <motion.div
        key={`${calendarMonth}-${calendarYear}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25 }}
        className="grid grid-cols-7 gap-2"
      >
        {calendarDays.map((day, i) => {
          const isToday =
            day &&
            today.getDate() === day &&
            today.getMonth() === displayMonth &&
            today.getFullYear() === displayYear;

          const hasEvent = day && eventDays.includes(day);

          const isMultiDay =
            day &&
            events.some((e) => {
              const start = new Date(e.startDate);
              const end = new Date(e.endDate);
              if (start.toDateString() === end.toDateString()) return false;
              const current = new Date(displayYear, displayMonth, day);
              return current >= start && current <= end;
            });

          return (
            <div
              key={i}
              className={`
                relative text-center py-2 text-sm rounded-lg min-h-[32px] transition-colors
                ${day === null ? "invisible" : ""}
                ${isToday ? "border-2 border-green-500 font-bold" : ""}
                ${hasEvent && !isMultiDay ? "bg-primary text-white" : ""}
                ${isMultiDay ? "bg-orange-400 text-white" : ""}
                ${!hasEvent && !isMultiDay && day !== null ? "hover:bg-gray-100 cursor-pointer" : ""}
              `}
            >
              {day}
              {/* Optional Indicator for background multi-day logic */}
              {isMultiDay && !hasEvent && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
              )}
            </div>
          );
        })}
      </motion.div>
    </AnimatePresence>

    {/* Color Legend */}
    <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center gap-4 text-[10px] uppercase tracking-wider font-bold text-gray-500">
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-primary" /> Single Event
      </div>
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-orange-400" /> Retreat/Fest
      </div>
    </div>
  </Card>
</div>
            {/* Events List */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-serif text-3xl font-bold text-gray-900">Event Schedule</h2>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-6">
                {filteredEvents.map((event) => (
                  <Card key={event.id} ref={(el) => {
    eventRefs.current[event.date] = el
  }} className="p-6 hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-6 flex-1">
                          <div className="text-center flex-shrink-0">
                            <div className="text-3xl font-bold text-gray-900">{new Date(event.date).getDate()}</div>
                            <div className="text-sm text-primary font-semibold uppercase">
                              {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                            </div>
                          </div>
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-xl text-gray-900 mb-1">{event.name}</h3>
                            {event.subtitle && <p className="text-gray-600 mb-2">{event.subtitle}</p>}
                            <p className="text-gray-600 mb-3 leading-relaxed">{event.description}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {event.time}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {event.location}
                              </div>
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {event.registered}/{event.capacity} registered
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2 ml-4">
                          <Button className="bg-primary hover:bg-primary/90">Register Now</Button>
                          <Button variant="outline" size="sm">View Details</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredEvents.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No events found</h3>
                  <p className="text-gray-500">Try selecting a different month or check back later.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <section className="py-16 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">Stay Updated on Temple Events</h2>
            <p className="text-lg text-gray-600 mb-8">
              Subscribe to our newsletter to receive notifications about upcoming events and special announcements
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button className="bg-primary hover:bg-primary/90 px-8 py-6">Subscribe</Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
