"use client"

import { useEffect, useState } from "react"
import { Edit, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { uploadToCloudinary } from "@/lib/cloudinaryUpload"

type AdminActivity = {
  id: string
  name: string
  description: string
  image_url: string
  schedule: string
  duration: string
  level: string
  active: boolean
}

const emptyForm = {
  id: "",
  name: "",
  description: "",
  image_url: "",
  schedule: "",
  duration: "",
  level: "beginner",
  active: true,
}

export default function AdminActivitiesPage() {
  const { toast } = useToast()
  const [activities, setActivities] = useState<AdminActivity[]>([])
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [formData, setFormData] = useState(emptyForm)

  useEffect(() => {
    void fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/activities/list")
      const data = await res.json()
      setActivities(Array.isArray(data.activities) ? data.activities : [])
    } catch (error) {
      console.error("[v0] Fetch activities error:", error)
      toast({ title: "Error", description: "Failed to fetch activities", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (file?: File | null) => {
    if (!file) return
    setUploadingImage(true)
    try {
      const imageUrl = await uploadToCloudinary(file, "temple/activities", "image")
      setFormData((current) => ({ ...current, image_url: imageUrl }))
    } catch (error) {
      console.error("[v0] Activity image upload error:", error)
      toast({ title: "Error", description: "Failed to upload activity image", variant: "destructive" })
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.description) {
      toast({ title: "Error", description: "Please fill in the required fields", variant: "destructive" })
      return
    }

    const method = formData.id ? "PATCH" : "POST"
    const url = formData.id ? `/api/activities/${formData.id}` : "/api/activities/create"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to save activity")
      }

      toast({ title: formData.id ? "Activity updated" : "Activity created" })
      setFormData(emptyForm)
      setOpenDialog(false)
      await fetchActivities()
    } catch (error) {
      console.error("[v0] Save activity error:", error)
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to save activity", variant: "destructive" })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/activities/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete activity")
      }
      toast({ title: "Activity deleted" })
      await fetchActivities()
    } catch (error) {
      console.error("[v0] Delete activity error:", error)
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to delete activity", variant: "destructive" })
    }
  }

  const startEdit = (activity: AdminActivity) => {
    setFormData(activity)
    setOpenDialog(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Activities</h1>
          <Dialog open={openDialog} onOpenChange={(open) => {
            setOpenDialog(open)
            if (!open) setFormData(emptyForm)
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => setFormData(emptyForm)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Activity
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{formData.id ? "Edit Activity" : "Create New Activity"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name *</label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium">Description *</label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Activity Image</label>
                  <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files?.[0] || null)} disabled={uploadingImage} />
                  <Input value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="Or paste an image URL" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Schedule</label>
                    <Input value={formData.schedule} onChange={(e) => setFormData({ ...formData, schedule: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Duration</label>
                    <Input value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Level</label>
                  <select className="w-full border rounded px-3 py-2" value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <Button onClick={handleSubmit} className="w-full" disabled={uploadingImage}>
                  {formData.id ? "Update Activity" : "Create Activity"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading activities...</div>
        ) : activities.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12 text-gray-600">No activities yet. Create your first activity.</CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {activities.map((activity) => (
              <Card key={activity.id}>
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <CardTitle>{activity.name}</CardTitle>
                      <div className="flex gap-3 mt-2 text-sm text-gray-600 flex-wrap">
                        <span>{activity.schedule || "Schedule pending"}</span>
                        <span>{activity.duration || "Duration pending"}</span>
                        <span className="capitalize">{activity.level}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => startEdit(activity)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(activity.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activity.image_url && <img src={activity.image_url} alt={activity.name} className="w-full h-56 object-cover rounded-md border" />}
                  <p className="text-gray-600">{activity.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
