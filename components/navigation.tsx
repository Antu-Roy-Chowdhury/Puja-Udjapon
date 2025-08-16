"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "./auth-provider"
import { Button } from "./ui/button"
import { LogOut, User, Settings, Menu, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

export function Navigation() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Close on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false)
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [menuOpen])

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Temple" width={42} height={40} />
            <span className="font-serif font-bold text-xl text-gray-900">
              <Image src="/placeholder-logo.jpg" alt="Temple" width={100} height={50} />
            </span>
          </Link>

          {/* Hamburger Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-primary focus:outline-none"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`hover:text-primary ${pathname === "/" ? "text-primary border-b-2 border-primary font-semibold" : "text-gray-700"}`}>Home</Link>
            <Link  href="/activities" className={`hover:text-primary ${pathname === "/activities" ? "text-primary border-b-2 border-primary font-semibold" : "text-gray-700"}`}>Activities</Link>
            <Link href="/events" className={`hover:text-primary ${pathname === "/events" ? "text-primary border-b-2 border-primary font-semibold" : "text-gray-700"}`}>Events</Link>
            <Link href="/gallery" className={`hover:text-primary ${pathname === "/gallery" ? "text-primary border-b-2 border-primary font-semibold" : "text-gray-700"}`}>Gallery</Link>
            <Link href="/members" className={`hover:text-primary ${pathname === "/members" ? "text-primary border-b-2 border-primary font-semibold" : "text-gray-700"}`}>Members</Link>
            <Link href="/contact" className={`hover:text-primary ${pathname === "/contact" ? "text-primary border-b-2 border-primary font-semibold" : "text-gray-700"}`}>Contact</Link>
          </div>

          {/* Auth Section (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/donate">Donate Now</Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center space-x-2">
                          <Settings className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={logout} className="flex items-center space-x-2">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/donate">Donate Now</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Join Community</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

            {/* Slide-in Menu */}
            <div
              ref={menuRef}
              className="fixed top-0 right-0 w-1/2 h-screen bg-white shadow-lg p-6 space-y-6 transform transition-transform duration-300 ease-in-out translate-x-0 "
              role="dialog"
              aria-modal="true"
            >
              {/* Close Button */}
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-red-600"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-4 text-lg">
            <Link href="/" className={`hover:text-primary ${pathname === "/" ? "text-primary border-b-2 p-1 border-primary font-semibold" : "text-gray-700"}`}>Home</Link>
            <Link  href="/activities" className={`hover:text-primary ${pathname === "/activities" ? "text-primary border-b-2 p-1 border-primary font-semibold" : "text-gray-700"}`}>Activities</Link>
            <Link href="/events" className={`hover:text-primary ${pathname === "/events" ? "text-primary border-b-2 p-1 border-primary font-semibold" : "text-gray-700"}`}>Events</Link>
            <Link href="/gallery" className={`hover:text-primary ${pathname === "/gallery" ? "text-primary border-b-2 p-1 border-primary font-semibold" : "text-gray-700"}`}>Gallery</Link>
            <Link href="/members" className={`hover:text-primary ${pathname === "/members" ? "text-primary border-b-2 p-1 border-primary font-semibold" : "text-gray-700"}`}>Members</Link>
            <Link href="/contact" className={`hover:text-primary ${pathname === "/contact" ? "text-primary border-b-2 p-1 border-primary font-semibold" : "text-gray-700"}`}>Contact</Link>

                {user ? (
                  <>
                  <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/donate">Donate Now</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Join Community</Link>
                </Button>
                  </>
                ) : (
                  <>
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/donate">Donate Now</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Join Community</Link>
                </Button>
                  </>
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}