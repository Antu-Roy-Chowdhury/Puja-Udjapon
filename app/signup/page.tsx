"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
// import { uploadToCloudinary } from "@/lib/cloudinaryUpload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"

const departments = ["CSE", "EEE", "ME", "Civil", "Archi", "ETE", "ECE", "IPE", "GCE", "MSE", "CFPE", "BECM", "URP"]
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

async function uploadToCloudinary(file: File) {
  const signRes = await fetch("/api/cloudinary/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder: "temple/profile" }),
  })
  if (!signRes.ok) throw new Error("Signature failed")

  const { signature, timestamp, cloudName, apiKey, folder } = await signRes.json()

  const formData = new FormData()
  formData.append("file", file)
  formData.append("api_key", apiKey)
  formData.append("timestamp", timestamp)
  formData.append("signature", signature)
  formData.append("folder", folder)

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    { method: "POST", body: formData }
  )

  const data = await uploadRes.json()

  if (!uploadRes.ok) {
    console.error("[v0] Cloudinary error:", data)
    throw new Error(data.error?.message || "Upload failed")
  }

  return data.secure_url
}

export default function SignupPage() {
  const { signup } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    series: "",
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
  console.log("[v0] Signup form submitted:", formData)

  try {
    // Validate required fields
    if (!formData.name || !formData.email || !formData.password || !formData.department || !formData.series) {
      console.log("[v0] Validation failed: missing fields")
      toast({
        title: "Validation error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Validate password length
    if (formData.password.length < 6) {
      console.log("[v0] Password too short")
      toast({
        title: "Weak password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    let photoUrl = null

    if (formData.photo) {
      try {
        console.log("[v0] Uploading photo...")
        photoUrl = await uploadToCloudinary(formData.photo)
        console.log("[v0] Photo uploaded:", photoUrl)
      } catch (photoErr: any) {
        console.error("[v0] Photo upload error:", photoErr)
        toast({
          title: "Photo upload failed",
          description: photoErr.message || "Failed to upload photo. You can continue without it.",
          variant: "destructive",
        })
        // Continue without photo
      }
    }

    console.log("[v0] Calling signup API...")
    const ok = await signup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      department: formData.department,
      series: formData.series,
      photo: photoUrl,
    })

    console.log("[v0] Signup response:", ok)

    toast({
      title: "Account created successfully",
      description: "Your account is pending admin approval. You'll be notified once approved.",
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-2xl">Join Our Community</CardTitle>
          <CardDescription>Create your RUET Puja Udjapon account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div >
                <Label htmlFor="name">Full Name</Label>
                <Input
                  
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Enter your full name"
                  className="mt-1" 
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="your@email.com"
                  className="mt-1" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="series">Series (Year)</Label>
                <Select
  value={formData.series}
  onValueChange={(value) =>
    setFormData({ ...formData, series: value })
  }
>

                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => 1995 + i).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, department: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department"
                  className="mt-1"  />
                  </SelectTrigger>
                  <SelectContent>
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
              <div>
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  type="tel"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  required
                  placeholder="Your phone number"
                  className="mt-1" 
                />
              </div>
              <div>
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, bloodGroup: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" 
                  className="mt-1" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodGroups.map((group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="Create a password"
                  className="mt-1" 
              />
            </div>

            <div>
              <Label htmlFor="photo">Profile Photo</Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, photo: e.target.files?.[0] || null })}
                className="mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
