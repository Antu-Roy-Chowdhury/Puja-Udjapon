import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Open_Sans } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Toaster as SonnerToaster } from "sonner"
import { Toaster } from "@/components/ui/toaster"

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
})

export const metadata: Metadata = {
  title: "সার্বজনীন পূজা উদযাপন পরিষদ, রুয়েট",
  description: "Join our community for spiritual growth and service.",
  generator: "v0.app",
  icons: {
    icon: "/favicon.png",
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn" className={`${playfair.variable} ${openSans.variable} antialiased`}>
      <body className="font-sans">
        <AuthProvider>
          <Navigation />
          {children}
          <Toaster />
          <SonnerToaster />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
