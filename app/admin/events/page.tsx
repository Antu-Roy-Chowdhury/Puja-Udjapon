"use client"

import { useEffect, useState } from "react"
import { Calendar, Edit, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
      toast({ title: formData.id ? "Event updated" : "Event created" })
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Manage Events</h1>
            <p className="text-gray-600 mt-2">Google Calendar events sync automatically. Admin-created events stay editable here.</p>
          </div>
          <Dialog open={openDialog} onOpenChange={(open) => {
            setOpenDialog(open)
            if (!open) setFormData(emptyForm)
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => setFormData(emptyForm)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{formData.id ? "Edit Event" : "Create New Event"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Event Image</label>
                  <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files?.[0] || null)} disabled={uploadingImage} />
                  <Input value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="Or paste an image URL" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Start Date *</label>
                    <Input type="datetime-local" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">End Date *</label>
                    <Input type="datetime-local" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                </div>
                <Button onClick={handleSubmit} className="w-full" disabled={uploadingImage}>
                  {formData.id ? "Update Event" : "Create Event"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading events...</div>
        ) : events.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No events available.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {events.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <CardTitle>{event.title}</CardTitle>
                      <div className="flex gap-3 mt-2 text-sm text-gray-600 flex-wrap">
                        <span>{new Date(event.start_time).toLocaleDateString()}</span>
                        <span>{event.time}</span>
                        <span>{event.location || "Location pending"}</span>
                        <span className="font-medium">{event.source === "google" ? "Google Calendar" : "Admin event"}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {event.editable && (
                        <Button variant="outline" size="sm" onClick={() => startEdit(event)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(event)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {event.image_url && <img src={event.image_url} alt={event.title} className="w-full h-56 object-cover rounded-md border" />}
                  <p className="text-gray-600">{event.description || "No description added yet."}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
