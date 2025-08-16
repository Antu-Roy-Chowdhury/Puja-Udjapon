"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  UserCheck,
  UserX,
  ImageIcon,
  Calendar,
  MessageSquare,
  CheckCircle,
  XCircle,
  Eye,
  Settings,
} from "lucide-react"

const mockPendingUsers = [
  {
    id: "1",
    name: "Rahul Kumar",
    email: "rahul.kumar@email.com",
    department: "CSE",
    series: "2020",
    role: "member",
    photo: "/kapil.jpg",
    createdAt: "2024-08-15",
    isApproved: false,
  },
  {
    id: "2",
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    department: "EEE",
    series: "2019",
    role: "member",
    photo: "/kapil.jpg",
    createdAt: "2024-08-14",
    isApproved: false,
  },
  {
    id: "3",
    name: "Amit Patel",
    email: "amit.patel@email.com",
    department: "ME",
    series: "2021",
    role: "member",
    photo: "/kapil.jpg",
    createdAt: "2024-08-13",
    isApproved: true,
  },
]

const mockPendingPosts = [
  {
    id: "1",
    title: "Temple Festival Celebration",
    type: "image",
    content: "/buddhist-prayer-flags-mountain-peaceful.png",
    author: "Sita Devi",
    authorEmail: "sita.devi@email.com",
    description: "Beautiful moments from our recent temple festival celebration with community participation.",
    createdAt: "2024-08-16",
    status: "pending",
  },
  {
    id: "2",
    title: "Morning Prayer Session",
    type: "video",
    content: "/buddha-meditation.png",
    author: "Ram Krishna",
    authorEmail: "ram.krishna@email.com",
    description: "Peaceful morning prayer session in the main temple hall.",
    createdAt: "2024-08-15",
    status: "success",
  },
  {
    id: "3",
    title: "Meditation Workshop",
    type: "image",
    content: "/buddha-profile-meditation.png",
    author: "Gita Sharma",
    authorEmail: "gita.sharma@email.com",
    description: "Community meditation workshop conducted by our senior teacher.",
    createdAt: "2024-08-14",
    status: "pending",
  },
]

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [pendingUsers, setPendingUsers] = useState(mockPendingUsers)
  const [pendingPosts, setPendingPosts] = useState(mockPendingPosts)
  const [stats, setStats] = useState({
    totalUsers: 156,
    pendingUsers: 3,
    totalPosts: 89,
    pendingPosts: 3,
    totalEvents: 12,
    activeMembers: 142,
  })

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    if (user.role !== "admin") {
      router.push("/")
      return
    }
  }, [user, router])

  const approveUser = (userId: string) => {
    setPendingUsers((prev) => prev.filter((u) => u.id !== userId))
    setStats((prev) => ({ ...prev, pendingUsers: prev.pendingUsers - 1, activeMembers: prev.activeMembers + 1 }))
    // In real app, make API call here
    console.log("[v0] Approved user:", userId)
  }

  const rejectUser = (userId: string) => {
    setPendingUsers((prev) => prev.filter((u) => u.id !== userId))
    setStats((prev) => ({ ...prev, pendingUsers: prev.pendingUsers - 1 }))
    // In real app, make API call here
    console.log("[v0] Rejected user:", userId)
  }

  const approvePost = (postId: string) => {
    setPendingPosts((prev) => prev.filter((p) => p.id !== postId))
    setStats((prev) => ({ ...prev, pendingPosts: prev.pendingPosts - 1, totalPosts: prev.totalPosts + 1 }))
    // In real app, make API call here
    console.log("[v0] Approved post:", postId)
  }

  const rejectPost = (postId: string) => {
    setPendingPosts((prev) => prev.filter((p) => p.id !== postId))
    setStats((prev) => ({ ...prev, pendingPosts: prev.pendingPosts - 1 }))
    // In real app, make API call here
    console.log("[v0] Rejected post:", postId)
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage temple website content and user approvals</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserCheck className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Members</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeMembers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserX className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ImageIcon className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Posts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Posts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingPosts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Events</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Pending Users</TabsTrigger>
            <TabsTrigger value="posts">Pending Posts</TabsTrigger>
            <TabsTrigger value="content">Content Management</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Pending Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserX className="h-5 w-5" />
                  Pending User Approvals ({pendingUsers.length})
                </CardTitle>
                <CardDescription>Review and approve new user registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingUsers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <UserCheck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No pending user approvals</p>
                    </div>
                  ) : (
                    pendingUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={user.photo || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-gray-900">{user.name}</h3>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{user.department}</Badge>
                              <Badge variant="outline">Series {user.series}</Badge>
                              <Badge variant="secondary">{user.role}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              /* View details */
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                            onClick={() => rejectUser(user.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => approveUser(user.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Posts Tab */}
          <TabsContent value="posts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Pending Post Approvals ({pendingPosts.length})
                </CardTitle>
                <CardDescription>Review and approve user-submitted gallery content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingPosts.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No pending post approvals</p>
                    </div>
                  ) : (
                    pendingPosts.map((post) => (
                      <Card key={post.id} className="overflow-hidden">
                        <div className="aspect-video bg-gray-100">
                          <img
                            src={post.content || "/placeholder.svg"}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant={post.type === "video" ? "default" : "secondary"}>{post.type}</Badge>
                            <span className="text-xs text-gray-500">{post.createdAt}</span>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">{post.title}</h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{post.description}</p>
                          <p className="text-xs text-gray-500 mb-3">By {post.author}</p>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-red-600 hover:text-red-700 bg-transparent"
                              onClick={() => rejectPost(post.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              onClick={() => approvePost(post.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Management Tab */}
          <TabsContent value="content">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Events Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">Manage temple events and schedules</p>
                  <Button className="w-full">Manage Events</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Gallery Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">Manage temple gallery and media</p>
                  <Button className="w-full">Manage Gallery</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Members Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">Manage temple members and roles</p>
                  <Button className="w-full">Manage Members</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Settings
                </CardTitle>
                <CardDescription>Configure temple website settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Auto-approve Members</h3>
                      <p className="text-sm text-gray-600">Automatically approve new member registrations</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Email Notifications</h3>
                      <p className="text-sm text-gray-600">Configure admin email notifications</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Content Moderation</h3>
                      <p className="text-sm text-gray-600">Set content moderation policies</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
