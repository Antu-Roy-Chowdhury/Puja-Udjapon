"use client"

import Link from "next/link"
import Image from "next/image"
import { useAuth } from "./auth-provider"
import { Button } from "./ui/button"
import { LogOut, User, Settings } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

export function Navigation() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Temple" width={42} height={40} className="h-15 w-17" />
            <span className="font-serif font-bold text-xl text-gray-900"><Image src="/placeholder-logo.jpg" alt=" Temple" width={100} height={50} className="h-15 w-35" /></span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary  ">
              Home
            </Link>
            <Link href="/activities" className="text-gray-700 hover:text-primary  ">
              Activities
            </Link>
            <Link href="/events" className="text-gray-700 hover:text-primary  ">
              Events
            </Link>
            <Link href="/gallery" className="text-gray-700 hover:text-primary  " >
              Gallery
            </Link>
            <Link href="/members" className="text-gray-700 hover:text-primary  ">
              Members
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary  ">
              Contact
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
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
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/donate">Donate Now</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Join Community</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
