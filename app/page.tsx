
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Play } from "lucide-react"
import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { da } from "date-fns/locale"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <main>

        {/* Main Hero Section */}
        <section className="relative h-screen bg-gradient-to-r from-black/60 to-black/40">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('/images/buddha-hero.jpg')`,
            }}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white max-w-4xl mx-auto px-4">
              <p className="text-lg mb-4 ">ওঁ তৎ সৎ</p>
              <h1 className="font-serif text-orange-500 text-5xl md:text-7xl font-bold mb-6">সার্বজনীন পূজা উদযাপন পরিষদ, রুয়েট
</h1>
              <p className="text-xl mb-8 max-w-2xl mx-auto">রুয়েটের সনাতন ধর্মাবলম্বীদের আস্থার সংঘঠন যা বিভিন্ন পূজা-পার্বণ, ধর্মীয় উৎসব যথাযথ মর্যাদায় পালন করে</p>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/70 text-white px-8 py-4 rounded-full text-lg font-semibold mx-2"
              >
               <Link href="/signup">Join Community</Link>
              </Button>
            </div>
          </div>
        </section>
        {/* Top Hero Section - Changing your way of thinking
        <section className="relative py-16 bg-gradient-to-r from-orange-50 to-amber-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif text-4xl font-bold text-gray-900 mb-8">
                  Changing your way of thinking by prayer
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-6 h-6 border-2 border-orange-500 rounded-full relative">
                        <div className="absolute inset-1 bg-orange-500 rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">Dharma Chakra</h3>
                      <p className="text-gray-600">
                        Posuere tellus imperdiet facilibus viverra faucibus tellus eleifend
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-6 h-6 relative">
                        <div className="absolute inset-0 border-2 border-orange-500 rounded-full"></div>
                        <div className="absolute inset-2 border border-orange-500 rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">The Lotus</h3>
                      <p className="text-gray-600">
                        Posuere tellus imperdiet facilibus viverra faucibus tellus eleifend
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-6 h-6 relative">
                        <div className="w-full h-1 bg-orange-500 rounded-full"></div>
                        <div className="w-full h-1 bg-orange-500 rounded-full mt-1"></div>
                        <div className="w-full h-1 bg-orange-500 rounded-full mt-1"></div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">Conch Shell</h3>
                      <p className="text-gray-600">
                        Posuere tellus imperdiet facilibus viverra faucibus tellus eleifend
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="relative rounded-lg overflow-hidden">
                  <Image
                    src="/images/meditation-section.jpg"
                    alt="Buddha meditation"
                    width={600}
                    height={400}
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Button size="lg" className="rounded-full w-16 h-16 bg-primary hover:bg-primary/90">
                      <Play className="w-6 h-6 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* Welcome Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Image
                    src="/buddha-meditation.png"
                    alt="Buddha statue"
                    width={250}
                    height={300}
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="space-y-4 pt-8">
                  <Image
                    src="/buddhist-temple-garden-meditation.png"
                    alt="Temple garden"
                    width={250}
                    height={250}
                    className="rounded-lg object-cover"
                  />
                </div>
              </div>
              <div>
                <Badge className="bg-orange-100 text-orange-500 mb-4">WELCOME</Badge>
                <h2 className="font-serif text-4xl font-bold text-gray-900 mb-6">
                  We Are Orthodox, We Belive In Ishwar.
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  In Hinduism, Ishwar is refer to the concept of a supreme, divine entity woth ultimate authority and control over the universe.
                </p>
                <div className="flex items-center space-x-8">
                  <div className="text-center">
                    
                    <h3 className="font-semibold text-gray-900 text-left">Philosophy</h3>
                    <p className="text-sm text-gray-600 text-justify">
                      Hindu philosophy is a broad and diverse set of systems and traditions that developed in India alongside Hindu religious traditions. The core of Hindu philosophy is centered around the concept of the six orthodox (āstika) schools, known as darśanas, which all accept the Vedas as an authoritative source of knowledge. 
                    
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

       {/* Temple Image Section */}
        <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="bg-orange-100 text-orange-500 mb-4">Our Temple</Badge>
          <h2 className="font-serif text-4xl font-bold text-gray-900">Photographs</h2>
        </div>

        <Carousel  opts={{ loop: true}}>
          <CarouselContent>
            {["/Gallery/1.jpg", "/Gallery/6.jpg", "/Gallery/3.jpg", "/Gallery/4.jpg", "/Gallery/5.jpg"].map((src, i) => (
              <CarouselItem key={i} >
                <Image
                  src={src}
                  alt={`Temple ${i + 1}`}
                  width={400}
                  height={300}
                  className="w-150 h-100 object-cover rounded-lg shadow"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>

        {/* Upcoming Events Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge className="bg-orange-100 text-orange-500 mb-4">Events</Badge>
              <h2 className="font-serif text-4xl font-bold text-gray-900">Upcoming Events</h2>
            </div>
            <div className="space-y-6">
              {[
                {
                  title: "Sri Kirsna's Janmashtami",
                  subtitle: "Krisnas Name Conferment Ceremony",
                  time: "5:00 PM - 8:30 PM",
                  date: "2023-AUG-16",
                },
                {
                  title: "Leo Sankranti",
                  subtitle: "",
                  time: "7:00 PM - 9:00 PM",
                  date: "2023-AUG-17",
                },
                {
                  title: "Annada Ekadashi",
                  subtitle: "",
                  time: "7:00 PM - 9:00 PM",
                  date: "2023-AUG-19",
                },
                {
                  title: "Ganesh Chaturthi",
                  subtitle: "",
                  time: "7:00 PM - 9:00 PM",
                  date: "2023-AUG-27",
                },
              ].map((event, index) => (
                <Card key={index} className="p-6">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-900">{event.date.split("-")[2]}</div>
                          <div className="text-sm text-orange-500 font-semibold">{event.date.split("-")[1]}</div>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{event.title}</h3>
                          {event.subtitle && <p className="text-gray-600">{event.subtitle}</p>}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">{event.time}</span>
                        </div>
                        <Button className="bg-primary hover:bg-primary/90"><Link href="/events">View Detais</Link></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge className="bg-orange-100 text-orange-500 mb-4">OUR ACTIVITIES</Badge>
              <h2 className="font-serif text-4xl font-bold text-gray-900">What We Offer?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Light Meditation",
                  image: "/buddhist-meditation-cave-peaceful.png",
                  buttonColor: "bg-green-500 hover:bg-green-600",
                },
                {
                  title: "Weekly Prayers",
                  image: "/buddhist-monks-ceremony.png",
                  buttonColor: "bg-orange-500 hover:bg-orange-600",
                },
                {
                  title: "Special Events",
                  image: "/buddhist-festival.png",
                  buttonColor: "bg-green-500 hover:bg-green-600",
                },
                {
                  title: "Ongoing Programs",
                  image: "/buddhist-temple-doors.png",
                  buttonColor: "bg-green-500 hover:bg-green-600",
                },
                {
                  title: "Holi Festival",
                  image: "/buddhist-prayer-flags-mountain-peaceful.png",
                  buttonColor: "bg-green-500 hover:bg-green-600",
                },
                {
                  title: "Library",
                  image: "/library.jpg",
                  buttonColor: "bg-green-500 hover:bg-green-600",
                },
              ].map((activity, index) => (
                <Card key={index} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="relative h-64">
                    <Image
                      src={activity.image || "/placeholder.svg"}
                      alt={activity.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <div className="w-6 h-6 bg-white rounded-full"></div>
                        </div>
                        <h3 className="font-serif text-xl font-bold mb-4">{activity.title}</h3>
                        <Button className={`${activity.buttonColor} text-white`}>Information</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Image
                  src="/buddha-profile-meditation.png"
                  alt="Buddha statue"
                  width={400}
                  height={400}
                  className="rounded-lg object-cover"
                />
              </div>
              <div>
                <h2 className="font-serif text-4xl font-bold mb-8">What People Say About Us</h2>
                <Card className="bg-white text-gray-900 p-6">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4">
                      <Image src="/kapil.jpg" alt="Temple" width={42} height={40} className="rounded-full h-15 w-17" />
                      <div>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          "As I stand here, I am truly amazed by the incredible sense of community and the profound devotion I see in all of you. To witness this vibrant expression of faith and the deep sense of togetherness is truly inspiring. The prayers offered here are not just a ritual; they are a testament to the strong bonds that connect us all."
                        </p>
                        <div>
                          <h4 className="font-semibold">Kapil Deb</h4>
                          <p className="text-sm text-gray-500"> Vice Chancellor RUET</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Blog/News Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge className="bg-orange-100 text-orange-500 mb-4">FROM THE BLOG</Badge>
              <h2 className="font-serif text-4xl font-bold text-gray-900">Updated Temple News</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Lokkhi Narayan Kotha",
                  image: "/white-buddha-meditation.png",
                  author: "Kapil Deb",
                },
                {
                  title: "Horo Parboti",
                  image: "/buddhist-monk-meditation.png",
                  author: "Kapil Deb",
                },
                {
                  title: "RUET",
                  image: "/placeholder.svg?width=200",
                  author: "Kapil Deb",
                },
              ].map((article, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative h-48">
                    <Image
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-serif text-xl font-bold text-gray-900 mb-3 hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      Kapil deb has posted that the temple is now open for worship. And you can join us to pray.
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Image src="/kapil.jpg" alt="Temple" width={20} height={20} className="rounded-full" />
                      <span>POSTED BY:</span>
                      <span className="text-primary font-semibold">{article.author}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

    </div>
  )
}
