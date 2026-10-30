"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { uploadToCloudinary } from "@/lib/cloudinaryUpload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { UserPlus, Sparkles } from "lucide-react"

const departments = ["CSE", "EEE", "ME", "Civil", "Archi", "ETE", "ECE", "IPE", "CME", "MSE", "Che", "BECM", "URP"]
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

export default function SignupPage() {
  const { signup } = useAuth()
  
  // Auto-select Series as Current Year - 1 (e.g. 2026 -> 2025)
  const defaultSeries = (new Date().getFullYear() - 1).toString()

  const [formData, setFormData] = useState({
    name: "",
    series: defaultSeries,
    department: "",
    contact: "",
    email: "",
    password: "",
    bloodGroup: "",
    photo: null as File | null,
  })
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!formData.name || !formData.email || !formData.password || !formData.department || !formData.series || !formData.contact || !formData.bloodGroup) {
        toast({
          title: "Validation error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }

      if (formData.password.length < 6) {
        toast({
          title: "Weak password",
          description: "Password must be at least 6 characters long.",
          variant: "destructive",
        })
        return
      }

      let photoUrl: string | null = null

      if (formData.photo) {
        photoUrl = await uploadToCloudinary(formData.photo, "temple/profile", "image")
      }

      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        department: formData.department,
        series: formData.series,
        contact: formData.contact,
        bloodGroup: formData.bloodGroup,
        photo: photoUrl,
      })

      toast({
        title: "Account created successfully",
        description: "Your account is pending admin approval. You will be able to log in after approval.",
      })

      router.push("/login")
    } catch (err: any) {
      console.error("[v0] Signup error:", err)
      toast({
        title: "Signup failed",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/70 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl rounded-2xl border-gray-100 shadow-xl bg-white p-2 sm:p-6">
        <CardHeader className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <CardTitle className="font-serif text-3xl font-bold text-gray-900">Join Our Community</CardTitle>
          <CardDescription className="text-gray-600">Create your RUET Puja Udjapon account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-800">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Enter your full name"
                  className="rounded-xl border-gray-200"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-800">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="your@email.com"
                  className="rounded-xl border-gray-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="series" className="text-sm font-semibold text-gray-800">Series (Year) *</Label>
                <Select value={formData.series} onValueChange={(value) => setFormData({ ...formData, series: value })}>
                  <SelectTrigger className="rounded-xl border-gray-200">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl max-h-60">
                    {Array.from({ length: 31 }, (_, i) => 1995 + i).reverse().map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="department" className="text-sm font-semibold text-gray-800">Department *</Label>
                <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                  <SelectTrigger className="rounded-xl border-gray-200">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="contact" className="text-sm font-semibold text-gray-800">Contact Number *</Label>
                <Input
                  id="contact"
                  type="tel"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  required
                  placeholder="Your phone number"
                  className="rounded-xl border-gray-200"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bloodGroup" className="text-sm font-semibold text-gray-800">Blood Group *</Label>
                <Select value={formData.bloodGroup} onValueChange={(value) => setFormData({ ...formData, bloodGroup: value })}>
                  <SelectTrigger className="rounded-xl border-gray-200">
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {bloodGroups.map((group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-800">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="Create a password (min 6 characters)"
                className="rounded-xl border-gray-200"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="photo" className="text-sm font-semibold text-gray-800">Profile Photo</Label>
                <span className="text-xs text-gray-500">Optional</span>
              </div>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, photo: e.target.files?.[0] || null })}
                className="rounded-xl border-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
            </div>

            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full py-6 font-medium shadow-md mt-2" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-orange-600 hover:underline font-semibold">
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}