import Link from "next/link"
import { Button } from "./ui/button"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Join Community Section */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-bold mb-4">You Join Our Community?</h2>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="/signup">JOIN US</Link>
          </Button>
        </div>

        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-xl font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-gray-300">
              <p>Near Fitting Shop</p>
              <p>Rajshahi University of Engineering & Technology, Rajshahi</p>
              <p>Phone: +1 234 567 8900</p>
              <p>Email: info@sarbojononinpuja.com</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-xl font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-gray-300 hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/activities" className="block text-gray-300 hover:text-primary transition-colors">
                Activities
              </Link>
              <Link href="/events" className="block text-gray-300 hover:text-primary transition-colors">
                Events
              </Link>
              <Link href="/gallery" className="block text-gray-300 hover:text-primary transition-colors">
                Gallery
              </Link>
              <Link href="/members" className="block text-gray-300 hover:text-primary transition-colors">
                Members
              </Link>
            </div>
          </div>

          {/* Temple Activities */}
          <div>
            <h3 className="font-serif text-xl font-semibold mb-4">Temple Activities</h3>
            <div className="space-y-2">
              <Link href="/activities/meditation" className="block text-gray-300 hover:text-primary transition-colors">
                Light Meditation
              </Link>
              <Link href="/activities/courses" className="block text-gray-300 hover:text-primary transition-colors">
                Weekly Prayers
              </Link>
              <Link href="/activities/programs" className="block text-gray-300 hover:text-primary transition-colors">
                Ongoing Programs
              </Link>
              <Link href="/events" className="block text-gray-300 hover:text-primary transition-colors">
                Special Events
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 RUET Temple. All rights reserved.</p>
          <p>Developed by <span className="text-primary/80"><Link href="https://anturoychowdhury.vercel.app/" target="_blank" className="hover: hover:text-primary text-shadow-md transition-colors">Antu Roy Chowdhury </Link></span> </p>
        </div>
      </div>
    </footer>
  )
}
