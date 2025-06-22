"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Gavel, Home, Sparkles } from "lucide-react"
import { usePathname } from "next/navigation"

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative">
            <Gavel className="h-7 w-7 text-primary transition-transform group-hover:rotate-12" />
            <Sparkles className="h-3 w-3 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            VoiceAuction Pro
          </span>
        </Link>

        <nav className="flex items-center space-x-2">
          <Link href="/">
            <Button
              variant={pathname === "/" ? "default" : "ghost"}
              size="sm"
              className="transition-all hover:scale-105"
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
          <Link href="/auction">
            <Button
              variant={pathname === "/auction" ? "default" : "ghost"}
              size="sm"
              className="transition-all hover:scale-105"
            >
              <Gavel className="h-4 w-4 mr-2" />
              Live Auctions
            </Button>
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
