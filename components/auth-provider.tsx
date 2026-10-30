"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "member" | "super_admin"
  approved: boolean
  isApproved: boolean
  department?: string
  series?: string
  bloodGroup?: string
  contact?: string
  photo?: string
  bio?: string
}

interface SignupPayload {
  name: string
  email: string
  password: string
  department: string
  series: string
  contact: string
  bloodGroup: string
  photo: string | null
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<"OK" | { error: string; status: "PENDING" | "INVALID" }>
  logout: () => Promise<void>
  signup: (userData: SignupPayload) => Promise<boolean>
  updateUser: (userData: Partial<User>) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function normalizeUser(userData: any): User {
  const approved = Boolean(userData?.approved ?? userData?.isApproved)
  return { ...userData, approved, isApproved: approved }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    fetch("/api/auth/session", { signal: controller.signal, cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setUser(data.user ? normalizeUser(data.user) : null))
      .catch((error) => {
        if (error?.name !== "AbortError") console.error("Failed to restore session", error)
      })
      .finally(() => setIsLoading(false))
    return () => controller.abort()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (data.status === "PENDING") {
        return { status: "PENDING" as const, error: data.error || "Account pending approval" }
      }
      if (!response.ok || data.status !== "OK" || !data.user) {
        return { status: "INVALID" as const, error: data.error || "Invalid email or password" }
      }
      setUser(normalizeUser(data.user))
      return "OK" as const
    } catch (error) {
      return { status: "INVALID" as const, error: error instanceof Error ? error.message : "An error occurred" }
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } finally {
      setUser(null)
      window.location.assign("/")
    }
  }

  const signup = async (payload: SignupPayload) => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || "Signup failed")
    return true
  }

  const updateUser = (userData: Partial<User>) => {
    setUser((current) => (current ? normalizeUser({ ...current, ...userData }) : current))
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
