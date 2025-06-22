import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VoiceAuction Pro - AI-Powered Auction Platform",
  description: "Revolutionary voice-enabled auction platform with real-time bidding and AI assistance",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Subtle Animated Background Elements */}
            <div className="fixed inset-0 z-0">
              {/* Primary gradient background - very subtle */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 dark:from-blue-950/20 dark:via-purple-950/15 dark:to-pink-950/20" />

              {/* Floating geometric shapes - much more subtle */}
              <div
                className="floating-element top-20 left-20 floating-circle animate-float"
                style={{ animationDelay: "0s" }}
              />
              <div
                className="floating-element top-1/3 right-32 floating-square animate-float"
                style={{ animationDelay: "3s" }}
              />
              <div
                className="floating-element bottom-1/3 left-1/4 floating-circle animate-float"
                style={{ animationDelay: "6s" }}
              />
              <div
                className="floating-element bottom-32 right-20 floating-square animate-float"
                style={{ animationDelay: "2s" }}
              />

              {/* Sparkle effects - very subtle */}
              <div
                className="floating-element top-1/4 left-1/3 sparkle-element animate-sparkle"
                style={{ animationDelay: "0s" }}
              />
              <div
                className="floating-element top-2/3 right-1/3 sparkle-element animate-sparkle"
                style={{ animationDelay: "2s" }}
              />
              <div
                className="floating-element bottom-1/4 left-2/3 sparkle-element animate-sparkle"
                style={{ animationDelay: "4s" }}
              />

              {/* Pattern overlays - very subtle */}
              <div className="absolute inset-0 bg-dots-pattern opacity-50" />

              {/* Gradient orbs - much more subtle */}
              <div
                className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/5 to-purple-600/5 rounded-full blur-3xl animate-pulse-gentle"
                style={{ animationDelay: "0s" }}
              />
              <div
                className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-pink-400/5 to-orange-600/5 rounded-full blur-3xl animate-pulse-gentle"
                style={{ animationDelay: "3s" }}
              />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
