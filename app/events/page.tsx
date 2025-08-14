"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Clock, Users } from "lucide-react"

const events = [
  { id: 1, name: "Sri Kirsna's Janmashtami", subtitle: "Krisnas Name Conferment Ceremony", date: "2024-08-16", time: "5:00 PM - 8:30 PM", location: "RUET Temple", description: "A transformative weekend retreat focusing on blessing empowerment and spiritual renewal.", capacity: 50, registered: 32, month: "August" },
  { id: 2, name: "Leo Sankranti", subtitle: "", date: "2024-08-17", time: "7:00 PM - 9:00 PM", location: "Meditation Garden", description: "Peaceful candlelight meditation session under the stars.", capacity: 30, registered: 18, month: "August" },
  { id: 3, name: "Annada Ekadashi", subtitle: "Name Conferment Ceremony", date: "2024-08-19", time: "7:00 PM - 9:00 PM", location: "Ceremony Hall", description: "Special ceremony for dharma name conferment and authentication.", capacity: 40, registered: 25, month: "August" },
  { id: 4, name: "Ganesh Chaturthi", subtitle: "", date: "2024-08-27", time: "7:00 PM - 9:00 PM", location: "Temple Grounds", description: "Annual celebration of Buddha's birthday with traditional ceremonies.", capacity: 100, registered: 67, month: "August" },
  { id: 5, name: "New Year Meditation Retreat", subtitle: "3-Day Silent Retreat", date: "2025-01-01", time: "6:00 AM - 8:00 PM", location: "Retreat Center", description: "Welcome the new year with a transformative 3-day silent meditation retreat.", capacity: 25, registered: 15, month: "January" },
  { id: 6, name: "Lunar New Year Festival", subtitle: "Community Celebration", date: "2025-02-10", time: "10:00 AM - 6:00 PM", location: "Temple Complex", description: "Celebrate Lunar New Year with traditional ceremonies, food, and community activities.", capacity: 200, registered: 89, month: "February" },
]

const months = ["All","January","February","March","April","May","June","July","August","September","October","November","December"]

export default function EventsPage() {
  const [selectedMonth, setSelectedMonth] = useState("August")

  // Filter events by month
  const filteredEvents = selectedMonth === "All"
    ? events
    : events.filter((event) => event.month === selectedMonth)

  // Function to get correct days and start weekday for 2025
  const getCalendarDays = () => {
    let year = 2025
    let monthIndex = selectedMonth === "August" ? new Date().getMonth() : months.indexOf(selectedMonth) - 1
    let daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
    let firstDay = new Date(year, monthIndex, 1).getDay() // 0 = Sunday
    let daysArray = []

    // Add empty slots for days before month starts
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(null)
    }
    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      daysArray.push(day)
    }
    return daysArray
  }

  const calendarDays = getCalendarDays()

  const eventDates = filteredEvents.map(event => ({
    day: new Date(event.date).getDate(),
    month: new Date(event.date).getMonth(),
    year: new Date(event.date).getFullYear()
  }))

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
                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-6 text-center">Event Calendar</h3>
                <div className="flex items-center justify-center mb-4">
                  <div className="text-center text-sm font-semibold text-gray-600 py-2">
                    {selectedMonth === "All" ? months[new Date().getMonth() + 1] : selectedMonth} 2025
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, idx) => {
                    const isEventDay = day !== null && eventDates.some(d => d.day === day)
                    return (
                      <div
                        key={idx}
                        className={`
                          text-center py-2 text-sm rounded-lg cursor-pointer transition-colors
                          ${day === null ? "bg-transparent cursor-default" : ""}
                          ${isEventDay ? "bg-primary text-white font-bold hover:bg-primary/90" : day ? "hover:bg-gray-100" : ""}
                        `}
                      >
                        {day || ""}
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span>Event Days</span>
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
                  <Card key={event.id} className="p-6 hover:shadow-lg transition-shadow">
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
