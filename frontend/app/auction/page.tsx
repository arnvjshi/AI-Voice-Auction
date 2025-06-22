"use client"

import { useState, useEffect } from "react"
import { AuctionDashboard } from "@/components/auction/auction-dashboard"
import { VoiceAgent } from "@/components/auction/voice-agent"
import { BiddingHistory } from "@/components/auction/bidding-history"
import { AuctionStats } from "@/components/auction/auction-stats"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Activity, TrendingUp, Users, Zap } from "lucide-react"

export default function AuctionPage() {
  const [activeAuctions, setActiveAuctions] = useState([])
  const [biddingHistory, setBiddingHistory] = useState([])
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAuctionData()
    const interval = setInterval(fetchAuctionData, 2000)
    return () => clearInterval(interval)
  }, [])

  const fetchAuctionData = async () => {
    try {
      const response = await fetch("/api/auctions")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        throw new Error(`Expected JSON, got: ${text}`)
      }

      const data = await response.json()
      setActiveAuctions(data.auctions || [])
      setBiddingHistory(data.biddingHistory || [])
      setIsLoading(false)
    } catch (error) {
      console.error("Failed to fetch auction data:", error)
      // Set default empty data on error
      setActiveAuctions([])
      setBiddingHistory([])
      setIsLoading(false)
    }
  }

  const handleNewBid = async (auctionId: string, bidAmount: number) => {
    try {
      const response = await fetch("/api/auctions/bid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auctionId, bidAmount }),
      })

      if (response.ok) {
        fetchAuctionData()
      }
    } catch (error) {
      console.error("Failed to place bid:", error)
    }
  }

  const activeCount = activeAuctions.filter((a: any) => a.status === "active").length
  const totalBids = activeAuctions.reduce((sum: number, auction: any) => sum + auction.totalBids, 0)

  return (
    <div className="min-h-screen relative">
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="content-backdrop">
              <h1 className="text-4xl font-bold mb-2 text-hero">Live Auction Room</h1>
              <p className="text-muted-foreground text-lg">Real-time bidding with AI voice assistance</p>
            </div>

            <div className="flex items-center gap-4">
              <Badge
                variant="outline"
                className="px-4 py-2 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 glow-subtle"
              >
                <Activity className="h-4 w-4 mr-2 text-green-600" />
                {activeCount} Live Auctions
              </Badge>
              <Badge
                variant="outline"
                className="px-4 py-2 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 glow-subtle"
              >
                <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
                {totalBids} Total Bids
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Auctions", value: activeCount, icon: Activity, color: "text-green-600" },
            { label: "Total Bids", value: totalBids, icon: TrendingUp, color: "text-blue-600" },
            { label: "Online Users", value: "1.2K", icon: Users, color: "text-purple-600" },
            { label: "Avg Response", value: "<1s", icon: Zap, color: "text-yellow-600" },
          ].map((stat, index) => (
            <Card key={index} className="glass border-0 shadow-md hover:shadow-lg card-hover glow-subtle">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Auction Area */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="dashboard" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 glass p-1 rounded-xl glow-subtle">
                <TabsTrigger
                  value="dashboard"
                  className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all btn-hover"
                >
                  Live Auctions
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all btn-hover"
                >
                  Bidding History
                </TabsTrigger>
                <TabsTrigger
                  value="stats"
                  className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all btn-hover"
                >
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-6">
                <AuctionDashboard auctions={activeAuctions} onPlaceBid={handleNewBid} />
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                <BiddingHistory history={biddingHistory} />
              </TabsContent>

              <TabsContent value="stats" className="space-y-6">
                <AuctionStats auctions={activeAuctions} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Voice Agent Sidebar */}
          <div className="lg:col-span-1">
            <VoiceAgent
              isActive={isVoiceActive}
              onToggle={setIsVoiceActive}
              auctions={activeAuctions}
              onPlaceBid={handleNewBid}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
