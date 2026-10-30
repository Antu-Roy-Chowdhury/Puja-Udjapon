"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MapPin, Phone, Clock, Users, Sparkles, HeartHandshake, Compass } from "lucide-react"

const officeContacts = [
  {
    title: "পরিষদীয় যোগাযোগ ও সমন্বয়",
    subtitle: "পূজা পার্বণ সংক্রান্ত তথ্য, স্বেচ্ছাসেবক দল গঠন এবং সদস্যপদ সহায়তার জন্য যোগাযোগ করুন।",
    email: "pujaudjaponruet@gmail.com",
    phone: "+880 1700 000000",
    location: "কেন্দ্রীয় পূজা মণ্ডপ প্রাঙ্গণ, রুয়েট ক্যাম্পাস",
    icon: Users,
  },
  {
    title: "সেবামূলক অর্ঘ্য ও আর্থিক অনুদান",
    subtitle: "পূজা উৎসবে অনুদান প্রদান, পেমেন্ট রেফারেন্স এবং আর্থিক তথ্যানুসন্ধানের ডেষ্ক।",
    email: "donation.pujaudjapon@gmail.com",
    phone: "+880 1800 000000",
    location: "অর্থ বিভাগ, রুয়েট পূজা উদযাপন পরিষদ",
    icon: HeartHandshake,
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff7ed,white_55%)] py-12 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <Badge className="bg-orange-100 text-orange-800 border border-orange-200 px-3.5 py-1 rounded-full font-semibold">
            যোগাযোগ ও তথ্য সহায়তা
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            রুয়েট পূজা উদযাপন পরিষদ
          </h1>
          <p className="text-gray-600 text-base sm:text-lg font-light leading-relaxed">
            সনাতন ধর্মাবলম্বী শিক্ষার্থীদের যেকোনো প্রয়োজনে, সদস্যপদ অনুমোদন, উৎসবের সূচি কিংবা সেবা কার্যক্রমে যুক্ত হতে আমাদের সাথে যোগাযোগ করুন। আপনার প্রতিটি সেবামূলক জিজ্ঞাসা আমাদের কাছে গুরুত্বপূর্ণ।
          </p>
        </section>

        {/* Main Office Contacts Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {officeContacts.map((contact) => {
            const IconComponent = contact.icon
            return (
              <Card key={contact.title} className="rounded-2xl border-orange-100/80 shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden flex flex-col justify-between">
                <CardHeader className="space-y-2 pb-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 mb-2">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <CardTitle className="font-serif text-xl sm:text-2xl font-bold text-gray-900">{contact.title}</CardTitle>
                  <p className="text-sm text-gray-500 font-light leading-relaxed">{contact.subtitle}</p>
                </CardHeader>
                <CardContent className="space-y-3 pt-0 pb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                    <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                    <a href={`mailto:${contact.email}`} className="hover:text-orange-600 hover:underline truncate">{contact.email}</a>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                    <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                    <a href={`tel:${contact.phone}`} className="hover:text-orange-600 hover:underline">{contact.phone}</a>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                    <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                    <span className="truncate">{contact.location}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </section>

        {/* Secondary Info & Developer Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Office Hours & Services Card (7 cols) */}
          <Card className="lg:col-span-7 rounded-2xl border-orange-100/80 shadow-sm bg-white flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="font-serif text-xl sm:text-2xl font-bold text-gray-900">কার্যক্রম ও সহায়তা ক্ষেত্র</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-2xl bg-orange-50/60 p-5 border border-orange-100 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-100/80 px-2.5 py-1 rounded-md">সেবাসমূহ</span>
                <p className="text-sm text-gray-700 leading-relaxed pt-1">
                  নতুন সদস্যপদ অনুমোদন, কার্যনির্বাহী কমিটি যোগাযোগ, পূজা পার্বণের স্বেচ্ছাসেবক তালিকাভুক্তি, এবং ক্যাম্পাসের সনাতন শিক্ষার্থীদের ধর্মীয় অনুষ্ঠান সমন্বয়।
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-gray-900 font-semibold text-sm">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span>কার্যালয়ের সময়সূচী</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">রবিবার থেকে বৃহস্পতিবার, সকাল ১০:০০ টা – বিকাল ৫:০০ টা</p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-gray-900 font-semibold text-sm">
                    <Compass className="w-4 h-4 text-orange-500" />
                    <span>অবস্থান</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">রাজশাহী প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয় (রুয়েট) ক্যাম্পাস</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Developer Team Card (5 cols) */}
          <Card className="lg:col-span-5 rounded-2xl border-orange-100/80 shadow-sm bg-gradient-to-br from-orange-500/5 via-white to-amber-500/5 flex flex-col justify-between">
            <CardHeader className="space-y-2">
              <div className="w-12 h-12 rounded-xl bg-orange-100/80 flex items-center justify-center text-orange-600 mb-1">
                <Sparkles className="w-6 h-6" />
              </div>
              <CardTitle className="font-serif text-xl sm:text-2xl font-bold text-gray-900">কারিগরি ও ডেভেলপার টিম</CardTitle>
              <p className="text-sm text-gray-500 font-light">এই ওয়েবসাইটটি ডিজাইন ও মেইনটেইন করছে রুয়েটের প্রতিভাবান ডেভেলপারবৃন্দ।</p>
            </CardHeader>
            <CardContent className="pt-2 pb-6">
              <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full py-6 font-medium shadow-md">
                <Link href="/developers">ডেভেলপার টিম পরিচিতি দেখুন</Link>
              </Button>
            </CardContent>
          </Card>

        </section>

      </div>
    </div>
  )
}