"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Camera, Edit, Save, X, User, Shield, Settings } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    department: "",
    series: "",
    contact: "",
    bloodGroup: "",
    bio: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    setProfileData({
      name: user.name || "",
      email: user.email || "",
      department: user.department || "",
      series: user.series || "",
      contact: "",
      bloodGroup: "",
      bio: "",
    })
  }, [user, router])

  if (!user) {
    return null
  }

  const handleSave = async () => {
    try {
      console.log("Updating profile:", profileData)
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    setProfileData({
      name: user.name || "",
      email: user.email || "",
      department: user.department || "",
      series: user.series || "",
      contact: "",
      bloodGroup: "",
      bio: "",
    })
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="relative h-32 bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
            <div className="absolute -bottom-16 left-6">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarImage src={user.photo || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="text-2xl font-semibold bg-primary text-white">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute bottom-2 right-2 rounded-full w-8 h-8 p-0"
                  onClick={() =>
                    toast({ title: "Feature coming soon", description: "Photo upload will be available soon." })
                  }
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="pt-20 pb-6 px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                    {user.role === "admin" ? "Administrator" : "Member"}
                  </Badge>
                  <Badge variant={user.isApproved ? "default" : "destructive"}>
                    {user.isApproved ? "Approved" : "Pending Approval"}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2 bg-transparent">
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{profileData.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{profileData.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department">Department</Label>
                    {isEditing ? (
                      <Input
                        id="department"
                        value={profileData.department}
                        onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                        placeholder="e.g., CSE, EEE, ME"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{profileData.department || "Not specified"}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="series">Series (Year)</Label>
                    {isEditing ? (
                      <Input
                        id="series"
                        value={profileData.series}
                        onChange={(e) => setProfileData({ ...profileData, series: e.target.value })}
                        placeholder="e.g., 2020"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{profileData.series || "Not specified"}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact">Contact Number</Label>
                    {isEditing ? (
                      <Input
                        id="contact"
                        value={profileData.contact}
                        onChange={(e) => setProfileData({ ...profileData, contact: e.target.value })}
                        placeholder="Your phone number"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{profileData.contact || "Not provided"}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    {isEditing ? (
                      <Input
                        id="bloodGroup"
                        value={profileData.bloodGroup}
                        onChange={(e) => setProfileData({ ...profileData, bloodGroup: e.target.value })}
                        placeholder="e.g., A+, B-, O+"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{profileData.bloodGroup || "Not specified"}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  {isEditing ? (
                    <textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      rows={3}
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{profileData.bio || "No bio provided"}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Role</span>
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                    {user.role === "admin" ? "Administrator" : "Member"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge variant={user.isApproved ? "default" : "destructive"}>
                    {user.isApproved ? "Approved" : "Pending"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm text-gray-900">Jan 2024</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Events Attended</span>
                  <span className="font-semibold">12</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Gallery Uploads</span>
                  <span className="font-semibold">5</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Community Points</span>
                  <span className="font-semibold text-primary">250</span>
                </div>
              </CardContent>
            </Card>

            {user.role === "admin" && (
              <Card>
                <CardHeader>
                  <CardTitle>Admin Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                    <a href="/admin">
                      <Settings className="w-4 h-4 mr-2" />
                      Admin Dashboard
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <User className="w-4 h-4 mr-2" />
                    Manage Users
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
