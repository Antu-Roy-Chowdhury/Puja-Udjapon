"use client"

import React from "react"

import { useAuth } from "@/components/auth-provider"

// Extend the User type to include 'bio'
type User = {
  id: string
  name: string
  email: string
  department?: string
  series?: string
  photo?: string
  contact?: string
  bloodGroup?: string
  role: string
  bio?: string
}
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Loading from "./loading"
import {
  Camera,
  Edit,
  Save,
  X,
  Users,
  UserCheck,
  UserX,
  ImageIcon,
  CheckCircle,
  XCircle,
} from "lucide-react"

export default function ProfilePage() {
  const { user, isLoading } = useAuth() as { user: User | null, isLoading: boolean }
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [redirected, setRedirected] = useState(false)
  const [defaultTab, setDefaultTab] = useState("profile")
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    department: "",
    series: "",
    photo: "",
    contact: "",
    bloodGroup: "",
    bio: "",
  })
  const [pendingUsers, setPendingUsers] = useState<any[]>([])
  const [pendingGallery, setPendingGallery] = useState<any[]>([])
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [selectedRoleUser, setSelectedRoleUser] = useState<string | null>(null)
  const [selectedNewRole, setSelectedNewRole] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    totalGallery: 0,
    pendingGallery: 0,
    approvedGallery: 0,
  })

  useEffect(() => {
    const tabParam = searchParams.get("tab")
    if (tabParam === "admin") {
      setDefaultTab("admin")
    }
  }, [searchParams])

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      setRedirected(true)
      router.push("/login")
      return
    }

    setProfileData({
      name: user.name || "",
      email: user.email || "",
      department: user.department || "",
      series: user.series || "",
      photo: user.photo || "",
      contact: user.contact || "",
      bloodGroup: user.bloodGroup || "",
      bio: user.bio || "",
    })

    // Load admin data if user is admin or super_admin
    if (user.role === "admin" || user.role === "super_admin") {
      loadAdminData()
    }
  }, [user, isLoading, router])

  const loadAdminData = async () => {
    try {
      const requests = [
        fetch("/api/admin/pending-users", {
          headers: { "x-user-role": user?.role || "" },
        }),
        fetch("/api/admin/pending-gallery", {
          headers: { "x-user-role": user?.role || "" },
        }),
      ]

      // If super_admin, also fetch all users
      if (user?.role === "super_admin") {
        requests.push(
          fetch("/api/admin/all-users", {
            headers: { "x-user-role": user?.role || "" },
          })
        )
      }

      const [usersRes, galleryRes, allUsersRes] = await Promise.all(requests)

      const users = await usersRes.json()
      const gallery = await galleryRes.json()
      const allUsersData = allUsersRes ? await allUsersRes.json() : []

      setPendingUsers(users || [])
      setPendingGallery(gallery || [])
      if (user?.role === "super_admin") {
        setAllUsers(allUsersData || [])
      }

      setStats({
        totalUsers: allUsersData?.length || 156,
        pendingUsers: users?.length || 0,
        totalGallery: 89,
        pendingGallery: gallery?.length || 0,
        approvedGallery: 67,
      })
    } catch (error) {
      console.error("[v0] Failed to load admin data:", error)
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingPhoto(true)
    try {
      // Get Cloudinary signature
      const signRes = await fetch("/api/cloudinary/sign")
      const { signature, timestamp, cloudName, apiKey } = await signRes.json()

      const formData = new FormData()
      formData.append("file", file)
      formData.append("api_key", apiKey)
      formData.append("timestamp", timestamp)
      formData.append("signature", signature)

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      )

      const data = await uploadRes.json()
      if (data.secure_url) {
        setProfileData({ ...profileData, photo: data.secure_url })
        toast({
          title: "Photo updated",
          description: "Your profile picture has been updated.",
        })
      }
    } catch (error) {
      console.error("[v0] Photo upload error:", error)
      toast({
        title: "Error",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleSave = async () => {
    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          ...profileData,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to save profile")
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
      setIsEditing(false)
      
      // Update local user data
      if (data.data) {
        console.log("[v0] Profile saved:", data.data)
      }
    } catch (error) {
      console.error("[v0] Save profile error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    setProfileData({
      name: user?.name || "",
      email: user?.email || "",
      department: user?.department || "",
      series: user?.series || "",
      contact: "",
      bloodGroup: "",
      bio: "",
      photo: "",
    })
    setIsEditing(false)
  }

  const approveUser = async (email: string) => {
    try {
      const res = await fetch("/api/admin/approve-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": user?.role ?? "",
        },
        body: JSON.stringify({ targetEmail: email }),
      })

      if (res.ok) {
        setPendingUsers((prev) => prev.filter((u) => u.email !== email))
        toast({ title: "User approved" })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve user",
        variant: "destructive",
      })
    }
  }

  const rejectUser = async (email: string) => {
    try {
      const res = await fetch("/api/admin/reject-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": user?.role ?? "",
        },
        body: JSON.stringify({ targetEmail: email }),
      })

      if (res.ok) {
        setPendingUsers((prev) => prev.filter((u) => u.email !== email))
        toast({ title: "User rejected" })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject user",
        variant: "destructive",
      })
    }
  }

  const approveGallery = async (id: string) => {
    try {
      const res = await fetch("/api/admin/approve-gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": user?.role ?? "",
        },
        body: JSON.stringify({ id }),
      })

      if (res.ok) {
        setPendingGallery((prev) => prev.filter((g) => g.id !== id))
        toast({ title: "Gallery item approved" })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve gallery item",
        variant: "destructive",
      })
    }
  }

  const rejectGallery = async (id: string) => {
    try {
      const res = await fetch("/api/admin/reject-gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": user?.role ?? "",
        },
        body: JSON.stringify({ id }),
      })

      if (res.ok) {
        setPendingGallery((prev) => prev.filter((g) => g.id !== id))
        toast({ title: "Gallery item rejected" })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject gallery item",
        variant: "destructive",
      })
    }
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch("/api/admin/update-user-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": user?.role ?? "",
        },
        body: JSON.stringify({ userId, newRole }),
      })

      if (res.ok) {
        setAllUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        )
        setSelectedRoleUser(null)
        setSelectedNewRole(null)
        toast({ title: "User role updated successfully" })
      } else {
        const data = await res.json()
        toast({
          title: "Error",
          description: data.error || "Failed to update user role",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      })
    }
  }

  if (isLoading || (!user && !redirected)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<Loading />}>
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full mb-8" style={{ gridTemplateColumns: user.role === "member" ? "1fr" : "1fr 1fr" }}>
              <TabsTrigger value="profile">My Profile</TabsTrigger>
              {(user.role === "admin" || user.role === "super_admin") && (
                <TabsTrigger value="admin">Admin Dashboard</TabsTrigger>
              )}
            </TabsList>

            {/* PROFILE TAB */}
            <TabsContent value="profile">
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="relative h-32 bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
                  <div className="absolute -bottom-16 left-6">
                    <div className="relative">
                      <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                        <AvatarImage src={profileData.photo || user.photo || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback className="text-2xl font-semibold bg-primary text-white">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        id="photo-upload"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        disabled={uploadingPhoto}
                      />
                      <Button
                        size="sm"
                        className="absolute bottom-2 right-2 rounded-full w-8 h-8 p-0"
                        onClick={() => document.getElementById("photo-upload")?.click()}
                        disabled={uploadingPhoto}
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="pt-20 px-6 pb-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">{profileData.name}</h1>
                      <div className="flex gap-2 mt-2">
                        <Badge className="capitalize">{user.role}</Badge>
                        <Badge variant="outline">{profileData.department}</Badge>
                        <Badge variant="outline">{profileData.series}</Badge>
                      </div>
                    </div>
                    {!isEditing && (
                      <Button onClick={() => setIsEditing(true)} variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" value={profileData.email} disabled className="mt-1 bg-gray-100" />
                        </div>
                        <div>
                          <Label htmlFor="department">Department</Label>
                          <Input
                            id="department"
                            value={profileData.department}
                            onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="series">Series/Batch</Label>
                          <Input
                            id="series"
                            value={profileData.series}
                            onChange={(e) => setProfileData({ ...profileData, series: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="contact">Contact</Label>
                          <Input
                            id="contact"
                            value={profileData.contact}
                            onChange={(e) => setProfileData({ ...profileData, contact: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="bloodGroup">Blood Group</Label>
                          <Input
                            id="bloodGroup"
                            value={profileData.bloodGroup}
                            onChange={(e) => setProfileData({ ...profileData, bloodGroup: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <textarea
                          id="bio"
                          value={profileData.bio}
                          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                          rows={4}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={handleSave} className="bg-primary">
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button onClick={handleCancel} variant="outline">
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium">Bio</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-900">{profileData.bio || "Not specified"}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium">Email</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-900">{profileData.email}</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium">Department</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-900">{profileData.department || "Not specified"}</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium">Series/Batch</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-900">{profileData.series || "Not specified"}</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium">Blood Group</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-900">{profileData.bloodGroup || "Not specified"}</p>
                        </CardContent>
                      </Card>

                      

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium">Contact</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-900">{profileData.contact || "Not specified"}</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* ADMIN DASHBOARD TAB */}
            {(user.role === "admin" || user.role === "super_admin") && (
              <TabsContent value="admin">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
                    <p className="text-gray-600">Manage website content and user approvals</p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Users className="h-8 w-8 text-blue-600" />
                          <div>
                            <p className="text-xs font-medium text-gray-600">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <UserX className="h-8 w-8 text-orange-600" />
                          <div>
                            <p className="text-xs font-medium text-gray-600">Pending Users</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.pendingUsers}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <ImageIcon className="h-8 w-8 text-purple-600" />
                          <div>
                            <p className="text-xs font-medium text-gray-600">Total Gallery</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalGallery}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <UserCheck className="h-8 w-8 text-green-600" />
                          <div>
                            <p className="text-xs font-medium text-gray-600">Approved</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.approvedGallery}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-8 w-8 text-yellow-600" />
                          <div>
                            <p className="text-xs font-medium text-gray-600">Pending</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.pendingGallery}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Pending Users Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Pending User Approvals</CardTitle>
                      <CardDescription>Review and approve new member registrations</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {pendingUsers.length === 0 ? (
                        <p className="text-gray-600">No pending users</p>
                      ) : (
                        <div className="space-y-4">
                          {pendingUsers.map((user) => (
                            <div key={user.email} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center gap-4">
                                <Avatar>
                                  <AvatarImage src={user.photo || "/placeholder.svg"} alt={user.name} />
                                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-sm text-gray-600">{user.email}</p>
                                  <p className="text-xs text-gray-500">
                                    {user.department} • {user.series}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => approveUser(user.email)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => rejectUser(user.email)}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Pending Gallery Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Pending Gallery Items</CardTitle>
                      <CardDescription>Review and approve uploaded images and videos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {pendingGallery.length === 0 ? (
                        <p className="text-gray-600">No pending gallery items</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {pendingGallery.map((item) => (
                            <div key={item.id} className="border rounded-lg overflow-hidden">
                              <img src={item.url || "/placeholder.svg"} alt={item.title} className="w-full h-48 object-cover" />
                              <div className="p-4">
                                <h4 className="font-medium mb-1">{item.title}</h4>
                                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                                <p className="text-xs text-gray-500 mb-3">By: {item.uploaded_by}</p>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => approveGallery(item.id)}
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => rejectGallery(item.id)}
                                    className="flex-1"
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Super Admin Users Management Section */}
                  {user.role === "super_admin" && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Users Management</CardTitle>
                        <CardDescription>Manage user roles and permissions</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {allUsers.length === 0 ? (
                          <p className="text-gray-600">No users to manage</p>
                        ) : (
                          <div className="space-y-4">
                            {allUsers.map((u) => (
                              <div key={u.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-4">
                                  <Avatar>
                                    <AvatarImage src={u.photo || "/placeholder.svg"} alt={u.name} />
                                    <AvatarFallback>{u.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{u.name}</p>
                                    <p className="text-sm text-gray-600">{u.email}</p>
                                    <p className="text-xs text-gray-500">
                                      {u.department} • {u.series}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Badge className="capitalize">{u.role}</Badge>
                                  {selectedRoleUser === u.id ? (
                                    <div className="flex gap-2">
                                      <select
                                        value={selectedNewRole || u.role}
                                        onChange={(e) => setSelectedNewRole(e.target.value)}
                                        className="text-sm px-2 py-1 border rounded"
                                      >
                                        <option value="member">Member</option>
                                        <option value="admin">Admin</option>
                                        <option value="super_admin">Super Admin</option>
                                      </select>
                                      <Button
                                        size="sm"
                                        onClick={() => {
                                          if (selectedNewRole && selectedNewRole !== u.role) {
                                            updateUserRole(u.id, selectedNewRole)
                                          }
                                        }}
                                        className="bg-blue-600 hover:bg-blue-700"
                                      >
                                        Update
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          setSelectedRoleUser(null)
                                          setSelectedNewRole(null)
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setSelectedRoleUser(u.id)
                                        setSelectedNewRole(u.role)
                                      }}
                                    >
                                      Change Role
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </Suspense>
      </div>
    </div>
  )
}
