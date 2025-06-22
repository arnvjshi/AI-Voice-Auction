"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, DollarSign, Users, Gavel, Flame, Zap, Timer } from "lucide-react"

interface Auction {
  id: string
  title: string
  description: string
  currentBid: number
  timeRemaining: number
  totalBids: number
  image: string
  status: "active" | "ending" | "ended"
}

interface AuctionDashboardProps {
  auctions: Auction[]
  onPlaceBid: (auctionId: string, bidAmount: number) => void
}

export function AuctionDashboard({ auctions, onPlaceBid }: AuctionDashboardProps) {
  const [bidAmounts, setBidAmounts] = useState<Record<string, string>>({})

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleBidSubmit = (auctionId: string) => {
    const bidAmount = Number.parseFloat(bidAmounts[auctionId] || "0")
    if (bidAmount > 0) {
      onPlaceBid(auctionId, bidAmount)
      setBidAmounts((prev) => ({ ...prev, [auctionId]: "" }))
    }
  }

  const getStatusConfig = (status: string, timeRemaining: number) => {
    if (status === "ended") return { color: "bg-red-500", text: "ENDED", icon: Timer }
    if (timeRemaining < 300) return { color: "bg-red-500 animate-pulse", text: "ENDING SOON", icon: Flame }
    if (timeRemaining < 3600) return { color: "bg-yellow-500", text: "ENDING SOON", icon: Zap }
    return { color: "bg-green-500", text: "ACTIVE", icon: Clock }
  }

  const getTimeProgress = (timeRemaining: number) => {
    const maxTime = 10800 // 3 hours
    return Math.max(0, Math.min(100, (timeRemaining / maxTime) * 100))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Live Auctions</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
            <Flame className="h-4 w-4 mr-2 text-green-600" />
            {auctions.filter((a) => a.status === "active").length} Active
          </Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {auctions.map((auction) => {
          const statusConfig = getStatusConfig(auction.status, auction.timeRemaining)
          const timeProgress = getTimeProgress(auction.timeRemaining)

          return (
            <Card
              key={auction.id}
              className="overflow-hidden bg-gradient-to-br from-card to-muted/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
                <img
                  src={auction.image || `/placeholder.svg?height=200&width=400`}
                  alt={auction.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <Badge className={`absolute top-4 right-4 ${statusConfig.color} text-white border-0 shadow-lg`}>
                  <statusConfig.icon className="h-3 w-3 mr-1" />
                  {statusConfig.text}
                </Badge>

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between text-white mb-2">
                    <span className="text-sm font-medium">Time Remaining</span>
                    <span className="text-sm font-mono">{formatTime(auction.timeRemaining)}</span>
                  </div>
                  <Progress value={timeProgress} className="h-2 bg-white/20" />
                </div>
              </div>

              <CardHeader className="pb-4">
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{auction.title}</CardTitle>
                <CardDescription className="text-base">{auction.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-4 border border-green-200/50 dark:border-green-800/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-400">Current Bid</span>
                    </div>
                    <p className="text-2xl font-bold text-green-800 dark:text-green-300">
                      ${auction.currentBid.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Total Bids</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">{auction.totalBids}</p>
                  </div>
                </div>

                {auction.status === "active" && (
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        placeholder={`Min: $${(auction.currentBid + 1).toLocaleString()}`}
                        value={bidAmounts[auction.id] || ""}
                        onChange={(e) =>
                          setBidAmounts((prev) => ({
                            ...prev,
                            [auction.id]: e.target.value,
                          }))
                        }
                        min={auction.currentBid + 1}
                        className="flex-1 bg-background/50 border-2 focus:border-primary"
                      />
                      <Button
                        onClick={() => handleBidSubmit(auction.id)}
                        disabled={
                          !bidAmounts[auction.id] || Number.parseFloat(bidAmounts[auction.id]) <= auction.currentBid
                        }
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Gavel className="h-4 w-4 mr-2" />
                        Place Bid
                      </Button>
                    </div>

                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Next bid: ${(auction.currentBid + 1).toLocaleString()}</span>
                      <span>{auction.totalBids} bidders competing</span>
                    </div>
                  </div>
                )}

                {auction.status === "ended" && (
                  <div className="text-center py-4 bg-muted/50 rounded-lg">
                    <p className="text-lg font-semibold text-muted-foreground">Auction Ended</p>
                    <p className="text-sm">Final bid: ${auction.currentBid.toLocaleString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
