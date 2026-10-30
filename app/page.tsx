export const dynamic = "force-dynamic"

import Image from "next/image"
import Link from "next/link"
import { Clock, ExternalLink, MapPin, Play, ArrowRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { getActivities } from "@/lib/getActivities"
import { getEvents } from "@/lib/getEvents"
import { getGallery } from "@/lib/getGallery"

// Optional: Fetch dynamic homepage settings from your database API
async function getHomePageSettings() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/settings/homepage`, { cache: "no-store" })
    if (!res.ok) return null
    const data = await res.json()
    return data.settings || null
  } catch {
    return null
  }
}

export default async function HomePage() {
  const [galleryItems, upcomingEvents, activities, settings] = await Promise.all([
    getGallery(20), 
    getEvents(4), 
    getActivities(6),
    getHomePageSettings()
  ])

  const promoVideo = galleryItems.find((item) => item.postKind === "promo-video")
  const visibleGallery = galleryItems.filter((item) => item.postKind !== "promo-video").slice(0, 10)
  const isPortraitPromo = promoVideo?.videoLayout === "portrait"
  const canEmbedPromo = Boolean(promoVideo?.embedUrl) && promoVideo?.videoPlatform !== "facebook"

  // Fallback or dynamic content values
  const heroTag = settings?.heroTag || "ওঁ তৎ সৎ"
  const heroTitle = settings?.heroTitle || "সার্বজনীন পূজা উদযাপন পরিষদ, রুয়েট"
  const heroSubtitle = settings?.heroSubtitle || "রুয়েটের সনাতন ধর্মাবলম্বীদের আস্থার সংঘঠন যা বিভিন্ন পূজা-পার্বণ, ধর্মীয় উৎসব যথাযথ মর্যাদায় পালন করে"
  const heroBgImage = settings?.heroBgImage || "https://res.cloudinary.com/djt70cy8p/image/upload/v1768999776/hero_qytbzo.jpg"
  
  const fallbackImg1 = settings?.fallbackImg1 || "https://res.cloudinary.com/djt70cy8p/image/upload/v1768999779/buddhist-meditation-cave-peaceful_c9hc1o.jpg"
  const fallbackImg2 = settings?.fallbackImg2 || "https://res.cloudinary.com/djt70cy8p/image/upload/v1769127833/IMG_0834_azjooq.jpg"

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] lg:h-screen flex items-center justify-center overflow-hidden bg-black">
          <div 
            className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-1000 opacity-80" 
            style={{ backgroundImage: `url('${heroBgImage}')` }} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
          
          <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center text-white">
            <span className="inline-block text-orange-400 text-lg sm:text-xl font-medium tracking-widest mb-4 px-4 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              {heroTag}
            </span>
            <h1 className="font-serif text-orange-500 text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-tight drop-shadow-sm">
              {heroTitle}
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
              {heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-full text-base font-medium shadow-lg hover:shadow-orange-500/20 transition-all duration-300 w-full sm:w-auto" asChild>
                <Link href="/signup">আমাদের পরিবারে যোগ দিন</Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-6 rounded-full text-base font-medium bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-md transition-all duration-300 w-full sm:w-auto" asChild>
                <Link href="/events">আসন্ন মাঙ্গলিক অনুষ্ঠান</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Welcome & Featured Media Section */}
        <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50/50 to-white">
          <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              
              {/* Media Container */}
              <div className="rounded-3xl overflow-hidden border border-gray-100 bg-white shadow-xl shadow-gray-100/80 min-h-[380px] flex items-center justify-center p-4 lg:p-6 transition-all">
                {canEmbedPromo ? (
                  <div className={`w-full ${isPortraitPromo ? "max-w-[380px] h-[620px] rounded-2xl overflow-hidden bg-black shadow-inner" : "aspect-video rounded-2xl overflow-hidden bg-black shadow-inner"}`}>
                    <iframe src={promoVideo!.embedUrl} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen title={promoVideo!.title} />
                  </div>
                ) : promoVideo?.url ? (
                  <div className={`relative w-full overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50/80 via-white to-amber-50/50 ${isPortraitPromo ? "max-w-[430px] min-h-[620px]" : "min-h-[380px]"}`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.15),_transparent_50%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.1),_transparent_40%)]" />
                    <div className="relative flex h-full flex-col items-center justify-center gap-6 p-8 text-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-md shadow-orange-500/10 text-orange-500 transform hover:scale-105 transition-transform duration-300">
                        <Play className="h-8 w-8 fill-orange-500/10 ml-1" />
                      </div>
                      <div className="space-y-3">
                        <span className="inline-block text-xs font-semibold uppercase tracking-[0.25em] text-orange-600 bg-orange-100/70 px-3 py-1 rounded-full">Featured Video</span>
                        <h3 className="text-2xl font-semibold text-gray-900 tracking-tight">{promoVideo.title}</h3>
                        <p className="mx-auto max-w-xl text-sm leading-relaxed text-gray-600">
                          {promoVideo.videoPlatform === "facebook"
                            ? "Facebook reels often block site embeds. We now show a clean preview here and send visitors directly to the original reel instead of showing a broken player."
                            : promoVideo.description || "Open the original video to watch the full welcome message."}
                        </p>
                      </div>
                      <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 shadow-md">
                        <a href={promoVideo.url} target="_blank" rel="noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Watch Video
                        </a>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 p-4 w-full">
                    <Image src={fallbackImg1} alt="Prayer" width={250} height={300} className="rounded-xl object-cover w-full h-full shadow-md" />
                    <Image src={fallbackImg2} alt="Durga" width={250} height={250} className="rounded-xl object-cover w-full h-full mt-8 shadow-md" />
                  </div>
                )}
              </div>

              {/* Text Description */}
              <div className="space-y-6">
                <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 px-3 py-1 text-xs font-semibold tracking-wider rounded-full">
                  WELCOME
                </Badge>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  পূজা, সেবা এবং আধ্যাত্মিক মেলবন্ধনের এক মিলনস্থল
                </h2>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-light">
                  ভক্তি আর ঐতিহ্যের হাত ধরে রুয়েট প্রাঙ্গণে আমাদের এই পথচলা। আরাধনা, সেবামূলক কাজ এবং সাংস্কৃতিক মহোৎসবের মধ্য দিয়ে আমরা একে অপরের হৃদয়ে সেতুবন্ধন তৈরি করি। ডিজিটাল এই বাতায়নে এখন থেকে দেখা যাবে চলমান সকল মাঙ্গলিক অনুষ্ঠানের প্রতিচ্ছবি এবং আমাদের গৌরবময় মুহূর্তের স্মৃতিমালা।
                </p>
                <div className="pt-2">
                  <Button asChild className="bg-primary hover:bg-primary/90 rounded-full px-8 py-6 text-base font-medium shadow-md shadow-primary/20">
                    <Link href="/members">আমাদের সেবাব্রতী বৃন্দ</Link>
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Gallery Carousel Section */}
        <section className="py-20 bg-gray-50/70 border-y border-gray-100">
          <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 px-3 py-1 text-xs font-semibold tracking-wider rounded-full">
                স্মৃতি আলোকচিত্র
              </Badge>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">পুণ্যস্মৃতির ডালি</h2>
            </div>
            
            {visibleGallery.length > 0 ? (
              <div className="relative px-4 sm:px-12">
                <Carousel opts={{ loop: true }} className="w-full">
                  <CarouselContent className="-ml-4">
                    {visibleGallery.map((item) => (
                      <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                        <div className="h-full">
                          <div className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                            <div className="relative w-full h-72 bg-gray-100 overflow-hidden">
                              <Image 
                                src={item.thumbnail || item.url || "/placeholder.svg"} 
                                alt={item.title} 
                                fill 
                                className="object-cover group-hover:scale-105 transition-transform duration-500" 
                              />
                              {item.type === "video" && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] group-hover:bg-black/20 transition-colors">
                                  <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg text-orange-500">
                                    <Play className="w-6 h-6 fill-orange-500 ml-0.5" />
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="p-6 flex flex-col flex-grow justify-between">
                              <div className="space-y-2">
                                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                                  {item.title}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                                  {item.description || "Shared by our community"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 -translate-x-1/2 bg-white/80 hover:bg-white shadow-md border-gray-200" />
                  <CarouselNext className="right-0 translate-x-1/2 bg-white/80 hover:bg-white shadow-md border-gray-200" />
                </Carousel>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">Gallery posts will appear here after admin approval.</p>
            )}
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 px-3 py-1 text-xs font-semibold tracking-wider rounded-full">
                অনুষ্ঠানমালা
              </Badge>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">আসন্ন মাঙ্গলিক অনুষ্ঠান</h2>
            </div>
            
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <Card key={event.id} className="p-6 transition-all duration-300 hover:shadow-lg hover:border-orange-200 border-gray-100 rounded-2xl bg-white">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        
                        <div className="flex items-start sm:items-center space-x-5 w-full">
                          <div className="flex flex-col items-center justify-center bg-orange-50 border border-orange-100 rounded-2xl p-3 min-w-[70px] text-center shadow-sm">
                            <span className="text-2xl sm:text-3xl font-bold text-gray-900 leading-none mb-1">
                              {new Date(event.start_time).getDate()}
                            </span>
                            <span className="text-xs text-orange-600 font-bold uppercase tracking-wider">
                              {new Date(event.start_time).toLocaleDateString("en-US", { month: "short" })}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-semibold text-lg sm:text-xl text-gray-900">{event.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{event.description || "Details will be announced soon."}</p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto justify-end pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                          <div className="flex flex-col sm:items-end text-gray-500 text-xs sm:text-sm space-y-1">
                            <div className="flex items-center">
                              <Clock className="w-3.5 h-3.5 mr-1.5 text-orange-500" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-3.5 h-3.5 mr-1.5 text-orange-500" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                          <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-5 text-sm w-full sm:w-auto shadow-sm" asChild>
                            <Link href="/events">সবিস্তারে</Link>
                          </Button>
                        </div>

                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No upcoming events have been published yet.</p>
              )}
            </div>
          </div>
        </section>

        {/* Activities Section */}
        <section className="py-20 bg-gray-50/70 border-t border-gray-100">
          <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 px-3 py-1 text-xs font-semibold tracking-wider rounded-full">
                আয়োজন
              </Badge>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">আমাদের সেবাকর্ম</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {activities.map((activity) => (
                <Card key={activity.id} className="overflow-hidden group rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="relative h-72 w-full">
                    <Image 
                      src={activity.image_url || "/placeholder.svg"} 
                      alt={activity.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 text-center">
                      <div className="text-white space-y-2 transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                        <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">{activity.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-200 font-light">{activity.schedule}</p>
                        <div className="pt-3 opacity-0 group-hover:opacity-150 transition-opacity duration-300">
                          <Button asChild className="bg-white text-gray-900 hover:bg-orange-50 rounded-full text-xs font-medium px-5 shadow-md">
                            <Link href="/activities" className="inline-flex items-center">
                              See Activity <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}