"use client"

import Link from "next/link"
import { Calendar, DollarSign, Film, ImageIcon, ShieldCheck, Users } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const coreCards = [
  { title: "Profile Approvals", description: "Approve pending users and gallery submissions.", href: "/profile?tab=admin", icon: Users },
  { title: "Events", description: "Create and manage manual events and synced calendar items.", href: "/admin/events", icon: Calendar },
  { title: "Activities", description: "Add, edit, and delete activities from Supabase.", href: "/admin/activities", icon: ImageIcon },
  { title: "Welcome Media", description: "Submit the homepage promo video with layout control.", href: "/admin/welcome-media", icon: Film },
]

const superAdminCards = [
  { title: "Donations", description: "See donation totals and the latest submitted rows.", href: "/admin/donations", icon: DollarSign },
  { title: "Committee", description: "Assign committee positions, department, and series.", href: "/admin/committee", icon: Users },
  { title: "User Roles", description: "Promote members to admin or super admin from a dedicated page.", href: "/admin/roles", icon: ShieldCheck },
]

export default function AdminDashboard() {
  const { user } = useAuth()
  const cards = user?.role === "super_admin" ? [...coreCards, ...superAdminCards] : coreCards

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6 space-y-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">Admin Management</h1>
          <p className="text-gray-600">Use the dedicated tools below to keep approvals, events, activities, and media organized.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <Card key={card.title} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl"><Icon className="h-5 w-5" />{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{card.description}</p>
                  <Button asChild className="w-full"><Link href={card.href}>Open</Link></Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
