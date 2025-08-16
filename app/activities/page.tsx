"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"

const activities = [
  {
    id: 1,
    name: "Light Meditation",
    image: "/buddhist-meditation-cave-peaceful.png",
    description:
      "Experience inner peace through guided light meditation sessions. Our experienced teachers will guide you through ancient Buddhist meditation techniques that help calm the mind and illuminate the path to enlightenment.",
    schedule: "Daily at 6:00 AM and 7:00 PM",
    duration: "45 minutes",
    level: "All levels welcome",
  },
  {
    id: 2,
    name: "Weekly Prayers",
    image: "/buddhist-monks-ceremony.png",
    description:
      "Join us for special ceremonial events throughout the year, including Buddha's Birthday, Vesak Day, and other significant Buddhist celebrations. These events bring our community together in prayer and celebration.",
    schedule: "Monthly special occasions",
    duration: "2-3 hours",
    level: "Open to all",
  },
  {
    id: 3,
    name: "Special Events",
    image: "/buddhist-festival.png",
    description:
      "Celebrate the festival of colors with our Buddhist community. This joyous occasion combines traditional Holi celebrations with Buddhist teachings about joy, compassion, and unity.",
    schedule: "Annual celebration in March",
    duration: "Full day event",
    level: "Family friendly",
  },
  {
    id: 4,
    name: "Ongoing Programs",
    image: "/buddhist-temple-doors.png",
    description:
      "Participate in our continuous learning programs including weekly dharma discussions, community service projects, and spiritual development workshops designed for long-term growth.",
    schedule: "Weekly sessions",
    duration: "1-2 hours",
    level: "Progressive levels",
  },
  {
    id: 5,
    name: "Holi Festival",
    image: "/buddhist-prayer-flags-mountain-peaceful.png",
    description:
      "Comprehensive courses covering Buddhist philosophy, meditation techniques, and practical applications of Buddhist teachings in daily life. Perfect for beginners and advanced practitioners.",
    schedule: "Monthly course starts",
    duration: "8-week programs",
    level: "Beginner to advanced",
  },
  {
    id: 6,
    name: "Dharma Study",
    image: "/buddha-meditation.png",
    description:
      "Deep dive into Buddhist scriptures and teachings through guided study sessions. Explore the Four Noble Truths, Eightfold Path, and other fundamental Buddhist concepts.",
    schedule: "Twice weekly",
    duration: "90 minutes",
    level: "Intermediate",
  },
]

export default function ActivitiesPage() {
  const [selectedActivity, setSelectedActivity] = useState(null)

  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section */}
        <section className="relative py-24 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="bg-orange-100 text-orange-800 mb-4">OUR ACTIVITIES</Badge>
            <h1 className="font-serif text-5xl font-bold text-gray-900 mb-6">Temple Programs & Activities</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our diverse range of spiritual programs designed to nurture your Buddhist practice and connect
              with our community
            </p>
          </div>
        </section>

        {/* Activities Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activities.map((activity) => (
                <Dialog key={activity.id}>
                  <DialogTrigger asChild>
                    <Card className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                      <div className="relative h-64">
                        <Image
                          src={activity.image || "/placeholder.svg"}
                          alt={activity.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="font-serif text-xl font-bold text-white mb-2">{activity.name}</h3>
                          <Button size="sm" className="bg-primary hover:bg-primary/90">
                            Learn More
                          </Button>
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
                        <Image
                          src={activity.image || "/placeholder.svg"}
                          alt={activity.name}
                          fill
                          className="object-cover"
                        />
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
                          <p className="text-sm text-gray-600">{activity.level}</p>
                        </div>
                      </div>
                      <div className="flex space-x-4 pt-4">
                        <Button className="flex-1">Join This Program</Button>
                        <Button variant="outline" className="flex-1 bg-transparent">
                          Contact for Info
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">Ready to Begin Your Spiritual Journey?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Join our welcoming community and discover the path to inner peace and enlightenment
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Join Our Community
              </Button>
              <Button size="lg" variant="outline">
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </main>

    </div>
  )
}
