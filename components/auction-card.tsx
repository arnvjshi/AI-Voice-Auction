"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Timer,
  Eye,
  Gavel,
  User,
  MapPin,
  Package,
  DollarSign,
  TrendingUp,
  Heart,
  HeartOff,
  Zap,
  Target,
  Award,
  Clock,
} from "lucide-react"

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

interface UserBid {
  id: string
  auctionId: string
  auctionName: string
  amount: number
  timestamp: number
  status: "winning" | "outbid" | "won" | "lost"
  maxBid?: number
  autoBid?: boolean
}

interface AuctionCardProps {
  auction: AuctionItem
  onBidPlaced?: (auctionId: string, amount: number, isAutoBid?: boolean) => void
  isWatched?: boolean
  onToggleWatchlist?: () => void
  userBids?: UserBid[]
}

export function AuctionCard({
  auction,
  onBidPlaced,
  isWatched = false,
  onToggleWatchlist,
  userBids = [],
}: AuctionCardProps) {
  const [bidAmount, setBidAmount] = useState("")
  const [maxBidAmount, setMaxBidAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [enableAutoBid, setEnableAutoBid] = useState(false)
  const [showQuickBid, setShowQuickBid] = useState(false)

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (days > 0) return `${days}d ${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`
    if (minutes > 0) return `${minutes}m ${secs}s`
    return `${secs}s`
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const handleBidSubmit = async () => {
    const amount = Number.parseFloat(bidAmount)
    if (!amount || amount <= auction.currentBid) {
      alert(`Bid must be higher than current bid of ${formatCurrency(auction.currentBid)}`)
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/auction/bid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auctionId: auction.id,
          amount,
          bidder: "Anonymous Bidder",
          maxBid: enableAutoBid ? Number.parseFloat(maxBidAmount) : undefined,
          autoBid: enableAutoBid,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setBidAmount("")
        setMaxBidAmount("")
        onBidPlaced?.(auction.id, amount, enableAutoBid)
        alert("Bid placed successfully!")
      } else {
        alert(data.error || "Failed to place bid")
      }
    } catch (error) {
      alert("Failed to place bid")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleQuickBid = async (increment: number) => {
    const amount = auction.currentBid + increment
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/auction/bid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auctionId: auction.id,
          amount,
          bidder: "Anonymous Bidder",
        }),
      })

      const data = await response.json()
      if (data.success) {
        onBidPlaced?.(auction.id, amount)
        alert(`Quick bid of ${formatCurrency(amount)} placed!`)
      } else {
        alert(data.error || "Failed to place bid")
      }
    } catch (error) {
      alert("Failed to place bid")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getMinimumBid = () => {
    return auction.currentBid + 50 // Minimum increment of $50
  }

  const getQuickBidIncrements = () => {
    const current = auction.currentBid
    if (current < 100) return [10, 25, 50]
    if (current < 500) return [25, 50, 100]
    if (current < 1000) return [50, 100, 250]
    return [100, 250, 500]
  }

  const getUserHighestBid = () => {
    if (userBids.length === 0) return null
    return Math.max(...userBids.map((bid) => bid.amount))
  }

  const isUserWinning = () => {
    const userHighest = getUserHighestBid()
    return userHighest !== null && userHighest >= auction.currentBid
  }

  const getTimeUrgency = () => {
    if (auction.timeRemaining < 300) return "urgent" // Less than 5 minutes
    if (auction.timeRemaining < 3600) return "warning" // Less than 1 hour
    return "normal"
  }

  const timeUrgency = getTimeUrgency()
  const userHighestBid = getUserHighestBid()

  return (
    <Card className="glass-card rounded-3xl overflow-hidden interactive-card maroon-accent relative">
      {/* Watchlist Button */}
      <button
        onClick={onToggleWatchlist}
        className="absolute top-4 right-4 z-10 neu-button w-10 h-10 rounded-full flex items-center justify-center"
      >
        {isWatched ? (
          <Heart className="h-5 w-5 text-red-500 fill-current" />
        ) : (
          <HeartOff className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {/* User Bid Status */}
      {userHighestBid && (
        <div className="absolute top-4 left-4 z-10">
          <Badge className={`${isUserWinning() ? "bg-green-500 text-white" : "bg-red-500 text-white"} border-0`}>
            {isUserWinning() ? (
              <>
                <Award className="h-3 w-3 mr-1" />
                Winning
              </>
            ) : (
              <>
                <Target className="h-3 w-3 mr-1" />
                Outbid
              </>
            )}
          </Badge>
        </div>
      )}

      {/* Image Section */}
      <div className="relative aspect-video bg-gradient-to-br from-maroon-100 to-maroon-200">
        <Image
          src={auction.image || "/placeholder.svg"}
          alt={auction.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Status Badges */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          <Badge className={`${auction.status === "active" ? "bg-green-500" : "bg-gray-500"} text-white border-0`}>
            {auction.status === "active" ? (
              <>
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                Live
              </>
            ) : (
              "Ended"
            )}
          </Badge>
          <Badge className="bg-maroon-600 text-white border-0">{auction.category}</Badge>
        </div>

        {/* Time Urgency Indicator */}
        {auction.status === "active" && timeUrgency === "urgent" && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold animate-pulse">
              <Clock className="h-4 w-4 inline mr-2" />
              ENDING SOON!
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-maroon-800 mb-2">{auction.name}</h3>
          <p className="text-maroon-600 text-sm line-clamp-2">{auction.description}</p>
        </div>

        {/* Bid Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-maroon-500 mb-1 font-medium">Current Bid</div>
            <div className="text-2xl font-bold text-maroon-700">{formatCurrency(auction.currentBid)}</div>
            {userHighestBid && <div className="text-xs text-gray-500">Your bid: {formatCurrency(userHighestBid)}</div>}
          </div>
          <div>
            <div className="text-xs text-maroon-500 mb-1 flex items-center gap-1 font-medium">
              <Timer className="h-3 w-3" />
              {auction.status === "active" ? "Time Left" : "Ended"}
            </div>
            <div
              className={`text-lg font-semibold ${
                auction.status === "active" && timeUrgency === "urgent"
                  ? "text-red-600 animate-pulse"
                  : timeUrgency === "warning"
                    ? "text-orange-600"
                    : "text-maroon-700"
              }`}
            >
              {auction.status === "active" ? formatTime(auction.timeRemaining) : "Auction Ended"}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-between text-sm text-maroon-600">
          <span className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            {auction.totalBids} bids
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            Starting: {formatCurrency(auction.startingBid)}
          </span>
        </div>

        {/* Quick Bid Buttons */}
        {auction.status === "active" && (
          <div className="space-y-3">
            <div className="flex gap-2">
              {getQuickBidIncrements().map((increment) => (
                <Button
                  key={increment}
                  onClick={() => handleQuickBid(increment)}
                  disabled={isSubmitting}
                  className="flex-1 neu-button rounded-lg text-sm py-2 text-black"
                >
                  +{formatCurrency(increment)}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-maroon-200">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex-1 neu-button rounded-xl flex items-center gap-2 text-maroon-700">
                <Eye className="h-4 w-4" />
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-maroon-800">{auction.name}</DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Image Gallery */}
                <div className="space-y-4">
                  <div className="aspect-video relative rounded-xl overflow-hidden">
                    <Image
                      src={auction.images[selectedImageIndex] || "/placeholder.svg"}
                      alt={auction.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto">
                    {auction.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          selectedImageIndex === index ? "border-maroon-500" : "border-gray-200"
                        }`}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${auction.name} ${index + 1}`}
                          width={80}
                          height={80}
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auction Details */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-maroon-800 mb-2">Description</h4>
                    <p className="text-maroon-600">{auction.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-maroon-800 mb-2">Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-maroon-600">Year:</span>
                          <span className="text-maroon-800">{auction.year}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-maroon-600">Condition:</span>
                          <span className="text-maroon-800">{auction.condition}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-maroon-600">Dimensions:</span>
                          <span className="text-maroon-800">{auction.dimensions}</span>
                        </div>
                        {auction.artist && (
                          <div className="flex justify-between">
                            <span className="text-maroon-600">Artist:</span>
                            <span className="text-maroon-800">{auction.artist}</span>
                          </div>
                        )}
                        {auction.brand && (
                          <div className="flex justify-between">
                            <span className="text-maroon-600">Brand:</span>
                            <span className="text-maroon-800">{auction.brand}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-maroon-800 mb-2">Seller Info</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-maroon-500" />
                          <span className="text-maroon-800">{auction.seller}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-maroon-500" />
                          <span className="text-maroon-800">{auction.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-maroon-500" />
                          <span className="text-maroon-800">{auction.shippingInfo}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Advanced Bidding Section */}
                  {auction.status === "active" && (
                    <div className="glass-card rounded-2xl p-4 maroon-accent">
                      <h4 className="font-semibold text-maroon-800 mb-3">Place Your Bid</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-maroon-600">Current Bid:</span>
                          <span className="font-bold text-maroon-800">{formatCurrency(auction.currentBid)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-maroon-600">Minimum Bid:</span>
                          <span className="font-bold text-maroon-800">{formatCurrency(getMinimumBid())}</span>
                        </div>

                        {/* Manual Bid */}
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              placeholder={`Min: ${getMinimumBid()}`}
                              value={bidAmount}
                              onChange={(e) => setBidAmount(e.target.value)}
                              min={getMinimumBid()}
                              step="50"
                              className="flex-1"
                            />
                            <Button
                              onClick={handleBidSubmit}
                              disabled={isSubmitting || !bidAmount}
                              className="neu-button-maroon px-6"
                            >
                              {isSubmitting ? "Placing..." : "Bid"}
                            </Button>
                          </div>

                          {/* Auto-Bid Option */}
                          <div className="border-t pt-3">
                            <div className="flex items-center space-x-2 mb-3">
                              <Checkbox id="auto-bid" checked={enableAutoBid} onCheckedChange={setEnableAutoBid} />
                              <label htmlFor="auto-bid" className="text-sm font-medium flex items-center gap-2">
                                <Zap className="h-4 w-4 text-yellow-500" />
                                Enable Auto-Bidding
                              </label>
                            </div>

                            {enableAutoBid && (
                              <div className="space-y-2">
                                <Input
                                  type="number"
                                  placeholder="Maximum bid amount"
                                  value={maxBidAmount}
                                  onChange={(e) => setMaxBidAmount(e.target.value)}
                                  className="w-full"
                                />
                                <p className="text-xs text-gray-600">
                                  We'll automatically bid up to this amount to keep you in the lead
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bid History */}
                  <div>
                    <h4 className="font-semibold text-maroon-800 mb-3">Recent Bids</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {auction.bidHistory
                        .slice(-5)
                        .reverse()
                        .map((bid) => (
                          <div key={bid.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Image
                                src={bid.bidderAvatar || "/placeholder.svg"}
                                alt={bid.bidder}
                                width={32}
                                height={32}
                                className="rounded-full"
                              />
                              <div>
                                <div className="font-medium text-maroon-800">{bid.bidder}</div>
                                <div className="text-xs text-maroon-500">
                                  {new Date(bid.timestamp).toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <div className="font-bold text-maroon-700">{formatCurrency(bid.amount)}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {auction.status === "active" && (
            <Button
              onClick={() => setShowQuickBid(!showQuickBid)}
              className="neu-button-maroon px-6 rounded-xl flex items-center gap-2"
            >
              <Gavel className="h-4 w-4" />
              Quick Bid
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
