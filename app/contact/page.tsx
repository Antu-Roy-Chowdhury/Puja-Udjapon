"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Code, Mail, MapPin, Phone, Wrench } from "lucide-react"

const officeContacts = [
  {
    title: "পরিষদীয় যোগাযোগ ও সমন্বয়",
    subtitle: "পূজা সংক্রান্ত সর্বশেষ তথ্য, স্বেচ্ছাসেবক দল গঠন এবং সদস্যপদ সহায়তার জন্য এখানে যোগাযোগ করুন।",
    email: "pujaudjaponruet@gmail.com",
    phone: "+880 1700 000000",
    location: "RUET Campus, Rajshahi",
  },
  {
    title: "সেবামূলক অর্ঘ্য ও আর্থিক তথ্যানুসন্ধান",
    subtitle: "আপনার প্রদত্ত অনুদান নিশ্চিতকরণ, পেমেন্ট রেফারেন্স এবং আর্থিক যেকোনো জিজ্ঞাসায় আমরা আপনার পাশে আছি।",
    email: "donation.pujaudjapon@gmail.com",
    phone: "+880 1800 000000",
    location: "Finance Desk, RUET Campus",
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff7ed,white_55%)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <section className="text-center max-w-3xl mx-auto">
          <Badge className="bg-orange-100 text-orange-700 mb-4">যোগাযোগ</Badge>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">রুয়েট পূজা উদযাপন পরিষদ</h1>
          <p className="text-lg text-gray-600">সদস্যপদ, উৎসব সমন্বয়, দান বা সেবামূলক অনুদান নিশ্চিতকরণ এবং কারিগরি সহায়তার জন্য নিচের মাধ্যমগুলো ব্যবহার করুন। আপনাদের সুবিধার্থে আমরা এই পাতাটিকে সুনির্দিষ্ট রেখেছি যেন দায়িত্বপ্রাপ্ত ব্যক্তিবর্গের সাথে সরাসরি যোগাযোগ সহজ হয়।</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {officeContacts.map((contact) => (
            <Card key={contact.title} className="border-orange-100 shadow-sm">
              <CardHeader>
                <CardTitle className="font-serif text-2xl text-gray-900">{contact.title}</CardTitle>
                <p className="text-sm text-gray-500">{contact.subtitle}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-700"><Mail className="w-4 h-4 text-orange-500" /><a href={`mailto:${contact.email}`} className="hover:underline">{contact.email}</a></div>
                <div className="flex items-center gap-3 text-sm text-gray-700"><Phone className="w-4 h-4 text-orange-500" /><a href={`tel:${contact.phone}`} className="hover:underline">{contact.phone}</a></div>
                <div className="flex items-center gap-3 text-sm text-gray-700"><MapPin className="w-4 h-4 text-orange-500" /><span>{contact.location}</span></div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
          <Card className="border-orange-100 shadow-sm">
            <CardHeader>
              <CardTitle className="font-serif text-2xl text-gray-900">মন্দির ও পরিচালনা পর্ষদ সহায়তা</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 text-gray-600 leading-relaxed">
              <div className="rounded-2xl bg-orange-50 p-5 border border-orange-100">
                <p className="font-medium text-gray-900 mb-2">Best for:</p>
                <p>Membership approval, committee communication, event participation, gallery issues, profile problems, and campus puja coordination.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-2xl border p-4">
                  <div className="flex items-center gap-2 mb-2 text-gray-900 font-medium"><Wrench className="w-4 h-4 text-orange-500" />Office Hours</div>
                  <p className="text-sm">Sunday to Thursday, 10:00 AM to 5:00 PM</p>
                </div>
                <div className="rounded-2xl border p-4">
                  <div className="flex items-center gap-2 mb-2 text-gray-900 font-medium"><MapPin className="w-4 h-4 text-orange-500" />Location</div>
                  <p className="text-sm">RUET campus community coordination desk</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-br from-orange-500 via-orange-400 to-amber-300 p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Code className="w-5 h-5" />
                <span className="uppercase tracking-[0.2em] text-xs font-semibold">Developer</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-28 h-28 border-4 border-white/70 shadow-lg mb-4">
                  <AvatarImage src="/dev.jpg" alt="Antu Roy Chowdhury" />
                  <AvatarFallback>ARC</AvatarFallback>
                </Avatar>
                <h2 className="font-serif text-2xl font-bold">অন্তু রায় চৌধুরী</h2>
                <p className="text-white/90 mt-2">কারিগরি ও ডিজিটাল সহায়তায়</p>
              </div>
            </div>
            <CardContent className="p-6 space-y-4">
              <p className="text-sm text-gray-600">লগইন সমস্যা, ছবি আপলোড করতে বিঘ্ন ঘটা কিংবা ওয়েবসাইটের নতুন কোনো ফিচারের অনুরোধের জন্য আমাদের ডেভেলপার টিমের সাথে যোগাযোগ করুন।</p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-orange-500" /><a href="mailto:anturoychowdhury3@gmail.com" className="text-gray-700 hover:underline">anturoychowdhury3@gmail.com</a></div>
                <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-orange-500" /><a href="tel:+8801710907476" className="text-gray-700 hover:underline">+8801710-907476</a></div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button className="flex-1" variant="outline" asChild><a href="https://anturoychowdhury.vercel.app/" target="_blank" rel="noopener noreferrer">Website</a></Button>
                <Button className="flex-1 bg-orange-500 hover:bg-orange-600" asChild><a href="mailto:anturoychowdhury3@gmail.com">Email</a></Button>
                <Button className="flex-1" variant="outline" asChild><a href="tel:+8801710907476">Call</a></Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

