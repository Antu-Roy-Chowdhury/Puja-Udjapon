"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "member" | "super_admin"
  isApproved: boolean
  department?: string
  series?: string
  bloodGroup?: string
  contact?: string
  photo?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<"OK" | "PENDING" | "INVALID" | { error: string; status: string }>
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
    const userDataStr = localStorage.getItem("user-data")
    
    if (token && userDataStr) {
      try {
        const userData = JSON.parse(userDataStr)
        setUser(userData)
      } catch (e) {
        console.error("[v0] Failed to parse stored user data:", e)
        localStorage.removeItem("auth-token")
        localStorage.removeItem("user-data")
      }
    }
    setIsLoading(false)
  }, [])

const login = async (email: string, password: string): Promise<"OK" | "PENDING" | "INVALID" | { error: string; status: string }> => {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (data.status === "PENDING") {
      return { status: "PENDING", error: data.error || "Account pending approval" }
    }

    if (data.status !== "OK") {
      return { status: "INVALID", error: data.error || "Invalid email or password" }
    }

    if (data.user) {
      setUser(data.user)
      localStorage.setItem("auth-token", email)
      localStorage.setItem("user-data", JSON.stringify(data.user))
    }
    return "OK"
  } catch (error) {
    console.error("[v0] Login error:", error)
    return { status: "INVALID", error: error instanceof Error ? error.message : "An error occurred" }
  }
}



  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth-token")
    localStorage.removeItem("user-data")
  }
  const signup = async (payload: {
  name: string
  email: string
  password: string
  department: string
  series: string
  photo: string | null
}) => {
  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || "Signup failed")
    }

    return true
  } catch (error) {
    console.error("[v0] Signup error:", error)
    throw error
  }
}




  return <AuthContext.Provider value={{ user, login, logout, signup,  isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
