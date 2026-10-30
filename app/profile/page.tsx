"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Camera, Edit, Save, X } from "lucide-react"

import { useAuth, type User } from "@/components/auth-provider"
import { uploadToCloudinary } from "@/lib/cloudinaryUpload"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"


export default function ProfilePage() {
  const { user, isLoading, updateUser } = useAuth() as { user: User | null; isLoading: boolean; updateUser: (userData: Partial<User>) => void }
  const router = useRouter()
  const { toast } = useToast()
  const [redirected, setRedirected] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [profileData, setProfileData] = useState({ name: "", email: "", department: "", series: "", photo: "", contact: "", bloodGroup: "", bio: "" })


  useEffect(() => {
    if (isLoading) return
    if (new URLSearchParams(window.location.search).get("tab") === "admin" && user && (user.role === "admin" || user.role === "super_admin")) { router.replace("/admin/approvals"); return }
    if (!user) { setRedirected(true); router.push("/login"); return }
    setProfileData({ name: user.name || "", email: user.email || "", department: user.department || "", series: user.series || "", photo: user.photo || "", contact: user.contact || "", bloodGroup: user.bloodGroup || "", bio: user.bio || "" })
  }, [user, isLoading, router])

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
  if (isLoading || (!user && !redirected)) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" /><p className="mt-4 text-gray-600">Loading profile...</p></div></div>
  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

              <div className="bg-white rounded-lg shadow-sm border">
                <div className="relative h-32 bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg"><div className="absolute -bottom-16 left-6"><div className="relative"><Avatar className="w-32 h-32 border-4 border-white shadow-lg"><AvatarImage src={profileData.photo || "/placeholder.svg"} alt={user.name} /><AvatarFallback className="text-2xl font-semibold bg-primary text-white">{user.name.split(" ").map((namePart) => namePart[0]).join("").toUpperCase()}</AvatarFallback></Avatar><input type="file" id="photo-upload" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploadingPhoto} /><Button size="sm" className="absolute bottom-2 right-2 rounded-full w-8 h-8 p-0" onClick={() => document.getElementById("photo-upload")?.click()} disabled={uploadingPhoto}><Camera className="w-4 h-4" /></Button></div></div></div>
                <div className="pt-20 px-6 pb-6 space-y-6">
                  <div className="flex justify-between items-start gap-4"><div><h1 className="text-3xl font-bold text-gray-900">{profileData.name}</h1><div className="flex gap-2 mt-2 flex-wrap"><Badge className="capitalize">{user.role}</Badge><Badge variant="outline">{profileData.department || "Department not set"}</Badge><Badge variant="outline">{profileData.series || "Batch not set"}</Badge></div></div><div className="flex gap-2">{!isEditing && <Button onClick={() => setIsEditing(true)} variant="outline"><Edit className="w-4 h-4 mr-2" />Edit Profile</Button>}{(user.role === "admin" || user.role === "super_admin") && <Button asChild><Link href="/admin">Admin Dashboard</Link></Button>}</div></div>
                  {isEditing ? <div className="space-y-6"><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><Label htmlFor="name">Full Name</Label><Input id="name" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} className="mt-1" /></div><div><Label htmlFor="email">Email</Label><Input id="email" value={profileData.email} disabled className="mt-1 bg-gray-100" /></div><div><Label htmlFor="department">Department</Label><Input id="department" value={profileData.department} onChange={(e) => setProfileData({ ...profileData, department: e.target.value })} className="mt-1" /></div><div><Label htmlFor="series">Series/Batch</Label><Input id="series" value={profileData.series} onChange={(e) => setProfileData({ ...profileData, series: e.target.value })} className="mt-1" /></div><div><Label htmlFor="contact">Contact</Label><Input id="contact" value={profileData.contact} onChange={(e) => setProfileData({ ...profileData, contact: e.target.value })} className="mt-1" /></div><div><Label htmlFor="bloodGroup">Blood Group</Label><Input id="bloodGroup" value={profileData.bloodGroup} onChange={(e) => setProfileData({ ...profileData, bloodGroup: e.target.value })} className="mt-1" /></div></div><div><Label htmlFor="bio">Bio</Label><textarea id="bio" value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} className="w-full mt-1 p-3 border border-gray-300 rounded-md" rows={4} /></div><div className="flex gap-2"><Button onClick={handleSave}><Save className="w-4 h-4 mr-2" />Save Changes</Button><Button onClick={handleCancel} variant="outline"><X className="w-4 h-4 mr-2" />Cancel</Button></div></div> : <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Bio</CardTitle></CardHeader><CardContent><p className="text-gray-900">{profileData.bio || "Not specified"}</p></CardContent></Card><Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Email</CardTitle></CardHeader><CardContent><p className="text-gray-900">{profileData.email}</p></CardContent></Card><Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Department</CardTitle></CardHeader><CardContent><p className="text-gray-900">{profileData.department || "Not specified"}</p></CardContent></Card><Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Series/Batch</CardTitle></CardHeader><CardContent><p className="text-gray-900">{profileData.series || "Not specified"}</p></CardContent></Card><Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Blood Group</CardTitle></CardHeader><CardContent><p className="text-gray-900">{profileData.bloodGroup || "Not specified"}</p></CardContent></Card><Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Contact</CardTitle></CardHeader><CardContent><p className="text-gray-900">{profileData.contact || "Not specified"}</p></CardContent></Card></div>}
                </div>
              </div>

      </div>
    </div>
  )
}

