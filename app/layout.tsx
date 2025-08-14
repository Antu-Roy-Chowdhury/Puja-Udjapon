import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Open_Sans } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

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
  title: "Buddha Temple - Spiritual Community",
  description: "Join our Buddhist community for meditation, spiritual growth, and enlightenment",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${openSans.variable} antialiased`}>
      <body className="font-sans">
        <AuthProvider>
          <Navigation/>{children}
          <Toaster />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
