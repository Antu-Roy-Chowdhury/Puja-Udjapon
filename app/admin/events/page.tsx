"use client"

import { useEffect, useState } from "react"
import { Calendar, Edit, Plus, Trash2, MapPin, Clock, Image as ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { uploadToCloudinary } from "@/lib/cloudinaryUpload"

type EventItem = {
  id: string
  title: string
  description: string
  start_time: string
  end_time: string
  location: string
  image_url: string
  time: string
  source: "manual" | "google"
  editable: boolean
  google_event_id?: string | null
}

const emptyForm = {
  id: "",
  title: "",
  description: "",
  start_date: "",
  end_date: "",
  location: "",
  image_url: "",
}

export default function AdminEventsPage() {
  const { toast } = useToast()
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [formData, setFormData] = useState(emptyForm)

  useEffect(() => {
    void fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/events/list")
      const data = await res.json()
      setEvents(Array.isArray(data.events) ? data.events : [])
    } catch (error) {
      console.error("[v0] Fetch events error:", error)
      toast({ title: "Error", description: "Failed to fetch events", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (file?: File | null) => {
    if (!file) return
    setUploadingImage(true)
    try {
      const imageUrl = await uploadToCloudinary(file, "temple/events", "image")
      setFormData((current) => ({ ...current, image_url: imageUrl }))
    } catch (error) {
      console.error("[v0] Event image upload error:", error)
      toast({ title: "Error", description: "Failed to upload event image", variant: "destructive" })
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.start_date || !formData.end_date) {
      toast({ title: "Error", description: "Please fill in the required fields", variant: "destructive" })
      return
    }

    const method = formData.id ? "PATCH" : "POST"
    const url = formData.id ? `/api/events/${formData.id}` : "/api/events/create"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to save event")
      }
      toast({ title: formData.id ? "Event updated successfully" : "Event created successfully" })
      setFormData(emptyForm)
      setOpenDialog(false)
      await fetchEvents()
    } catch (error) {
      console.error("[v0] Save event error:", error)
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to save event", variant: "destructive" })
    }
  }

  const handleDelete = async (event: EventItem) => {
    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: event.source, google_event_id: event.google_event_id }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete event")
      }
      toast({ title: event.source === "google" ? "Calendar event hidden" : "Event deleted" })
      await fetchEvents()
    } catch (error) {
      console.error("[v0] Delete event error:", error)
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to delete event", variant: "destructive" })
    }
  }

  const startEdit = (event: EventItem) => {
    if (!event.editable) return
    setFormData({
      id: event.id,
      title: event.title,
      description: event.description,
      start_date: event.start_time ? new Date(event.start_time).toISOString().slice(0, 16) : "",
      end_date: event.end_time ? new Date(event.end_time).toISOString().slice(0, 16) : "",
      location: event.location,
      image_url: event.image_url,
    })
    setOpenDialog(true)
  }

  return (
    <div className="min-h-screen bg-gray-50/70 p-6 sm:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold font-serif text-gray-900">Manage Events</h1>
            <p className="text-gray-600 mt-1 text-sm">Google Calendar events sync automatically. Admin-created events stay fully editable here.</p>
          </div>
          <Dialog open={openDialog} onOpenChange={(open) => {
            setOpenDialog(open)
            if (!open) setFormData(emptyForm)
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => setFormData(emptyForm)} className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-5 shadow-sm">
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl rounded-2xl p-6 sm:p-8">
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl font-bold text-gray-900">
                  {formData.id ? "Edit Event" : "Create New Event"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-5 pt-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-800">Title *</label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter event title" className="rounded-xl border-gray-200" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-800">Description</label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Write event details..." className="rounded-xl border-gray-200 min-h-[100px]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800">Event Image</label>
                  <span className="text-xs text-gray-500"> Recommended: 1200 × 630px (Landscape)</span>
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files?.[0] || null)} disabled={uploadingImage} className="rounded-xl border-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
                  </div>
                  <Input value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="Or paste an image URL here" className="rounded-xl border-gray-200 mt-2" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-800">Start Date & Time *</label>
                    <Input type="datetime-local" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} className="rounded-xl border-gray-200" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-800">End Date & Time *</label>
                    <Input type="datetime-local" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} className="rounded-xl border-gray-200" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-800">Location</label>
                  <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Enter event venue or location" className="rounded-xl border-gray-200" />
                </div>
                <Button onClick={handleSubmit} className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full py-6 font-medium shadow-md mt-2" disabled={uploadingImage}>
                  {formData.id ? "Update Event" : "Create Event"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Events Content List */}
        {loading ? (
          <div className="text-center py-16 text-gray-500 font-medium bg-white rounded-2xl border border-gray-100 shadow-sm">Loading events...</div>
        ) : events.length === 0 ? (
          <Card className="rounded-2xl border-gray-100 shadow-sm bg-white">
            <CardContent className="text-center py-16">
              <Calendar className="w-14 h-14 mx-auto text-orange-400 mb-4 stroke-[1.5]" />
              <p className="text-gray-800 font-semibold text-lg">No events available.</p>
              <p className="text-gray-500 text-sm mt-1">Create a new event or sync with calendar to see them here.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {events.map((event) => (
              <Card key={event.id} className="rounded-2xl border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="font-serif text-xl font-bold text-gray-900">{event.title}</CardTitle>
                        <Badge variant="outline" className={event.source === "google" ? "bg-blue-50 text-blue-700 border-blue-200 font-medium" : "bg-orange-50 text-orange-700 border-orange-200 font-medium"}>
                          {event.source === "google" ? "Google Calendar" : "Admin Event"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-700 flex-wrap pt-1 font-medium">
                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                          <Calendar className="w-4 h-4 text-orange-500" />
                          <span>{event.start_time ? new Date(event.start_time).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Date pending"}</span>
                        </div>
                        {event.time && (
                          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                            <Clock className="w-4 h-4 text-orange-500" />
                            <span>{event.time}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                          <MapPin className="w-4 h-4 text-orange-500" />
                          <span>{event.location || "Location pending"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 self-start">
                      {event.editable && (
                        <Button variant="outline" size="sm" onClick={() => startEdit(event)} className="rounded-xl border-gray-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200">
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(event)} className="rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 shadow-none">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  {event.image_url && (
                    <div className="relative w-full h-64 rounded-xl overflow-hidden border border-gray-100">
                      <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <p className="text-gray-700 text-base leading-relaxed font-light">{event.description || "No description added yet."}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}