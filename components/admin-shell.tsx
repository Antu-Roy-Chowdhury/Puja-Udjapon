"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, DollarSign, Film, Home, ImageIcon, ShieldCheck, Users } from "lucide-react"

import { useAuth } from "@/components/auth-provider"

const links = [
  { href: "/admin", label: "Overview", icon: Home, roles: ["admin", "super_admin"] },
  { href: "/profile?tab=admin", label: "Approvals", icon: Users, roles: ["admin", "super_admin"] },
  { href: "/admin/welcome-media", label: "Home Page", icon: Film, roles: ["admin", "super_admin"] },
  { href: "/admin/events", label: "Events", icon: Calendar, roles: ["admin", "super_admin"] },
  { href: "/admin/activities", label: "Activities", icon: ImageIcon, roles: ["admin", "super_admin"] },
  { href: "/admin/donations", label: "Donations", icon: DollarSign, roles: ["super_admin"] },
  { href: "/admin/committee", label: "Committees", icon: Users, roles: ["super_admin"] },
  { href: "/admin/roles", label: "Roles", icon: ShieldCheck, roles: ["super_admin"] },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user } = useAuth()
  const visibleLinks = links.filter((link) => user && link.roles.includes(user.role))

  return (
    <div className="bg-gray-50">
      <div className="border-b bg-white">
        <nav aria-label="Admin navigation" className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 sm:px-5 lg:px-6">
          {visibleLinks.map((link) => {
            const Icon = link.icon
            const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href.split("?")[0])
            return (
              <Link key={link.href} href={link.href} className={`flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-medium ${active ? "bg-primary text-white" : "text-gray-600 hover:bg-orange-50 hover:text-gray-900"}`}>
                <Icon className="h-4 w-4" />{link.label}
              </Link>
            )
          })}
        </nav>
      </div>
      {children}
    </div>
  )
}
