"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { uploadToCloudinary } from "@/lib/cloudinaryUpload"
import { getEmbedUrl, getVideoPlatform } from "@/lib/content"
import { defaultHomepage } from "@/lib/homepage"
import { Play, ExternalLink, Eye } from "lucide-react"

export default function AdminHomePageConfigPage() {
  const { toast } = useToast()
  
  // Hero Section State
  const [heroTitle, setHeroTitle] = useState(defaultHomepage.heroTitle)
  const [heroSubtitle, setHeroSubtitle] = useState(defaultHomepage.heroSubtitle)
  const [heroTag, setHeroTag] = useState(defaultHomepage.heroTag)
  const [heroBgImage, setHeroBgImage] = useState(defaultHomepage.heroBgImage)
  
  // Welcome Fallback Images State
  const [fallbackImg1, setFallbackImg1] = useState(defaultHomepage.fallbackImg1)
  const [fallbackImg2, setFallbackImg2] = useState(defaultHomepage.fallbackImg2)

  // Promo Video State
  const [videoTitle, setVideoTitle] = useState("Welcome Promo Video")
  const [videoDescription, setVideoDescription] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [videoLayout, setVideoLayout] = useState<"auto" | "portrait" | "landscape">("auto")
  
  const [uploadingBg, setUploadingBg] = useState(false)
  const [uploadingImg1, setUploadingImg1] = useState(false)
  const [uploadingImg2, setUploadingImg2] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/settings/homepage?draft=1", { cache: "no-store" })
      .then(async (res) => { const data = await res.json(); if (!res.ok) throw new Error(data.error); return data })
      .then(({ settings, legacyPromo }) => {
        setHeroTitle(settings.heroTitle); setHeroSubtitle(settings.heroSubtitle); setHeroTag(settings.heroTag)
        setHeroBgImage(settings.heroBgImage); setFallbackImg1(settings.fallbackImg1); setFallbackImg2(settings.fallbackImg2)
        const promo = settings.promoVideo || legacyPromo
        setVideoTitle(promo?.title || "Welcome Promo Video")
        setVideoDescription(promo?.description || "")
        setVideoUrl(promo?.url || "")
        setVideoLayout(promo?.layout || promo?.videoLayout || "auto")
      })
      .catch((error) => toast({ title: "Unable to load homepage content", description: String(error), variant: "destructive" }))
      .finally(() => setLoading(false))
  }, [])

  // Handlers for cloudinary image updates (using valid CloudinaryFolder types)
  const handleBgUpload = async (file?: File | null) => {
    if (!file) return
    setUploadingBg(true)
    try {
      const url = await uploadToCloudinary(file, "temple/events", "image")
      setHeroBgImage(url)
      toast({ title: "Hero background updated successfully" })
    } catch {
      toast({ title: "Error", description: "Failed to upload background image", variant: "destructive" })
    } finally {
      setUploadingBg(false)
    }
  }

  const handleImg1Upload = async (file?: File | null) => {
    if (!file) return
    setUploadingImg1(true)
    try {
      const url = await uploadToCloudinary(file, "temple/activities", "image")
      setFallbackImg1(url)
      toast({ title: "Left image updated" })
    } catch {
      toast({ title: "Error", description: "Failed to upload image", variant: "destructive" })
    } finally {
      setUploadingImg1(false)
    }
  }

  const handleImg2Upload = async (file?: File | null) => {
    if (!file) return
    setUploadingImg2(true)
    try {
      const url = await uploadToCloudinary(file, "temple/activities", "image")
      setFallbackImg2(url)
      toast({ title: "Right image updated" })
    } catch {
      toast({ title: "Error", description: "Failed to upload image", variant: "destructive" })
    } finally {
      setUploadingImg2(false)
    }
  }

  const handleSaveAll = async (mode: "save" | "publish") => {
    setSaving(true)
    try {
      const payload = {
        mode,
        heroTitle,
        heroSubtitle,
        heroTag,
        heroBgImage,
        fallbackImg1,
        fallbackImg2,
        promoVideo: videoUrl ? {
          title: videoTitle,
          url: videoUrl,
          description: videoDescription,
          layout: videoLayout,
        } : null
      }

      const res = await fetch("/api/settings/homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Failed to save home page settings") }
      toast({ title: mode === "publish" ? "Home Page Published" : "Draft Saved" })
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to save settings", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/70 p-6 sm:p-10">
      <div className="max-w-[90rem] mx-auto space-y-6">
        
        {/* Top Header Bar */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold font-serif text-gray-900">Manage Home Page Content & Preview</h1>
            <p className="text-sm text-gray-600 mt-1">Customize hero copy, background imagery, and see changes live on the right sidebar.</p>
          </div>
          <div className="flex gap-2"><Button variant="outline" onClick={() => handleSaveAll("save")} disabled={saving || loading}>Save Draft</Button><Button onClick={() => handleSaveAll("publish")} disabled={saving || loading} className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 shadow-sm">{saving ? "Saving..." : "Publish All Changes"}</Button></div>
        </div>

        {/* Main Split Layout: Form Editor (Left) & Live Preview (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            <Card className="rounded-2xl border-gray-100 shadow-sm">
              <CardHeader><CardTitle className="font-serif text-xl">Hero Section Settings</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-800">Top Tag (e.g. ওঁ তৎ সৎ)</label>
                  <Input value={heroTag} onChange={(e) => setHeroTag(e.target.value)} className="rounded-xl mt-1" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-800">Main Heading Title</label>
                  <Input value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} className="rounded-xl mt-1" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-800">Subtitle Description</label>
                  <Textarea value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} className="rounded-xl mt-1" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800">Hero Background Image</label>
                  <Input type="file" accept="image/*" onChange={(e) => handleBgUpload(e.target.files?.[0] || null)} disabled={uploadingBg} className="rounded-xl file:bg-orange-50 file:text-orange-700" />
                  <Input value={heroBgImage} onChange={(e) => setHeroBgImage(e.target.value)} placeholder="Or paste image URL" className="rounded-xl text-xs text-gray-500 mt-1" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-gray-100 shadow-sm">
              <CardHeader><CardTitle className="font-serif text-xl">Welcome Fallback Images</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <p className="text-xs text-gray-500">Displayed side-by-side on the welcome section when no promo video is active.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-800">Left Image</label>
                    <Input type="file" accept="image/*" onChange={(e) => handleImg1Upload(e.target.files?.[0] || null)} disabled={uploadingImg1} className="rounded-xl text-xs" />
                    <Input value={fallbackImg1} onChange={(e) => setFallbackImg1(e.target.value)} className="rounded-xl text-xs text-gray-500 mt-1" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-800">Right Image</label>
                    <Input type="file" accept="image/*" onChange={(e) => handleImg2Upload(e.target.files?.[0] || null)} disabled={uploadingImg2} className="rounded-xl text-xs" />
                    <Input value={fallbackImg2} onChange={(e) => setFallbackImg2(e.target.value)} className="rounded-xl text-xs text-gray-500 mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-gray-100 shadow-sm">
              <CardHeader><CardTitle className="font-serif text-xl">Featured Promo Video</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-800">Video Title</label>
                  <Input value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} className="rounded-xl mt-1" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-800">Video Description Note</label>
                  <Input value={videoDescription} onChange={(e) => setVideoDescription(e.target.value)} className="rounded-xl mt-1" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-800">Video Link (YouTube / Facebook)</label>
                  <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="rounded-xl mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Video Layout Aspect</label>
                  <Select value={videoLayout} onValueChange={(value: "auto" | "portrait" | "landscape") => setVideoLayout(value)}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectItem value="portrait">Portrait</SelectItem>
                      <SelectItem value="landscape">Landscape</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Right Column: Sticky Live Preview Sidebar (5 cols) */}
          <div className="lg:col-span-5 sticky top-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-orange-50 border border-orange-200 px-4 py-2 rounded-xl">
              <Eye className="w-4 h-4 text-orange-600" />
              <span>Live Home Page Preview</span>
            </div>

            <div className="border border-gray-200 rounded-3xl overflow-hidden bg-white shadow-xl">
              
              {/* Preview Hero Section */}
              <div className="relative h-[320px] flex items-center justify-center overflow-hidden bg-black text-center p-6">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-70" 
                  style={{ backgroundImage: `url('${heroBgImage}')` }} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
                
                <div className="relative z-10 text-white space-y-3">
                  <span className="inline-block text-orange-400 text-xs font-medium tracking-widest px-3 py-0.5 rounded-full bg-white/10 border border-white/20">
                    {heroTag || "ওঁ তৎ সৎ"}
                  </span>
                  <h2 className="font-serif text-orange-500 text-2xl sm:text-3xl font-bold leading-tight">
                    {heroTitle || "Title preview..."}
                  </h2>
                  <p className="text-xs text-gray-200 line-clamp-2 max-w-sm mx-auto font-light">
                    {heroSubtitle || "Subtitle preview..."}
                  </p>
                </div>
              </div>

              {/* Preview Welcome Section */}
              <div className="p-6 bg-gradient-to-b from-gray-50 to-white space-y-4">
                <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 text-[10px]">WELCOME</Badge>
                <h3 className="font-serif text-xl font-bold text-gray-900">
                  পূজা, সেবা এবং আধ্যাত্মিক মেলবন্ধনের এক মিলনস্থল
                </h3>

                {/* Media Preview Box */}
                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-3 min-h-[200px] flex items-center justify-center">
                  {videoUrl && getVideoPlatform(videoUrl) === "youtube" ? (
                    <div className={`w-full ${videoLayout === "portrait" ? "h-64" : "aspect-video"} rounded-xl overflow-hidden bg-black flex items-center justify-center text-white text-xs`}>
                      <iframe src={getEmbedUrl(videoUrl)} className="w-full h-full" title={videoTitle} allowFullScreen />
                    </div>
                  ) : videoUrl ? (
                    <div className="relative w-full overflow-hidden rounded-xl bg-orange-50 p-4 text-center space-y-2">
                      <div className="w-10 h-10 mx-auto rounded-full bg-white shadow flex items-center justify-center text-orange-500">
                        <Play className="w-4 h-4 fill-orange-500" />
                      </div>
                      <p className="text-xs font-semibold text-gray-800">{videoTitle || "Promo Video"}</p>
                      <span className="text-[10px] text-orange-600 underline inline-flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" /> External Link Preview
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <img src={fallbackImg1} alt="Fallback 1" className="rounded-lg object-cover w-full h-28 shadow-sm" />
                      <img src={fallbackImg2} alt="Fallback 2" className="rounded-lg object-cover w-full h-28 shadow-sm mt-4" />
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
