"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "member"
  isApproved: boolean
  department?: string
  series?: string
  photo?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  signup: (userData: any) => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth token on mount
    const token = localStorage.getItem("auth-token")
    if (token) {
      // In a real app, validate token with API
      // For now, mock user data
      setUser({
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        role: "member",
        isApproved: true,
      })
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Mock API call - replace with real API
      if (email === "admin@temple.com" && password === "admin") {
        const adminUser = {
          id: "1",
          name: "Admin User",
          email: "admin@temple.com",
          role: "admin" as const,
          isApproved: true,
        }
        setUser(adminUser)
        localStorage.setItem("auth-token", "mock-admin-token")
        return true
      } else if (email === "member@temple.com" && password === "member") {
        const memberUser = {
          id: "2",
          name: "Member User",
          email: "member@temple.com",
          role: "member" as const,
          isApproved: true,
        }
        setUser(memberUser)
        localStorage.setItem("auth-token", "mock-member-token")
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth-token")
  }

  const signup = async (userData: any): Promise<boolean> => {
    try {
      // Mock API call - replace with real API
      console.log("Signup data:", userData)
      return true
    } catch (error) {
      return false
    }
  }

  return <AuthContext.Provider value={{ user, login, logout, signup, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
