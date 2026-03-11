export const dynamic = "force-dynamic"

import Image from "next/image"
import Link from "next/link"
import { Clock, ExternalLink, MapPin, Play } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { getActivities } from "@/lib/getActivities"
import { getEvents } from "@/lib/getEvents"
import { getGallery } from "@/lib/getGallery"

export default async function HomePage() {
  const [galleryItems, upcomingEvents, activities] = await Promise.all([getGallery(20), getEvents(4), getActivities(6)])

  const promoVideo = galleryItems.find((item) => item.postKind === "promo-video")
  const visibleGallery = galleryItems.filter((item) => item.postKind !== "promo-video").slice(0, 10)
  const isPortraitPromo = promoVideo?.videoLayout === "portrait"
  const canEmbedPromo = Boolean(promoVideo?.embedUrl) && promoVideo?.videoPlatform !== "facebook"

  return (
    <div className="min-h-screen">
      <main>
        <section className="relative h-screen bg-gradient-to-r from-black/60 to-black/40">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://res.cloudinary.com/djt70cy8p/image/upload/v1768999776/hero_qytbzo.jpg')" }} />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white max-w-4xl mx-auto px-4">
              <p className="text-lg mb-4">ওঁ তৎ সৎ</p>
              <h1 className="font-serif text-orange-500 text-5xl md:text-7xl font-bold mb-6">সার্বজনীন পূজা উদযাপন পরিষদ, রুয়েট</h1>
              <p className="text-xl mb-8 max-w-2xl mx-auto">রুয়েটের সনাতন ধর্মাবলম্বীদের আস্থার সংঘঠন যা বিভিন্ন পূজা-পার্বণ, ধর্মীয় উৎসব যথাযথ মর্যাদায় পালন করে</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/80 text-white px-8 py-4 rounded-full text-lg font-semibold" asChild><Link href="/signup">আমাদের পরিবারে যোগ দিন</Link></Button>
                <Button size="lg" variant="outline" className="px-8 py-4 rounded-full text-lg font-semibold bg-white/10 text-white border-white hover:bg-white/20" asChild><Link href="/events">আসন্ন মাঙ্গলিক অনুষ্ঠান</Link></Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-[90rem] mx-auto px-4 sm:px-5 lg:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="rounded-2xl overflow-hidden border bg-white shadow-sm min-h-[360px] flex items-center justify-center p-4">
                {canEmbedPromo ? (
                  <div className={`w-full ${isPortraitPromo ? "max-w-[380px] h-[620px] rounded-2xl overflow-hidden bg-black" : "aspect-video rounded-2xl overflow-hidden bg-black"}`}>
                    <iframe src={promoVideo!.embedUrl} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen title={promoVideo!.title} />
                  </div>
                ) : promoVideo?.url ? (
                  <div className={`relative w-full overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-amber-50 ${isPortraitPromo ? "max-w-[430px] min-h-[620px]" : "min-h-[380px]"}`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.18),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.14),_transparent_35%)]" />
                    <div className="relative flex h-full flex-col items-center justify-center gap-6 p-8 text-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
                        <Play className="h-9 w-9 text-orange-500" />
                      </div>
                      <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Featured Video</p>
                        <h3 className="text-2xl font-semibold text-gray-900">{promoVideo.title}</h3>
                        <p className="mx-auto max-w-xl text-sm leading-6 text-gray-600">
                          {promoVideo.videoPlatform === "facebook"
                            ? "Facebook reels often block site embeds. We now show a clean preview here and send visitors directly to the original reel instead of showing a broken player."
                            : promoVideo.description || "Open the original video to watch the full welcome message."}
                        </p>
                      </div>
                      <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
                        <a href={promoVideo.url} target="_blank" rel="noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Watch Video
                        </a>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 p-4 w-full">
                    <Image src="https://res.cloudinary.com/djt70cy8p/image/upload/v1768999779/buddhist-meditation-cave-peaceful_c9hc1o.jpg" alt="Prayer" width={250} height={300} className="rounded-lg object-cover w-full h-full" />
                    <Image src="https://res.cloudinary.com/djt70cy8p/image/upload/v1769127833/IMG_0834_azjooq.jpg" alt="Durga" width={250} height={250} className="rounded-lg object-cover w-full h-full mt-8" />
                  </div>
                )}
              </div>
              <div>
                <Badge className="bg-orange-100 text-orange-500 mb-4">WELCOME</Badge>
                <h2 className="font-serif text-4xl font-bold text-gray-900 mb-6">পূজা, সেবা এবং আধ্যাত্মিক মেলবন্ধনের এক মিলনস্থল</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">ভক্তি আর ঐতিহ্যের হাত ধরে রুয়েট প্রাঙ্গণে আমাদের এই পথচলা। আরাধনা, সেবামূলক কাজ এবং সাংস্কৃতিক মহোৎসবের মধ্য দিয়ে আমরা একে অপরের হৃদয়ে সেতুবন্ধন তৈরি করি। ডিজিটাল এই বাতায়নে এখন থেকে দেখা যাবে চলমান সকল মাঙ্গলিক অনুষ্ঠানের প্রতিচ্ছবি এবং আমাদের গৌরবময় মুহূর্তের স্মৃতিমালা।</p>
                <div><Button asChild className="bg-primary hover:bg-primary/90"><Link href="/members">আমাদের সেবাব্রতী বৃন্দ</Link></Button></div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-[90rem] mx-auto px-4 sm:px-5 lg:px-6">
            <div className="text-center mb-12">
              <Badge className="bg-orange-100 text-orange-500 mb-4">স্মৃতি আলোকচিত্র</Badge>
              <h2 className="font-serif text-4xl font-bold text-gray-900">পুণ্যস্মৃতির ডালি</h2>
            </div>
            {visibleGallery.length > 0 ? (
              <Carousel opts={{ loop: true }} className="w-full">
                <CarouselContent>
                  {visibleGallery.map((item) => (
                    <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                      <div className="p-1">
                        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                          <div className="relative w-full h-72 bg-gray-100">
                            <Image src={item.thumbnail || item.url || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                            {item.type === "video" ? <div className="absolute inset-0 flex items-center justify-center bg-black/20"><Play className="w-12 h-12 text-white" /></div> : null}
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900">{item.title}</h3>
                            <p className="text-sm text-gray-500">{item.description || "Shared by our community"}</p>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : <p className="text-center text-gray-500">Gallery posts will appear here after admin approval.</p>}
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-[90rem] mx-auto px-4 sm:px-5 lg:px-6">
            <div className="text-center mb-12"><Badge className="bg-orange-100 text-orange-500 mb-4">অনুষ্ঠানমালা</Badge><h2 className="font-serif text-4xl font-bold text-gray-900">আসন্ন মাঙ্গলিক অনুষ্ঠান</h2></div>
            <div className="space-y-6">
              {upcomingEvents.length > 0 ? upcomingEvents.map((event) => (
                <Card key={event.id} className="p-6 transition-all hover:shadow-md">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex items-center space-x-6 w-full">
                        <div className="text-center min-w-[60px]"><div className="text-3xl font-bold text-gray-900">{new Date(event.start_time).getDate()}</div><div className="text-sm text-orange-500 font-semibold">{new Date(event.start_time).toLocaleDateString("en-US", { month: "short" })}</div></div>
                        <div><h3 className="font-semibold text-lg text-gray-900">{event.title}</h3><p className="text-gray-600 text-sm">{event.description || "Details will be announced soon."}</p></div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto justify-end">
                        <div className="flex flex-col items-end text-gray-600"><div className="flex items-center text-sm"><Clock className="w-4 h-4 mr-1" /><span>{event.time}</span></div><div className="flex items-center text-sm"><MapPin className="w-4 h-4 mr-1" /><span>{event.location}</span></div></div>
                        <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto" asChild><Link href="/events">সবিস্তারে</Link></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) : <p className="text-center text-gray-500">No upcoming events have been published yet.</p>}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-[90rem] mx-auto px-4 sm:px-5 lg:px-6">
            <div className="text-center mb-12"><Badge className="bg-orange-100 text-orange-500 mb-4">আয়োজন</Badge><h2 className="font-serif text-4xl font-bold text-gray-900">আমাদের সেবাকর্ম</h2></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((activity) => (
                <Card key={activity.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="relative h-64">
                    <Image src={activity.image_url || "/placeholder.svg"} alt={activity.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/45 flex items-center justify-center"><div className="text-center text-white px-4"><h3 className="font-serif text-xl font-bold mb-3">{activity.name}</h3><p className="text-sm mb-4">{activity.schedule}</p><Button asChild className="bg-white text-gray-900 hover:bg-orange-100"><Link href="/activities">See Activity</Link></Button></div></div>
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
