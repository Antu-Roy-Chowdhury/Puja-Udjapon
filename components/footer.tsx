import Link from "next/link"
import { Button } from "./ui/button"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Join Community Section */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">আত্মিক শান্তির সন্ধানে আমাদের সাথে</h2>
          <p className="text-gray-400 text-sm sm:text-base font-light">
            রুয়েটের সনাতন ধর্মাবলম্বীদের পরিবারে যুক্ত হতে আজই নিবন্ধন করুন।
          </p>
          <div className="pt-2">
            <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 py-6 shadow-md">
              <Link href="/signup">আমাদের পরিবারে যোগ দিন</Link>
            </Button>
          </div>
        </div>

        {/* Footer Grid Content (Fixed Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 pb-12 border-b border-gray-800">
          
          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-semibold tracking-wide text-orange-400">যোগাযোগ</h3>
            <div className="space-y-2.5 text-gray-300 text-sm font-light leading-relaxed">
              <p className="font-medium text-gray-200">সার্বজনীন পূজা উদযাপন পরিষদ, রুয়েট</p>
              <p>Near Fitting Shop, RUET Campus</p>
              <p>Rajshahi University of Engineering & Technology, Rajshahi</p>
              <p className="pt-1">
                <span className="font-medium text-gray-400">Phone:</span>{" "}
                <a href="tel:+8801700000000" className="hover:text-orange-400 transition-colors">+880 1700 000000</a>
              </p>
              <p>
                <span className="font-medium text-gray-400">Email:</span>{" "}
                <a href="mailto:pujaudjaponruet@gmail.com" className="hover:text-orange-400 transition-colors">pujaudjaponruet@gmail.com</a>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-semibold tracking-wide text-orange-400">দ্রুত লিংক</h3>
            <div className="grid grid-cols-2 gap-2.5 text-sm">
              <Link href="/" className="text-gray-300 hover:text-orange-400 transition-colors">
                হোম (Home)
              </Link>
              <Link href="/activities" className="text-gray-300 hover:text-orange-400 transition-colors">
                আয়োজন (Activities)
              </Link>
              <Link href="/events" className="text-gray-300 hover:text-orange-400 transition-colors">
                অনুষ্ঠানমালা (Events)
              </Link>
              <Link href="/gallery" className="text-gray-300 hover:text-orange-400 transition-colors">
                গ্যালারি (Gallery)
              </Link>
              <Link href="/members" className="text-gray-300 hover:text-orange-400 transition-colors">
                সদস্যবৃন্দ (Members)
              </Link>
              <Link href="/developers" className="text-gray-300 hover:text-orange-400 transition-colors">
                ডেভেলপারগণ (Developers)
              </Link>
            </div>
          </div>

          {/* Temple / Parish Activities */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-semibold tracking-wide text-orange-400">সেবাসমূহ ও প্রার্থনা</h3>
            <div className="space-y-2.5 text-sm">
              <Link href="/activities" className="block text-gray-300 hover:text-orange-400 transition-colors">
                ধ্যান ও প্রার্থনা (Light Meditation)
              </Link>
              <Link href="/activities" className="block text-gray-300 hover:text-orange-400 transition-colors">
                সাপ্তাহিক প্রার্থনা (Weekly Prayers)
              </Link>
              <Link href="/activities" className="block text-gray-300 hover:text-orange-400 transition-colors">
                চলমান কর্মসূচি (Ongoing Programs)
              </Link>
              <Link href="/events" className="block text-gray-300 hover:text-orange-400 transition-colors">
                বিশেষ উৎসব (Special Events)
              </Link>
            </div>
          </div>

        </div>

        {/* Copyright & Developer Credit */}
        <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-gray-400 gap-4">
          <p>&copy; {currentYear} RUET Sarbojoneen Puja Udjapon Parishad. All rights reserved.</p>
          <p className="flex items-center gap-1.5 font-light">
            Developed by{" "}
            <Link 
              href="https://anturoychowdhury.me/" 
              target="_blank" 
              rel="noreferrer"
              className="text-orange-400 hover:text-orange-300 font-medium transition-colors underline underline-offset-4"
            >
              Antu Roy Chowdhury
            </Link>
          </p>
        </div>

      </div>
    </footer>
  )
}