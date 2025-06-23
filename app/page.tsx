"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { ThreeBackground } from "@/components/three-background"
import { AuctionCard } from "@/components/auction-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Gavel, Bot, TrendingUp, Users, ArrowRight, Sparkles, Trophy, Zap } from "lucide-react"

interface AuctionItem {
  id: string
  name: string
  description: string
  currentBid: number
  timeRemaining: number
  totalBids: number
  startingBid: number
  reservePrice: number
  category: string
  condition: string
  dimensions: string
  year: string
  artist?: string
  brand?: string
  image: string
  images: string[]
  bidHistory: Array<{
    id: string
    amount: number
    timestamp: number
    bidder: string
    bidderAvatar: string
  }>
  status: "active" | "ended"
  seller: string
  location: string
  shippingInfo: string
}

interface AuctionStats {
  totalItems: number
  activeBids: number
  totalRevenue: number
  activeUsers: number
}

export default function HomePage() {
  const [featuredAuctions, setFeaturedAuctions] = useState<AuctionItem[]>([])
  const [stats, setStats] = useState<AuctionStats>({
    totalItems: 0,
    activeBids: 0,
    totalRevenue: 0,
    activeUsers: 0,
  })
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    fetchFeaturedAuctions()

    // Set up real-time updates
    const eventSource = new EventSource("/api/auction/stream")

    eventSource.onopen = () => {
      setIsConnected(true)
    }

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "auction_update") {
        setFeaturedAuctions(data.auctions.filter((a: AuctionItem) => a.status === "active").slice(0, 3))
        setStats(data.stats)
      }
    }

    eventSource.onerror = () => {
      setIsConnected(false)
    }

    return () => {
      eventSource.close()
    }
  }, [])

  const fetchFeaturedAuctions = async () => {
    try {
      const response = await fetch("/api/auction/list")
      const data = await response.json()
      setFeaturedAuctions(data.auctions.filter((a: AuctionItem) => a.status === "active").slice(0, 3))
      setStats(data.stats)
    } catch (error) {
      console.error("Failed to fetch auctions:", error)
    }
  }

  const handleBidPlaced = (auctionId: string, amount: number) => {
    // Refresh auction data after bid is placed
    fetchFeaturedAuctions()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-maroon-50 via-white to-maroon-100 relative overflow-hidden">
      <ThreeBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            {/* Status Indicator */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div
                className={`status-dot w-4 h-4 rounded-full ${isConnected ? "bg-green-500 online" : "bg-maroon-500 offline"}`}
              />
              <span className="text-sm font-medium text-maroon-700">
                {isConnected ? "Live Auctions Active" : "Connecting..."}
              </span>
              <Badge className="bg-maroon-100 text-maroon-800 border-maroon-200">
                <Zap className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
            </div>

            <div className="float-animation">
              <h1 className="text-6xl md:text-8xl font-bold gradient-text mb-6 leading-tight">
                Voice-Powered
                <br />
                <span className="text-maroon-600">Auction House</span>
              </h1>
            </div>

            <p className="text-xl text-maroon-700 max-w-3xl mx-auto leading-relaxed font-medium">
              Experience the future of auctions with our AI-powered voice agent. Bid on premium items using natural
              voice commands in real-time with OmniDimension technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
              <Button
                onClick={() => {
                  // Trigger OmniDimension widget
                  if (typeof window !== "undefined" && (window as any).OmniDimensionWidget) {
                    ;(window as any).OmniDimensionWidget.open()
                  } else {
                    // Fallback - try to find and click the widget
                    const widget =
                      document.querySelector("[data-omnidimension-widget]") ||
                      document.querySelector(".omnidimension-widget") ||
                      document.querySelector("#omnidimension-widget")
                    if (widget) {
                      ;(widget as HTMLElement).click()
                    } else {
                      alert("Voice Agent is initializing... Please try again in a moment.")
                    }
                  }
                }}
                className="voice-agent-button px-10 py-5 text-xl rounded-2xl flex items-center gap-3"
              >
                <Bot className="h-6 w-6" />
                Try Voice Bidding
                <Sparkles className="h-5 w-5" />
              </Button>
              <Link href="/dashboard">
                <Button className="neu-button px-10 py-5 text-xl rounded-2xl flex items-center gap-3 text-maroon-700 border-2 border-maroon-200">
                  View Dashboard
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Enhanced Floating Elements */}
        <div className="absolute top-20 left-10 opacity-30">
          <Gavel className="h-20 w-20 text-maroon-400 float-animation" style={{ animationDelay: "1s" }} />
        </div>
        <div className="absolute top-40 right-20 opacity-25">
          <Sparkles className="h-16 w-16 text-maroon-300 float-slow" style={{ animationDelay: "2s" }} />
        </div>
        <div className="absolute bottom-20 left-20 opacity-35">
          <Trophy className="h-18 w-18 text-maroon-500 float-fast" style={{ animationDelay: "3s" }} />
        </div>
        <div className="absolute top-60 right-40 opacity-20">
          <Bot className="h-14 w-14 text-maroon-400 float-animation" style={{ animationDelay: "4s" }} />
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-16 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="glass-card rounded-2xl p-8 text-center interactive-card maroon-accent">
              <div className="neu-button w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Gavel className="h-8 w-8 text-maroon-600" />
              </div>
              <div className="text-4xl font-bold text-maroon-800 mb-2">{stats.totalItems}</div>
              <div className="text-sm text-maroon-600 font-medium">Premium Items</div>
            </div>

            <div className="glass-card rounded-2xl p-8 text-center interactive-card maroon-accent">
              <div className="neu-button w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-4xl font-bold text-maroon-800 mb-2">{stats.activeBids}</div>
              <div className="text-sm text-maroon-600 font-medium">Active Bids</div>
            </div>

            <div className="glass-card rounded-2xl p-8 text-center interactive-card maroon-accent">
              <div className="neu-button w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="text-4xl font-bold text-maroon-800 mb-2">{formatCurrency(stats.totalRevenue)}</div>
              <div className="text-sm text-maroon-600 font-medium">Total Value</div>
            </div>

            <div className="glass-card rounded-2xl p-8 text-center interactive-card maroon-accent">
              <div className="neu-button w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-4xl font-bold text-maroon-800 mb-2">{stats.activeUsers}</div>
              <div className="text-sm text-maroon-600 font-medium">Active Bidders</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Auctions */}
      <section className="py-16 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold gradient-text mb-6">Featured Auctions</h2>
            <p className="text-xl text-maroon-700 font-medium">Premium items available for AI-powered voice bidding</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} onBidPlaced={handleBidPlaced} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/dashboard">
              <Button className="neu-button px-10 py-4 text-xl rounded-2xl flex items-center gap-3 text-maroon-700 border-2 border-maroon-300">
                View All Auctions
                <ArrowRight className="h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Voice Agent CTA */}
      <section className="py-20 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl p-12 text-center maroon-accent maroon-glow">
            <div className="neu-button w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Bot className="h-12 w-12 text-maroon-600" />
            </div>

            <h2 className="text-4xl font-bold gradient-text mb-6">Ready for AI-Powered Bidding?</h2>

            <p className="text-xl text-maroon-700 mb-8 max-w-2xl mx-auto font-medium leading-relaxed">
              Our advanced OmniDimension AI agent is ready to help you participate in live auctions. Experience the
              future of voice-controlled bidding with natural language processing.
            </p>

            <div className="space-y-6">
              <Button className="neu-button-maroon px-12 py-5 text-2xl rounded-2xl maroon-glow">
                <Bot className="h-7 w-7 mr-3" />
                Try Voice Bidding Now
                <Sparkles className="h-6 w-6 ml-3" />
              </Button>

              <div className="text-sm text-maroon-600 font-medium">
                Available 24/7 • Instant AI Processing • Real-time Voice Recognition
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
