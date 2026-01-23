"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { Trash2, Edit } from "lucide-react"

interface AdminActivity {
  id: string
  name: string
  description: string
  image: string // Database uses 'image' not 'image_url'
  image_url?: string // Optional for transformation
  schedule: string
  duration: string
  level: string
  active: boolean
  created_at: string
}

export default function AdminActivitiesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [activities, setActivities] = useState<AdminActivity[]>([])
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
    schedule: "",
    duration: "",
    level: "beginner",
  })

  // Fetch activities
  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/activities/list")
      const data = await res.json()
      if (data.activities) {
        setActivities(data.activities)
      }
    } catch (error) {
      console.error("[v0] Fetch activities error:", error)
      toast({
        title: "Error",
        description: "Failed to fetch activities",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateActivity = async () => {
    if (!formData.name || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive",
      })
      return
    }

    try {
      const res = await fetch("/api/activities/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (data.status === "OK") {
        toast({
          title: "Success",
          description: "Activity created successfully",
        })
        setFormData({
          name: "",
          description: "",
          image_url: "",
          schedule: "",
          duration: "",
          level: "beginner",
        })
        setOpenDialog(false)
        fetchActivities()
      }
    } catch (error) {
      console.error("[v0] Create activity error:", error)
      toast({
        title: "Error",
        description: "Failed to create activity",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Activities</h1>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button>+ Create Activity</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Activity</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name *</label>
                  <Input
                    placeholder="Activity name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description *</label>
                  <Textarea
                    placeholder="Activity description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Image URL</label>
                  <Input
                    placeholder="https://..."
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Schedule</label>
                    <Input
                      placeholder="e.g., Mon & Wed, 6 PM"
                      value={formData.schedule}
                      onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Duration</label>
                    <Input
                      placeholder="e.g., 1 hour"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Level</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  >
                    <option>beginner</option>
                    <option>intermediate</option>
                    <option>advanced</option>
                  </select>
                </div>
                <Button onClick={handleCreateActivity} className="w-full">
                  Create Activity
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading activities...</div>
        ) : activities.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              {/* Activity icon is removed to avoid redeclaration */}
              <p className="text-gray-600">No activities yet. Create your first activity!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {activities.map((activity) => (
              <Card key={activity.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{activity.name}</CardTitle>
                      <div className="flex gap-4 mt-2 text-sm text-gray-600">
                        <span>{activity.schedule}</span>
                        <span>{activity.duration}</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{activity.level}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
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
