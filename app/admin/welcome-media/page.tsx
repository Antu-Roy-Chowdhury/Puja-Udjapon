"use client"

import { useState } from "react"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { getEmbedUrl, getVideoThumbnail } from "@/lib/content"

export default function AdminWelcomeMediaPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [title, setTitle] = useState("Welcome Promo Video")
  const [description, setDescription] = useState("")
  const [url, setUrl] = useState("")
  const [layout, setLayout] = useState<"auto" | "portrait" | "landscape">("auto")
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    if (!url || !getEmbedUrl(url)) {
      toast({ title: "Error", description: "Please provide a valid YouTube or Facebook video link.", variant: "destructive" })
      return
    }

    setSaving(true)
    try {
      const res = await fetch("/api/gallery/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          type: "video",
          url,
          thumbnail: getVideoThumbnail(url),
          uploadedBy: user?.email ?? "",
          description,
          tags: ["promo-video", "welcome"],
          embedUrl: getEmbedUrl(url, true),
          postKind: "promo-video",
          videoLayout: layout,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save promo video")

      toast({ title: "Promo video submitted", description: "Approve it from the gallery moderation panel to show it on the home page and gallery." })
      setDescription("")
      setUrl("")
      setLayout("auto")
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to save promo video", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader><CardTitle>Welcome Promo Video</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Promo title" />
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Promo description" />
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="YouTube or Facebook video link" />
            <div>
              <p className="text-sm font-medium mb-2">Video Layout</p>
              <Select value={layout} onValueChange={(value: "auto" | "portrait" | "landscape") => setLayout(value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="portrait">Portrait</SelectItem>
                  <SelectItem value="landscape">Landscape</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSubmit} disabled={saving}>{saving ? "Saving..." : "Submit Promo Video"}</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
