"use client"

import { useEffect, useState, useMemo } from "react"
import { Edit, Plus, Trash2, Clock, Sparkles, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("all")

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

      toast({ title: formData.id ? "Activity updated successfully" : "Activity created successfully" })
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

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const matchesSearch = activity.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            activity.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesLevel = selectedLevel === "all" || activity.level.toLowerCase() === selectedLevel.toLowerCase()
      return matchesSearch && matchesLevel
    })
  }, [activities, searchQuery, selectedLevel])

  return (
    <div className="min-h-screen bg-gray-50/70 p-6 sm:p-10">
      <div className="max-w-[90rem] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold font-serif text-gray-900">Manage Activities</h1>
            <p className="text-gray-600 mt-1 text-sm">Add or edit temple programs and activities displayed to visitors ({activities.length} total).</p>
          </div>
          <Dialog open={openDialog} onOpenChange={(open) => {
            setOpenDialog(open)
            if (!open) setFormData(emptyForm)
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => setFormData(emptyForm)} className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-5 shadow-sm">
                <Plus className="w-4 h-4 mr-2" />
                Create Activity
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl font-bold text-gray-900">
                  {formData.id ? "Edit Activity" : "Create New Activity"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-5 pt-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-800">Name *</label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter activity name" className="rounded-xl border-gray-200" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-800">Description *</label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Write activity details..." className="rounded-xl border-gray-200 min-h-[100px]" />
                </div>
                
                {/* Image Upload with Size Guide */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-gray-800">Activity Image</label>
                    <span className="text-xs text-gray-500">Recommended: 1200 × 750px (Landscape)</span>
                  </div>
                  <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files?.[0] || null)} disabled={uploadingImage} className="rounded-xl border-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
                  <Input value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="Or paste an image URL here" className="rounded-xl border-gray-200 mt-2" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-800">Schedule</label>
                    <Input value={formData.schedule} onChange={(e) => setFormData({ ...formData, schedule: e.target.value })} placeholder="e.g. Every Saturday, 6:00 PM" className="rounded-xl border-gray-200" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-800">Duration</label>
                    <Input value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g. 1.5 Hours" className="rounded-xl border-gray-200" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-800">Level</label>
                  <select 
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    value={formData.level} 
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <Button onClick={handleSubmit} className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full py-6 font-medium shadow-md mt-2" disabled={uploadingImage}>
                  {formData.id ? "Update Activity" : "Create Activity"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search activities..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl border-gray-200 bg-gray-50/50"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {["all", "beginner", "intermediate", "advanced"].map((lvl) => (
              <Button
                key={lvl}
                variant={selectedLevel === lvl ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLevel(lvl)}
                className={`rounded-full text-xs font-medium px-4 capitalize ${selectedLevel === lvl ? "bg-orange-500 hover:bg-orange-600 text-white" : "border-gray-200 text-gray-700 hover:bg-orange-50"}`}
              >
                {lvl}
              </Button>
            ))}
          </div>
        </div>

        {/* Activities Grid */}
        {loading ? (
          <div className="text-center py-16 text-gray-500 font-medium bg-white rounded-2xl border border-gray-100 shadow-sm">Loading activities...</div>
        ) : filteredActivities.length === 0 ? (
          <Card className="rounded-2xl border-gray-100 shadow-sm bg-white">
            <CardContent className="text-center py-16">
              <Sparkles className="w-14 h-14 mx-auto text-orange-400 mb-4 stroke-[1.5]" />
              <p className="text-gray-800 font-semibold text-lg">No matching activities found.</p>
              <p className="text-gray-500 text-sm mt-1">Try searching with a different keyword or level filter.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredActivities.map((activity) => (
              <Card key={activity.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 rounded-2xl border-gray-100 bg-white flex flex-col justify-between">
                <div>
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
                    <img
                      src={activity.image_url || "/placeholder.svg"}
                      alt={activity.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-white/90 text-gray-900 backdrop-blur-sm font-medium capitalize">
                        {activity.level}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                      <h3 className="font-serif text-xl font-bold tracking-tight">{activity.name}</h3>
                      {activity.schedule && (
                        <p className="text-xs text-orange-200 flex items-center gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>{activity.schedule}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-600 text-sm leading-relaxed font-light line-clamp-3">{activity.description}</p>
                  </div>
                </div>
                
                {/* Admin Action Bar */}
                <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-100 mt-2 bg-gray-50/50">
                  <span className="text-xs text-gray-500 font-medium">Duration: {activity.duration || "N/A"}</span>
                  <div className="flex gap-2 pt-3">
                    <Button variant="outline" size="sm" onClick={() => startEdit(activity)} className="rounded-xl border-gray-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(activity.id)} className="rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 shadow-none">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}