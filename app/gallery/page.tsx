"use client"

import { useEffect, useMemo, useState } from "react"
import { Calendar, ImageIcon, Play, Search, Upload, User } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { getEmbedUrl, getVideoThumbnail } from "@/lib/content"
import { uploadToCloudinary } from "@/lib/cloudinaryUpload"

type GalleryItem = {
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
  albumUrls: string[]
  embedUrl: string
  postKind: "gallery" | "promo-video"
}

export default function GalleryPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "video">("all")
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [selectedAlbumIndex, setSelectedAlbumIndex] = useState(0)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadData, setUploadData] = useState({
    files: [] as File[],
    title: "",
    description: "",
    tags: "",
    type: "image" as "image" | "video",
    externalVideoUrl: "",
  })

  useEffect(() => {
    setLoading(true)
    fetch("/api/gallery/list")
      .then((res) => res.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((error) => console.error("[v0] Gallery fetch error:", error))
      .finally(() => setLoading(false))
  }, [])

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = typeFilter === "all" || item.type === typeFilter
      return matchesSearch && matchesType
    })
  }, [items, searchTerm, typeFilter])

  const marqueeItems = useMemo(() => {
    const images = items.filter((item) => item.type === "image").slice(0, 8)
    return images.length > 0 ? [...images, ...images] : []
  }, [items])

  const currentAlbumImage = selectedItem?.albumUrls?.[selectedAlbumIndex] || selectedItem?.url || ""

  const openItem = (item: GalleryItem) => {
    setSelectedAlbumIndex(0)
    setSelectedItem(item)
  }

  const handleRemoveAsAdmin = async (item: GalleryItem) => {
    if (!user || (user.role !== "admin" && user.role !== "super_admin")) return

    try {
      const res = await fetch("/api/admin/reject-gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": user.role,
        },
        body: JSON.stringify({ id: item.id }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to remove gallery item")
      }

      setItems((current) => current.filter((galleryItem) => galleryItem.id !== item.id))
      setSelectedItem(null)
      toast({ title: "Gallery item removed" })
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to remove gallery item", variant: "destructive" })
    }
  }

  const handleGalleryUpload = async () => {
    const isVideo = uploadData.type === "video"
    const hasVideoSource = Boolean(uploadData.externalVideoUrl || uploadData.files[0])

    if ((!isVideo && uploadData.files.length === 0) || (isVideo && !hasVideoSource) || !uploadData.title) {
      toast({ title: "Error", description: "Please provide the required media and title", variant: "destructive" })
      return
    }

    setUploading(true)
    try {
      const tags = uploadData.tags ? uploadData.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : []

      let url = ""
      let thumbnail = ""
      let albumUrls: string[] = []
      let embedUrl = ""

      if (isVideo) {
        if (uploadData.externalVideoUrl) {
          url = uploadData.externalVideoUrl
          embedUrl = getEmbedUrl(uploadData.externalVideoUrl)
          thumbnail = getVideoThumbnail(uploadData.externalVideoUrl)
        } else {
          url = await uploadToCloudinary(uploadData.files[0], "temple/gallery", "video")
          thumbnail = url
        }
      } else {
        albumUrls = await Promise.all(uploadData.files.map((file) => uploadToCloudinary(file, "temple/gallery", "image")))
        url = albumUrls[0]
        thumbnail = albumUrls[0]
      }

      const res = await fetch("/api/gallery/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: uploadData.title,
          type: uploadData.type,
          url,
          thumbnail,
          uploadedBy: user?.email,
          description: uploadData.description,
          tags,
          albumUrls,
          embedUrl,
          postKind: "gallery",
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Upload failed")
      }

      toast({ title: "Upload submitted", description: "Your post is pending admin approval." })
      setUploadOpen(false)
      setUploadData({ files: [], title: "", description: "", tags: "", type: "image", externalVideoUrl: "" })
    } catch (error) {
      toast({ title: "Upload failed", description: error instanceof Error ? error.message : "Please try again", variant: "destructive" })
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white"><div className="container mx-auto px-4 py-8"><div className="animate-pulse"><div className="h-8 bg-orange-200 rounded w-1/4 mb-6"></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(6)].map((_, i) => <div key={i} className="h-64 bg-orange-100 rounded-lg"></div>)}</div></div></div></div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-gray-800 mb-4">পুণ্যস্মৃতি</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">আমাদের উৎসব ও প্রার্থনার নির্বাচিত স্থিরচিত্র ও ভিডিওর মাধ্যমে ভক্তির এই আনন্দলোকে বিচরণ করুন।</p>
        </div>

        {/* {marqueeItems.length > 0 && (
          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm py-4">
            <div className="gallery-marquee flex gap-4 w-max px-4">
              {marqueeItems.map((item, index) => (
                <button key={`${item.id}-${index}`} type="button" onClick={() => openItem(item)} className="relative h-44 w-72 overflow-hidden rounded-xl border shrink-0">
                  <img src={item.url} alt={item.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-left text-white text-sm font-medium">{item.title}</div>
                </button>
              ))}
            </div>
          </div>
        )} */}

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="Search gallery..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>

            <Select value={typeFilter} onValueChange={(value: "all" | "image" | "video") => setTypeFilter(value)}>
              <SelectTrigger><SelectValue placeholder="Filter by type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
              </SelectContent>
            </Select>

            {user && (
              <div className="flex justify-end">
                <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                  <DialogTrigger asChild><Button className="bg-orange-500 hover:bg-orange-600 w-full md:w-auto"><Upload className="w-4 h-4 mr-2" />Upload Content</Button></DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader><DialogTitle>Upload to Gallery</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Type</label>
                        <Select value={uploadData.type} onValueChange={(value) => setUploadData({ ...uploadData, type: value as "image" | "video", files: [], externalVideoUrl: "" })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="image">Image</SelectItem><SelectItem value="video">Video</SelectItem></SelectContent>
                        </Select>
                      </div>
                      {uploadData.type === "image" ? (
                        <div>
                          <label className="block text-sm font-medium mb-2">Photos (Photo/Video size must be under 20MB)</label>
                          <Input type="file" accept="image/*" multiple onChange={(e) => setUploadData({ ...uploadData, files: Array.from(e.target.files || []) })} />
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium mb-2">Video Link</label>
                            <Input value={uploadData.externalVideoUrl} onChange={(e) => setUploadData({ ...uploadData, externalVideoUrl: e.target.value })} placeholder="YouTube or Facebook video link" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Or upload a video file</label>
                            <Input type="file" accept="video/*" onChange={(e) => setUploadData({ ...uploadData, files: Array.from(e.target.files || []) })} />
                          </div>
                        </div>
                      )}
                      <div><label className="block text-sm font-medium mb-2">Title *</label><Input value={uploadData.title} onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })} placeholder="Enter title" /></div>
                      <div><label className="block text-sm font-medium mb-2">Description</label><Input value={uploadData.description} onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })} placeholder="Enter description" /></div>
                      <div><label className="block text-sm font-medium mb-2">Tags (comma-separated)</label><Input value={uploadData.tags} onChange={(e) => setUploadData({ ...uploadData, tags: e.target.value })} placeholder="e.g. puja, festival, celebration" /></div>
                      <Button onClick={handleGalleryUpload} disabled={uploading} className="w-full bg-orange-500 hover:bg-orange-600">{uploading ? "Uploading..." : "Submit Post for Approval"}</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <button key={item.id} type="button" onClick={() => openItem(item)} className="text-left">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-300 group overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    <img src={item.thumbnail || item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    {item.type === "video" && <div className="absolute inset-0 flex items-center justify-center bg-black/30"><Play className="w-12 h-12 text-white" /></div>}
                    <div className="absolute top-2 right-2"><Badge variant={item.type === "video" ? "default" : "secondary"}>{item.type}</Badge></div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-2 gap-3 flex-wrap">
                      <span className="flex items-center"><User className="w-4 h-4 mr-1" />{item.uploadedBy}</span>
                      <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{new Date(item.uploadedAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">{item.tags.slice(0, 3).map((tag) => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}</div>
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>

        {filteredItems.length === 0 && <div className="text-center py-12"><ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" /><h3 className="text-xl font-semibold text-gray-600 mb-2">No content found</h3><p className="text-gray-500">Try adjusting your search or filter criteria</p></div>}

        <Dialog open={Boolean(selectedItem)} onOpenChange={(open) => !open && setSelectedItem(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedItem && (
              <>
                <DialogHeader><DialogTitle className="text-xl font-serif">{selectedItem.title}</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="aspect-video overflow-hidden rounded-lg bg-black/5">
                    {selectedItem.type === "video" ? (
                      selectedItem.embedUrl ? <iframe src={selectedItem.embedUrl} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen title={selectedItem.title} /> : <video controls className="w-full h-full object-cover"><source src={selectedItem.url} type="video/mp4" /></video>
                    ) : (
                      <img src={currentAlbumImage || "/placeholder.svg"} alt={selectedItem.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  {selectedItem.type === "image" && selectedItem.albumUrls.length > 1 && (
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                      {selectedItem.albumUrls.map((url, index) => (
                        <button key={url} type="button" onClick={() => setSelectedAlbumIndex(index)} className={`border rounded-md overflow-hidden ${index === selectedAlbumIndex ? "ring-2 ring-primary" : ""}`}>
                          <img src={url} alt={`${selectedItem.title} ${index + 1}`} className="w-full h-16 object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500 gap-4 flex-wrap">
                      <span className="flex items-center"><User className="w-4 h-4 mr-1" />Uploaded by {selectedItem.uploadedBy}</span>
                      <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{new Date(selectedItem.uploadedAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700">{selectedItem.description}</p>
                    <div className="flex flex-wrap gap-2">{selectedItem.tags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}</div>
                    {user && (user.role === "admin" || user.role === "super_admin") && <Button variant="destructive" onClick={() => handleRemoveAsAdmin(selectedItem)}>Remove From Gallery</Button>}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <style jsx>{`
        .gallery-marquee { animation: galleryScroll 40s linear infinite; }
        .gallery-marquee:hover { animation-play-state: paused; }
        @keyframes galleryScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </div>
  )
}
