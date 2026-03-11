"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Camera, CheckCircle, Edit, ImageIcon, Save, UserCheck, UserX, Users, X, XCircle } from "lucide-react"

import { useAuth, type User } from "@/components/auth-provider"
import { uploadToCloudinary } from "@/lib/cloudinaryUpload"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

import Loading from "./loading"

type PendingUser = { id: string; name: string; email: string; department?: string; series?: string; photo?: string; role: string }
type PendingGallery = { id: string; title: string; url: string; description?: string; uploadedBy?: string }
type RoleUser = { id: string; name: string; email: string; department?: string; series?: string; photo?: string; role: string }

function AdminPanel({ currentUser, pendingUsers, pendingGallery, allUsers, onApproveUser, onRejectUser, onApproveGallery, onRejectGallery, onUpdateRole }: { currentUser: User; pendingUsers: PendingUser[]; pendingGallery: PendingGallery[]; allUsers: RoleUser[]; onApproveUser: (email: string) => Promise<void>; onRejectUser: (email: string) => Promise<void>; onApproveGallery: (id: string) => Promise<void>; onRejectGallery: (id: string) => Promise<void>; onUpdateRole: (userId: string, newRole: string) => Promise<void> }) {
  const [selectedRoleUser, setSelectedRoleUser] = useState<string | null>(null)
  const [selectedNewRole, setSelectedNewRole] = useState<string>("member")

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Approval Panel</h2>
          <p className="text-gray-600">Approve members and gallery posts here. Use the full admin dashboard for content management and donation stats.</p>
        </div>
        <Button asChild variant="outline"><Link href="/admin">Open Full Admin Dashboard</Link></Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><Users className="h-8 w-8 text-blue-600" /><div><p className="text-xs font-medium text-gray-600">Approved Users</p><p className="text-2xl font-bold text-gray-900">{allUsers.length}</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><UserX className="h-8 w-8 text-orange-600" /><div><p className="text-xs font-medium text-gray-600">Pending Users</p><p className="text-2xl font-bold text-gray-900">{pendingUsers.length}</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><ImageIcon className="h-8 w-8 text-purple-600" /><div><p className="text-xs font-medium text-gray-600">Pending Gallery</p><p className="text-2xl font-bold text-gray-900">{pendingGallery.length}</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><UserCheck className="h-8 w-8 text-green-600" /><div><p className="text-xs font-medium text-gray-600">Your Role</p><p className="text-lg font-bold text-gray-900 capitalize">{currentUser.role.replace("_", " ")}</p></div></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle>Pending User Approvals</CardTitle><CardDescription>Approve new member accounts.</CardDescription></CardHeader><CardContent className="space-y-4">{pendingUsers.length === 0 ? <p className="text-gray-600">No pending users.</p> : pendingUsers.map((pendingUser) => <div key={pendingUser.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg"><div className="flex items-center gap-4"><Avatar><AvatarImage src={pendingUser.photo || "/placeholder.svg"} alt={pendingUser.name} /><AvatarFallback>{pendingUser.name?.charAt(0) || "U"}</AvatarFallback></Avatar><div><p className="font-medium">{pendingUser.name}</p><p className="text-sm text-gray-600">{pendingUser.email}</p><p className="text-xs text-gray-500">{pendingUser.department || "Department not set"} • {pendingUser.series || "Batch not set"}</p></div></div><div className="flex gap-2"><Button size="sm" onClick={() => onApproveUser(pendingUser.email)} className="bg-green-600 hover:bg-green-700"><CheckCircle className="w-4 h-4 mr-1" />Approve</Button><Button size="sm" variant="destructive" onClick={() => onRejectUser(pendingUser.email)}><XCircle className="w-4 h-4 mr-1" />Reject</Button></div></div>)}</CardContent></Card>
      <Card><CardHeader><CardTitle>Pending Gallery Items</CardTitle><CardDescription>Approve uploaded photos before they appear publicly.</CardDescription></CardHeader><CardContent className="space-y-4">{pendingGallery.length === 0 ? <p className="text-gray-600">No pending gallery items.</p> : pendingGallery.map((item) => <div key={item.id} className="flex flex-col lg:flex-row gap-4 p-4 border rounded-lg"><img src={item.url || "/placeholder.svg"} alt={item.title} className="w-full lg:w-56 h-40 object-cover rounded-md border" /><div className="flex-1 space-y-2"><p className="font-medium">{item.title}</p><p className="text-sm text-gray-600">{item.description || "No description added."}</p><p className="text-xs text-gray-500">Uploaded by: {item.uploadedBy || "Unknown member"}</p><div className="flex gap-2"><Button size="sm" onClick={() => onApproveGallery(item.id)} className="bg-green-600 hover:bg-green-700"><CheckCircle className="w-4 h-4 mr-1" />Approve</Button><Button size="sm" variant="destructive" onClick={() => onRejectGallery(item.id)}><XCircle className="w-4 h-4 mr-1" />Reject</Button></div></div></div>)}</CardContent></Card>
      {currentUser.role === "super_admin" && <Card><CardHeader><CardTitle>Super Admin Tools</CardTitle><CardDescription>Role assignment and committee management are now on dedicated pages for better performance.</CardDescription></CardHeader><CardContent className="flex gap-3 flex-wrap"><Button asChild variant="outline"><Link href="/admin/roles">Open User Roles</Link></Button><Button asChild variant="outline"><Link href="/admin/committee">Open Committee Assignment</Link></Button></CardContent></Card>}
    </div>
  )
}

export default function ProfilePage() {
  const { user, isLoading, updateUser } = useAuth() as { user: User | null; isLoading: boolean; updateUser: (userData: Partial<User>) => void }
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [redirected, setRedirected] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [defaultTab, setDefaultTab] = useState("profile")
  const [profileData, setProfileData] = useState({ name: "", email: "", department: "", series: "", photo: "", contact: "", bloodGroup: "", bio: "" })
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([])
  const [pendingGallery, setPendingGallery] = useState<PendingGallery[]>([])
  const [allUsers, setAllUsers] = useState<RoleUser[]>([])

  useEffect(() => { if (searchParams.get("tab") === "admin") setDefaultTab("admin") }, [searchParams])

  useEffect(() => {
    if (isLoading) return
    if (!user) { setRedirected(true); router.push("/login"); return }
    setProfileData({ name: user.name || "", email: user.email || "", department: user.department || "", series: user.series || "", photo: user.photo || "", contact: user.contact || "", bloodGroup: user.bloodGroup || "", bio: user.bio || "" })
    if (user.role === "admin" || user.role === "super_admin") void loadAdminData(user)
  }, [user, isLoading, router])

  const loadAdminData = async (currentUser: User) => {
    try {
      const [pendingUsersRes, pendingGalleryRes, allUsersRes] = await Promise.all([
        fetch("/api/admin/pending-users", { headers: { "x-user-role": currentUser.role } }),
        fetch("/api/admin/pending-gallery", { headers: { "x-user-role": currentUser.role } }),
        currentUser.role === "super_admin" ? fetch("/api/admin/all-users", { headers: { "x-user-role": currentUser.role } }) : Promise.resolve(null),
      ])
      const pendingUsersData = pendingUsersRes ? await pendingUsersRes.json() : []
      const pendingGalleryData = pendingGalleryRes ? await pendingGalleryRes.json() : []
      const allUsersData = allUsersRes ? await allUsersRes.json() : []
      setPendingUsers(Array.isArray(pendingUsersData) ? pendingUsersData : [])
      setPendingGallery(Array.isArray(pendingGalleryData) ? pendingGalleryData : [])
      setAllUsers(Array.isArray(allUsersData) ? allUsersData : [])
    } catch (error) {
      console.error("[v0] Failed to load admin data:", error)
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingPhoto(true)
    try {
      const photoUrl = await uploadToCloudinary(file, "temple/profile", "image")
      setProfileData((current) => ({ ...current, photo: photoUrl }))
      toast({ title: "Photo uploaded", description: "Save changes to update your profile picture." })
    } catch {
      toast({ title: "Photo upload failed", description: "Please try again.", variant: "destructive" })
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleSave = async () => {
    try {
      const res = await fetch("/api/profile/update", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user?.id, ...profileData }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save profile")
      if (data.data) updateUser(data.data)
      setIsEditing(false)
      toast({ title: "Profile updated", description: "Your profile has been successfully updated." })
    } catch (error) {
      toast({ title: "Profile update failed", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" })
    }
  }

  const handleCancel = () => { setProfileData({ name: user?.name || "", email: user?.email || "", department: user?.department || "", series: user?.series || "", photo: user?.photo || "", contact: user?.contact || "", bloodGroup: user?.bloodGroup || "", bio: user?.bio || "" }); setIsEditing(false) }
  const approveUser = async (email: string) => { const res = await fetch("/api/admin/approve-user", { method: "POST", headers: { "Content-Type": "application/json", "x-user-role": user?.role ?? "" }, body: JSON.stringify({ targetEmail: email }) }); if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Failed to approve user") } setPendingUsers((current) => current.filter((pendingUser) => pendingUser.email !== email)); if (user) void loadAdminData(user); toast({ title: "User approved" }) }
  const rejectUser = async (email: string) => { const res = await fetch("/api/admin/reject-user", { method: "POST", headers: { "Content-Type": "application/json", "x-user-role": user?.role ?? "" }, body: JSON.stringify({ targetEmail: email }) }); if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Failed to reject user") } setPendingUsers((current) => current.filter((pendingUser) => pendingUser.email !== email)); toast({ title: "User rejected" }) }
  const approveGallery = async (id: string) => { const res = await fetch("/api/admin/approve-gallery", { method: "POST", headers: { "Content-Type": "application/json", "x-user-role": user?.role ?? "" }, body: JSON.stringify({ id }) }); if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Failed to approve gallery item") } setPendingGallery((current) => current.filter((item) => item.id !== id)); toast({ title: "Gallery item approved" }) }
  const rejectGallery = async (id: string) => { const res = await fetch("/api/admin/reject-gallery", { method: "POST", headers: { "Content-Type": "application/json", "x-user-role": user?.role ?? "" }, body: JSON.stringify({ id }) }); if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Failed to reject gallery item") } setPendingGallery((current) => current.filter((item) => item.id !== id)); toast({ title: "Gallery item rejected" }) }
  const updateRole = async (userId: string, newRole: string) => { const res = await fetch("/api/admin/update-user-role", { method: "POST", headers: { "Content-Type": "application/json", "x-user-role": user?.role ?? "" }, body: JSON.stringify({ userId, newRole }) }); const data = await res.json(); if (!res.ok) throw new Error(data.error || "Failed to update role"); setAllUsers((current) => current.map((item) => (item.id === userId ? { ...item, role: newRole } : item))); toast({ title: "User role updated" }) }

  if (isLoading || (!user && !redirected)) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" /><p className="mt-4 text-gray-600">Loading profile...</p></div></div>
  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<Loading />}>
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full mb-8" style={{ gridTemplateColumns: user.role === "member" ? "1fr" : "1fr 1fr" }}>
              <TabsTrigger value="profile">My Profile</TabsTrigger>
              {(user.role === "admin" || user.role === "super_admin") && <TabsTrigger value="admin">Approval Panel</TabsTrigger>}
            </TabsList>
            <TabsContent value="profile">
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="relative h-32 bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg"><div className="absolute -bottom-16 left-6"><div className="relative"><Avatar className="w-32 h-32 border-4 border-white shadow-lg"><AvatarImage src={profileData.photo || "/placeholder.svg"} alt={user.name} /><AvatarFallback className="text-2xl font-semibold bg-primary text-white">{user.name.split(" ").map((namePart) => namePart[0]).join("").toUpperCase()}</AvatarFallback></Avatar><input type="file" id="photo-upload" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploadingPhoto} /><Button size="sm" className="absolute bottom-2 right-2 rounded-full w-8 h-8 p-0" onClick={() => document.getElementById("photo-upload")?.click()} disabled={uploadingPhoto}><Camera className="w-4 h-4" /></Button></div></div></div>
                <div className="pt-20 px-6 pb-6 space-y-6">
                  <div className="flex justify-between items-start gap-4"><div><h1 className="text-3xl font-bold text-gray-900">{profileData.name}</h1><div className="flex gap-2 mt-2 flex-wrap"><Badge className="capitalize">{user.role}</Badge><Badge variant="outline">{profileData.department || "Department not set"}</Badge><Badge variant="outline">{profileData.series || "Batch not set"}</Badge></div></div><div className="flex gap-2">{!isEditing && <Button onClick={() => setIsEditing(true)} variant="outline"><Edit className="w-4 h-4 mr-2" />Edit Profile</Button>}{(user.role === "admin" || user.role === "super_admin") && <Button asChild><Link href="/admin">Admin Dashboard</Link></Button>}</div></div>
                  {isEditing ? <div className="space-y-6"><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><Label htmlFor="name">Full Name</Label><Input id="name" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} className="mt-1" /></div><div><Label htmlFor="email">Email</Label><Input id="email" value={profileData.email} disabled className="mt-1 bg-gray-100" /></div><div><Label htmlFor="department">Department</Label><Input id="department" value={profileData.department} onChange={(e) => setProfileData({ ...profileData, department: e.target.value })} className="mt-1" /></div><div><Label htmlFor="series">Series/Batch</Label><Input id="series" value={profileData.series} onChange={(e) => setProfileData({ ...profileData, series: e.target.value })} className="mt-1" /></div><div><Label htmlFor="contact">Contact</Label><Input id="contact" value={profileData.contact} onChange={(e) => setProfileData({ ...profileData, contact: e.target.value })} className="mt-1" /></div><div><Label htmlFor="bloodGroup">Blood Group</Label><Input id="bloodGroup" value={profileData.bloodGroup} onChange={(e) => setProfileData({ ...profileData, bloodGroup: e.target.value })} className="mt-1" /></div></div><div><Label htmlFor="bio">Bio</Label><textarea id="bio" value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} className="w-full mt-1 p-3 border border-gray-300 rounded-md" rows={4} /></div><div className="flex gap-2"><Button onClick={handleSave}><Save className="w-4 h-4 mr-2" />Save Changes</Button><Button onClick={handleCancel} variant="outline"><X className="w-4 h-4 mr-2" />Cancel</Button></div></div> : <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Bio</CardTitle></CardHeader><CardContent><p className="text-gray-900">{profileData.bio || "Not specified"}</p></CardContent></Card><Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Email</CardTitle></CardHeader><CardContent><p className="text-gray-900">{profileData.email}</p></CardContent></Card><Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Department</CardTitle></CardHeader><CardContent><p className="text-gray-900">{profileData.department || "Not specified"}</p></CardContent></Card><Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Series/Batch</CardTitle></CardHeader><CardContent><p className="text-gray-900">{profileData.series || "Not specified"}</p></CardContent></Card><Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Blood Group</CardTitle></CardHeader><CardContent><p className="text-gray-900">{profileData.bloodGroup || "Not specified"}</p></CardContent></Card><Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Contact</CardTitle></CardHeader><CardContent><p className="text-gray-900">{profileData.contact || "Not specified"}</p></CardContent></Card></div>}
                </div>
              </div>
            </TabsContent>
            {(user.role === "admin" || user.role === "super_admin") && <TabsContent value="admin"><AdminPanel currentUser={user} pendingUsers={pendingUsers} pendingGallery={pendingGallery} allUsers={allUsers} onApproveUser={approveUser} onRejectUser={rejectUser} onApproveGallery={approveGallery} onRejectGallery={rejectGallery} onUpdateRole={updateRole} /></TabsContent>}
          </Tabs>
        </Suspense>
      </div>
    </div>
  )
}

