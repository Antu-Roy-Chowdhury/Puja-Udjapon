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
  login: (email: string, password: string) => Promise<"OK" | "PENDING" | "INVALID" | { error: string; status: string }>
  logout: () => void
  signup: (userData: SignupPayload) => Promise<boolean>
  updateUser: (userData: Partial<User>) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function normalizeUser(userData: any): User {
  return {
    ...userData,
    approved: Boolean(userData?.approved ?? userData?.isApproved),
    isApproved: Boolean(userData?.approved ?? userData?.isApproved),
  }
}

function persistUser(userData: User | null) {
  if (!userData) {
    localStorage.removeItem("auth-token")
    localStorage.removeItem("user-data")
    return
  }

  localStorage.setItem("auth-token", userData.email)
  localStorage.setItem("user-data", JSON.stringify(userData))
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("auth-token")
    const userDataStr = localStorage.getItem("user-data")

    if (token && userDataStr) {
      try {
        const userData = normalizeUser(JSON.parse(userDataStr))
        setUser(userData)
      } catch (error) {
        console.error("[v0] Failed to parse stored user data:", error)
        persistUser(null)
      }
    }

    setIsLoading(false)
  }, [])

  const login = async (
    email: string,
    password: string,
  ): Promise<"OK" | "PENDING" | "INVALID" | { error: string; status: string }> => {
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
        const normalizedUser = normalizeUser(data.user)
        setUser(normalizedUser)
        persistUser(normalizedUser)
      }

      return "OK"
    } catch (error) {
      console.error("[v0] Login error:", error)
      return { status: "INVALID", error: error instanceof Error ? error.message : "An error occurred" }
    }
  }

  const logout = () => {
    setUser(null)
    persistUser(null)
  }

  const signup = async (payload: SignupPayload) => {
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

  const updateUser = (userData: Partial<User>) => {
    setUser((currentUser) => {
      if (!currentUser) {
        return currentUser
      }

      const nextUser = normalizeUser({ ...currentUser, ...userData })
      persistUser(nextUser)
      return nextUser
    })
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
