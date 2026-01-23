"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Upload, Search, Play, ImageIcon, Calendar, User } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"

async function uploadToCloudinary(file: File, type: "image" | "video") {
  const res = await fetch("/api/cloudinary/sign")
  const { signature, timestamp, cloudName, apiKey } = await res.json()

  const formData = new FormData()
  formData.append("file", file)
  formData.append("api_key", apiKey)
  formData.append("timestamp", timestamp)
  formData.append("signature", signature)

  const endpoint =
    type === "video"
      ? "video/upload"
      : "image/upload"

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${endpoint}`,
    { method: "POST", body: formData }
  )

  const data = await uploadRes.json()
  return data.secure_url
}

interface GalleryItem {
  id: string
  title: string
  type: "image" | "video"
  url: string
  thumbnail?: string
  uploadedBy: string
  uploadedAt: string
  approved: boolean
  description?: string
  tags: string[]
}

export default function GalleryPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [items, setItems] = useState<GalleryItem[]>([])
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "video">("all")
  const [sortBy, setSortBy] = useState<"date" | "user" | "title">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadData, setUploadData] = useState({
    file: null as File | null,
    title: "",
    description: "",
    tags: "",
    type: "image" as "image" | "video",
  })
  const [uploading, setUploading] = useState(false)

  const handleGalleryUpload = async () => {
    if (!uploadData.file || !uploadData.title) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    try {
      const url = await uploadToCloudinary(uploadData.file, uploadData.type)

      const res = await fetch("/api/gallery/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: uploadData.title,
          type: uploadData.type,
          url,
          thumbnail: uploadData.type === "video" ? url : undefined,
          uploadedBy: user?.email,
          description: uploadData.description,
          tags: uploadData.tags ? uploadData.tags.split(",").map(t => t.trim()) : [],
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Upload failed")
      }

      toast({
        title: "Upload submitted",
        description: "Your content is pending admin approval.",
      })

      setUploadOpen(false)
      setUploadData({ file: null, title: "", description: "", tags: "", type: "image" })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  // Fetch gallery items from Supabase
  useEffect(() => {
    setLoading(true)
    fetch("/api/gallery/list")
      .then(res => res.json())
      .then((data) => {
        // Transform data to match GalleryItem interface
        const items = Array.isArray(data) ? data : (data.gallery || []);
        
        setItems(items.map((item: any) => ({
          id: item.id,
          title: item.title,
          type: item.type,
          url: item.url,
          thumbnail: item.thumbnail,
          // Use the mapped names from your API transformation
          uploadedBy: item.uploadedBy || "Unknown", 
          uploadedAt: item.uploadedAt,
          approved: true, // They are already filtered by the API
          description: item.description,
          tags: item.tags || [],
        })))
      })
      .catch(error => console.error("[v0] Gallery fetch error:", error))
      .finally(() => setLoading(false))
  }, [])

  // Filter and sort items
  useEffect(() => {
    const filtered = items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = typeFilter === "all" || item.type === typeFilter
      return matchesSearch && matchesType && item.approved
    })

    // Sort items
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "date":
          comparison = new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
          break
        case "user":
          comparison = a.uploadedBy.localeCompare(b.uploadedBy)
          break
        case "title":
          comparison = a.title.localeCompare(b.title)
          break
      }
      return sortOrder === "desc" ? -comparison : comparison
    })

    setFilteredItems(filtered)
  }, [items, searchTerm, typeFilter, sortBy, sortOrder])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-orange-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-orange-100 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-800 mb-4">Temple Gallery</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our collection of sacred moments, teachings, and community celebrations
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search gallery..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={typeFilter} onValueChange={(value: "all" | "image" | "video") => setTypeFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: "date" | "user" | "title") => setSortBy(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="user">Uploader</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest First</SelectItem>
                <SelectItem value="asc">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {user && (
            <div className="flex justify-end">
              <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Content
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Upload to Gallery</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Type</label>
                      <Select value={uploadData.type} onValueChange={(value) => setUploadData({ ...uploadData, type: value as "image" | "video" })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">File *</label>
                      <Input
                        type="file"
                        accept={uploadData.type === "video" ? "video/*" : "image/*"}
                        onChange={(e) => setUploadData({ ...uploadData, file: e.target.files?.[0] || null })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Title *</label>
                      <Input
                        value={uploadData.title}
                        onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                        placeholder="Enter title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <Input
                        value={uploadData.description}
                        onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                        placeholder="Enter description"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                      <Input
                        value={uploadData.tags}
                        onChange={(e) => setUploadData({ ...uploadData, tags: e.target.value })}
                        placeholder="e.g. festival, ceremony, event"
                      />
                    </div>
                    <Button onClick={handleGalleryUpload} disabled={uploading} className="w-full bg-orange-500 hover:bg-orange-600">
                      {uploading ? "Uploading..." : "Submit for Approval"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Dialog key={item.id}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-300 group">
                  <CardContent className="p-0">
                    <div className="relative aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={item.type === "video" ? item.thumbnail : item.url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {item.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge variant={item.type === "video" ? "default" : "secondary"}>
                          {item.type === "video" ? (
                            <Play className="w-3 h-3 mr-1" />
                          ) : (
                            <ImageIcon className="w-3 h-3 mr-1" />
                          )}
                          {item.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <User className="w-4 h-4 mr-1" />
                        <span className="mr-4">{item.uploadedBy}</span>
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-serif">{item.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="aspect-video overflow-hidden rounded-lg">
                    {item.type === "video" ? (
                      <video controls className="w-full h-full object-cover">
                        <source src={item.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        src={item.url || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="w-4 h-4 mr-1" />
                      <span className="mr-4">Uploaded by {item.uploadedBy}</span>
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700">{item.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No content found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
