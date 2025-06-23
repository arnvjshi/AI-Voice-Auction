"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  Gavel,
  Phone,
  TrendingUp,
  Users,
  Timer,
  Trophy,
  Target,
  Activity,
  BarChart3,
  Eye,
} from "lucide-react"

interface AuctionItem {
  id: string
  name: string
  description: string
  currentBid: number
  timeRemaining: number
  totalBids: number
  bidHistory: Array<{
    id: string
    amount: number
    timestamp: number
    bidder: string
  }>
  status: "active" | "ended"
}

interface AuctionStats {
  totalItems: number
  activeBids: number
  totalRevenue: number
  activeUsers: number
}

export default function Dashboard() {
  const [auctions, setAuctions] = useState<AuctionItem[]>([])
  const [stats, setStats] = useState<AuctionStats>({
    totalItems: 0,
    activeBids: 0,
    totalRevenue: 0,
    activeUsers: 0,
  })
  const [isConnected, setIsConnected] = useState(false)
  const [selectedAuction, setSelectedAuction] = useState<string | null>(null)

  useEffect(() => {
    fetchAuctions()

    // Set up real-time updates
    const eventSource = new EventSource("/api/auction/stream")

    eventSource.onopen = () => {
      setIsConnected(true)
    }

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "auction_update") {
        setAuctions(data.auctions)
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

  const fetchAuctions = async () => {
    try {
      const response = await fetch("/api/auction/list")
      const data = await response.json()
      setAuctions(data.auctions)
      setStats(data.stats)
    } catch (error) {
      console.error("Failed to fetch auctions:", error)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const activeAuctions = auctions.filter((a) => a.status === "active")
  const endedAuctions = auctions.filter((a) => a.status === "ended")

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-maroon-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Auction Dashboard</h1>
            <p className="text-lg text-gray-600">Monitor and manage live auctions in real-time</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`status-dot w-3 h-3 rounded-full ${isConnected ? "bg-green-500 online" : "bg-red-500 offline"}`}
              />
              <span className="text-sm font-medium text-gray-600">
                {isConnected ? "Live Connection" : "Disconnected"}
              </span>
            </div>

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
              className="voice-agent-button px-6 py-3 rounded-xl"
            >
              <Phone className="h-4 w-4 mr-2" />
              Voice Agent
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="neu-button w-12 h-12 rounded-xl flex items-center justify-center">
                <Gavel className="h-6 w-6 text-maroon-600" />
              </div>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">Total</Badge>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalItems}</div>
            <div className="text-sm text-gray-600">Auction Items</div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="neu-button w-12 h-12 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">Live</Badge>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.activeBids}</div>
            <div className="text-sm text-gray-600">Active Bids</div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="neu-button w-12 h-12 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Revenue</Badge>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(stats.totalRevenue)}</div>
            <div className="text-sm text-gray-600">Total Value</div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="neu-button w-12 h-12 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">Users</Badge>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.activeUsers}</div>
            <div className="text-sm text-gray-600">Active Bidders</div>
          </div>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="items" className="space-y-6">
          <TabsList className="glass-card p-1 rounded-2xl">
            <TabsTrigger
              value="items"
              className="neu-button rounded-xl px-6 py-3 data-[state=active]:neu-button-maroon data-[state=active]:text-white"
            >
              <Target className="h-4 w-4 mr-2" />
              Item Focus
            </TabsTrigger>
            <TabsTrigger
              value="bids"
              className="neu-button rounded-xl px-6 py-3 data-[state=active]:neu-button-maroon data-[state=active]:text-white"
            >
              <Activity className="h-4 w-4 mr-2" />
              Bid Focus
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="neu-button rounded-xl px-6 py-3 data-[state=active]:neu-button-maroon data-[state=active]:text-white"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Item Focus Tab */}
          <TabsContent value="items" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Active Auctions */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Active Auctions</h3>
                {activeAuctions.map((auction) => (
                  <div
                    key={auction.id}
                    className={`glass-card rounded-2xl p-6 cursor-pointer transition-all ${
                      selectedAuction === auction.id ? "ring-2 ring-maroon-500" : ""
                    }`}
                    onClick={() => setSelectedAuction(selectedAuction === auction.id ? null : auction.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">{auction.name}</h4>
                        <p className="text-gray-600 text-sm mb-3">{auction.description}</p>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Current Bid</div>
                            <div className="text-2xl font-bold text-maroon-600">
                              {formatCurrency(auction.currentBid)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                              <Timer className="h-3 w-3" />
                              Time Left
                            </div>
                            <div
                              className={`text-lg font-semibold ${
                                auction.timeRemaining < 300 ? "text-red-600" : "text-gray-900"
                              }`}
                            >
                              {formatTime(auction.timeRemaining)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Total Bids</div>
                            <div className="text-lg font-semibold text-gray-900">{auction.totalBids}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Badge className="bg-green-100 text-green-800 border-green-200">Live</Badge>
                        <Button className="neu-button-maroon px-4 py-2 rounded-xl text-sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>

                    {selectedAuction === auction.id && (
                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <h5 className="font-semibold text-gray-900 mb-3">Recent Bid History</h5>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {auction.bidHistory
                            .slice(-5)
                            .reverse()
                            .map((bid) => (
                              <div
                                key={bid.id}
                                className="flex items-center justify-between text-sm bg-gray-50 rounded-lg px-3 py-2"
                              >
                                <span className="font-medium">{formatCurrency(bid.amount)}</span>
                                <span className="text-gray-500">{bid.bidder}</span>
                                <span className="text-gray-400">{new Date(bid.timestamp).toLocaleTimeString()}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Ended Auctions Sidebar */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">Recently Ended</h3>
                {endedAuctions.map((auction) => (
                  <div key={auction.id} className="glass-card rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 text-sm">{auction.name}</h4>
                      <Badge variant="secondary">Ended</Badge>
                    </div>
                    <div className="text-lg font-bold text-maroon-600 mb-1">{formatCurrency(auction.currentBid)}</div>
                    <div className="text-xs text-gray-500">{auction.totalBids} bids</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Bid Focus Tab */}
          <TabsContent value="bids" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Live Bidding Activity */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-maroon-600" />
                  Live Bidding Activity
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {auctions
                    .flatMap((auction) =>
                      auction.bidHistory.slice(-3).map((bid) => ({
                        ...bid,
                        auctionName: auction.name,
                        auctionId: auction.id,
                      })),
                    )
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .slice(0, 10)
                    .map((bid) => (
                      <div
                        key={`${bid.auctionId}-${bid.id}`}
                        className="flex items-center justify-between p-3 bg-white/50 rounded-xl"
                      >
                        <div>
                          <div className="font-semibold text-gray-900">{formatCurrency(bid.amount)}</div>
                          <div className="text-sm text-gray-600">{bid.auctionName}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">{bid.bidder}</div>
                          <div className="text-xs text-gray-500">{new Date(bid.timestamp).toLocaleTimeString()}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Top Bidders */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Top Bidders
                </h3>
                <div className="space-y-3">
                  {Array.from(new Set(auctions.flatMap((a) => a.bidHistory.map((b) => b.bidder))))
                    .slice(0, 8)
                    .map((bidder, index) => {
                      const totalBids = auctions.flatMap((a) => a.bidHistory).filter((b) => b.bidder === bidder).length
                      const totalAmount = auctions
                        .flatMap((a) => a.bidHistory)
                        .filter((b) => b.bidder === bidder)
                        .reduce((sum, b) => sum + b.amount, 0)

                      return (
                        <div key={bidder} className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="neu-button w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{bidder}</div>
                              <div className="text-sm text-gray-600">{totalBids} bids</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-maroon-600">{formatCurrency(totalAmount)}</div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Auction Performance</h3>
                <div className="space-y-4">
                  {auctions.map((auction) => (
                    <div key={auction.id} className="p-4 bg-white/50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{auction.name}</h4>
                        <Badge
                          className={
                            auction.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }
                        >
                          {auction.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">Current Bid</div>
                          <div className="font-bold text-maroon-600">{formatCurrency(auction.currentBid)}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Total Bids</div>
                          <div className="font-bold">{auction.totalBids}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Avg Bid</div>
                          <div className="font-bold">
                            {auction.totalBids > 0 ? formatCurrency(auction.currentBid / auction.totalBids) : "$0"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">System Metrics</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-white/50 rounded-xl">
                    <div className="text-sm text-gray-500 mb-1">Connection Status</div>
                    <div className={`font-bold ${isConnected ? "text-green-600" : "text-red-600"}`}>
                      {isConnected ? "Connected" : "Disconnected"}
                    </div>
                  </div>

                  <div className="p-4 bg-white/50 rounded-xl">
                    <div className="text-sm text-gray-500 mb-1">Active Auctions</div>
                    <div className="font-bold text-gray-900">{activeAuctions.length}</div>
                  </div>

                  <div className="p-4 bg-white/50 rounded-xl">
                    <div className="text-sm text-gray-500 mb-1">Total Revenue</div>
                    <div className="font-bold text-maroon-600">{formatCurrency(stats.totalRevenue)}</div>
                  </div>

                  <div className="p-4 bg-white/50 rounded-xl">
                    <div className="text-sm text-gray-500 mb-1">Average Bid Value</div>
                    <div className="font-bold text-gray-900">
                      {stats.activeBids > 0 ? formatCurrency(stats.totalRevenue / stats.activeBids) : "$0"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
