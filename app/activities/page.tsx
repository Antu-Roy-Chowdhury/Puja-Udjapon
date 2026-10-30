"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Clock } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type Activity = {
  id: string
  name: string
  description: string
  image_url: string
  schedule: string
  duration: string
  level: string
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch("/api/activities/list")
        const data = await res.json()
        if (Array.isArray(data.activities)) {
          setActivities(data.activities)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch activities:", error)
      }
    }

    void fetchActivities()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50/50">
      <main>
        {/* Hero Section */}
        <section className="relative py-20 lg:py-28 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border-b border-orange-100/50">
          <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <Badge className="bg-orange-100 text-orange-800 border border-orange-200 px-3 py-1 rounded-full font-semibold">OUR ACTIVITIES</Badge>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">Temple Programs & Activities</h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
              Discover the programs our admins publish for prayer, service, learning, and celebration.
            </p>
          </div>
        </section>

        {/* Activities Grid Section */}
        <section className="py-20">
          <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activities.map((activity) => (
                <Dialog key={activity.id}>
                  <DialogTrigger asChild>
                    <Card className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 rounded-2xl border-gray-100 bg-white flex flex-col">
                      <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
                        <Image
                          src={activity.image_url || "/placeholder.svg"}
                          alt={activity.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        <div className="absolute top-4 right-4">
                          <Badge variant="secondary" className="bg-white/90 text-gray-900 backdrop-blur-sm font-medium">
                            {activity.level}
                          </Badge>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                          <h3 className="font-serif text-xl font-bold tracking-tight">{activity.name}</h3>
                          {activity.schedule && (
                            <p className="text-xs text-orange-200 flex items-center gap-1.5 font-medium">
                              <Clock className="w-3.5 h-3.5 shrink-0" />
                              <span>{activity.schedule}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </DialogTrigger>

                  {/* Activity Detail Modal */}
                  <DialogContent className="max-w-2xl rounded-2xl p-6 sm:p-8">
                    <DialogHeader>
                      <DialogTitle className="font-serif text-2xl font-bold text-gray-900">{activity.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 pt-2">
                      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-gray-100 shadow-inner">
                        <Image src={activity.image_url || "/placeholder.svg"} alt={activity.name} fill className="object-cover" />
                      </div>
                      <p className="text-gray-600 leading-relaxed font-light">{activity.description}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                        <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                          <h4 className="font-semibold text-gray-900 mb-1 text-xs uppercase tracking-wider text-orange-600">Schedule</h4>
                          <p className="text-sm text-gray-700">{activity.schedule || "Flexible"}</p>
                        </div>
                        <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                          <h4 className="font-semibold text-gray-900 mb-1 text-xs uppercase tracking-wider text-orange-600">Duration</h4>
                          <p className="text-sm text-gray-700">{activity.duration || "Standard"}</p>
                        </div>
                        <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                          <h4 className="font-semibold text-gray-900 mb-1 text-xs uppercase tracking-wider text-orange-600">Level</h4>
                          <p className="text-sm text-gray-700 capitalize">{activity.level || "All"}</p>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 bg-gradient-to-r from-orange-500/5 via-amber-500/5 to-transparent border-t border-orange-100/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">Want to join a program?</h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto font-light leading-relaxed">
              Create a member account and stay connected with new activities, upcoming events, and gallery updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-base font-medium shadow-md">
                <Link href="/signup">Join Our Community</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8 py-6 text-base font-medium border-gray-200 hover:bg-orange-50">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}