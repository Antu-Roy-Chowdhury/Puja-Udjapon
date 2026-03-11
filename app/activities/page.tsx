"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

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
    <div className="min-h-screen">
      <main>
        <section className="relative py-24 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="max-w-[90rem] mx-auto px-4 sm:px-5 lg:px-6 text-center">
            <Badge className="bg-orange-100 text-orange-800 mb-4">OUR ACTIVITIES</Badge>
            <h1 className="font-serif text-5xl font-bold text-gray-900 mb-6">Temple Programs & Activities</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the programs our admins publish for prayer, service, learning, and celebration.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-[90rem] mx-auto px-4 sm:px-5 lg:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activities.map((activity) => (
                <Dialog key={activity.id}>
                  <DialogTrigger asChild>
                    <Card className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                      <div className="relative h-64">
                        <Image
                          src={activity.image_url || "/placeholder.svg"}
                          alt={activity.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h3 className="font-serif text-xl font-bold mb-2">{activity.name}</h3>
                          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide">
                            <Badge variant="secondary">{activity.level}</Badge>
                            <Badge variant="secondary">{activity.duration}</Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="font-serif text-2xl">{activity.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="relative h-64 rounded-lg overflow-hidden">
                        <Image src={activity.image_url || "/placeholder.svg"} alt={activity.name} fill className="object-cover" />
                      </div>
                      <p className="text-gray-600 leading-relaxed">{activity.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Schedule</h4>
                          <p className="text-sm text-gray-600">{activity.schedule}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Duration</h4>
                          <p className="text-sm text-gray-600">{activity.duration}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Level</h4>
                          <p className="text-sm text-gray-600 capitalize">{activity.level}</p>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">Want to join a program?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Create a member account and stay connected with new activities, upcoming events, and gallery updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link href="/signup">Join Our Community</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

