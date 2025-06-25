"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { AuctionCard } from "@/components/auction-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Filter,
  Heart,
  Gavel,
  TrendingUp,
  Clock,
  DollarSign,
  Bell,
  Settings,
  Target,
  Activity,
  Trophy,
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

interface WatchlistItem {
  id: string
  auctionId: string
  addedAt: number
}

interface UserStats {
  totalBids: number
  wonAuctions: number
  watchlistItems: number
  successRate: number
  totalSpent: number
  avgBid: number
}

export default function BiddingDashboard() {
  const [auctions, setAuctions] = useState<AuctionItem[]>([])
  const [filteredAuctions, setFilteredAuctions] = useState<AuctionItem[]>([])
  const [userBids, setUserBids] = useState<UserBid[]>([])
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [userStats, setUserStats] = useState<UserStats>({
    totalBids: 0,
    wonAuctions: 0,
    watchlistItems: 0,
    successRate: 0,
    totalSpent: 0,
    avgBid: 0,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("ending-soon")
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [showFilters, setShowFilters] = useState(false)
  const [autoBidSettings, setAutoBidSettings] = useState({
    enabled: false,
    maxIncrease: 50,
    stopAt: 1000,
  })
  const [loading, setLoading] = useState(true)

  const [notifications, setNotifications] = useState([
    {
      id: "notif-1",
      type: "outbid" as const,
      title: "Outbid Alert",
      message: 'You have been outbid on "Vintage Oil Painting - Mountain Landscape"',
      timestamp: Date.now() - 300000,
      read: false,
      auctionId: "auction-1",
      urgent: true,
    },
  ])

  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    fetchInitialData()
  }, [])

  useEffect(() => {
    filterAndSortAuctions()
  }, [auctions, searchTerm, selectedCategory, sortBy, priceRange])

  const fetchInitialData = async () => {
    setLoading(true)
    try {
      // Fetch auctions
      const auctionsResponse = await fetch("/api/auction/list")
      const auctionsData = await auctionsResponse.json()
      setAuctions(auctionsData.auctions)

      // Fetch user data
      const userResponse = await fetch("/api/user/bids")
      const userData = await userResponse.json()
      setUserBids(userData.bids)
      setWatchlist(userData.watchlist)
      setUserStats(userData.stats)
    } catch (error) {
      console.error("Failed to fetch initial data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortAuctions = () => {
    const filtered = auctions.filter((auction) => {
      const matchesSearch =
        auction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        auction.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || auction.category.toLowerCase() === selectedCategory
      const matchesPrice =
        (!priceRange.min || auction.currentBid >= Number.parseFloat(priceRange.min)) &&
        (!priceRange.max || auction.currentBid <= Number.parseFloat(priceRange.max))

      return matchesSearch && matchesCategory && matchesPrice
    })

    // Sort auctions
    switch (sortBy) {
      case "ending-soon":
        filtered.sort((a, b) => a.timeRemaining - b.timeRemaining)
        break
      case "price-low":
        filtered.sort((a, b) => a.currentBid - b.currentBid)
        break
      case "price-high":
        filtered.sort((a, b) => b.currentBid - a.currentBid)
        break
      case "most-bids":
        filtered.sort((a, b) => b.totalBids - a.totalBids)
        break
      case "newest":
        filtered.sort((a, b) => b.timeRemaining - a.timeRemaining)
        break
    }

    setFilteredAuctions(filtered)
  }

  const handleBidPlaced = async (auctionId: string, amount: number, isAutoBid = false) => {
    try {
      const response = await fetch("/api/auction/bid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auctionId,
          amount,
          bidder: "Current User",
          maxBid: isAutoBid ? autoBidSettings.stopAt : undefined,
          autoBid: isAutoBid,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Refresh data after successful bid
        await fetchInitialData()

        // Show success notification
        const newNotification = {
          id: `notif-${Date.now()}`,
          type: "winning" as const,
          title: "Bid Placed Successfully",
          message: `Your bid of $${amount} has been placed on "${data.auction.name}"`,
          timestamp: Date.now(),
          read: false,
          auctionId,
          urgent: false,
        }
        setNotifications((prev) => [newNotification, ...prev])
      } else {
        alert(data.error || "Failed to place bid")
      }
    } catch (error) {
      console.error("Failed to place bid:", error)
      alert("Failed to place bid. Please try again.")
    }
  }

  const toggleWatchlist = async (auctionId: string) => {
    const isWatched = watchlist.some((item) => item.auctionId === auctionId)
    const action = isWatched ? "remove" : "add"

    try {
      const response = await fetch("/api/user/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auctionId, action }),
      })

      const data = await response.json()

      if (data.success) {
        setWatchlist(data.watchlist)
        // Update stats
        setUserStats((prev) => ({
          ...prev,
          watchlistItems: data.watchlist.length,
        }))
      } else {
        alert(data.error || "Failed to update watchlist")
      }
    } catch (error) {
      console.error("Failed to update watchlist:", error)
      alert("Failed to update watchlist. Please try again.")
    }
  }

  const isWatched = (auctionId: string) => {
    return watchlist.some((item) => item.auctionId === auctionId)
  }

  const getUserBidsForAuction = (auctionId: string) => {
    return userBids.filter((bid) => bid.auctionId === auctionId)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const categories = ["all", "art", "watches", "books", "musical instruments", "jewelry", "collectibles"]
  const activeAuctions = filteredAuctions.filter((a) => a.status === "active")
  const watchedAuctions = auctions.filter((a) => isWatched(a.id))
  const myBiddingAuctions = auctions.filter((a) => getUserBidsForAuction(a.id).length > 0)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "outbid":
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case "winning":
        return <Trophy className="h-4 w-4 text-green-500" />
      case "ending":
        return <Clock className="h-4 w-4 text-orange-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-maroon-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading auction data...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-maroon-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Bidding Dashboard</h1>
            <p className="text-lg text-gray-600">Manage your bids, watchlist, and auction activity</p>
          </div>

          <div className="flex items-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="neu-button px-6 py-3 rounded-xl flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Auto-Bid Settings
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Auto-Bidding Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="auto-bid"
                      checked={autoBidSettings.enabled}
                      onCheckedChange={(checked) =>
                        setAutoBidSettings((prev) => ({ ...prev, enabled: checked as boolean }))
                      }
                    />
                    <label htmlFor="auto-bid" className="text-sm font-medium">
                      Enable Auto-Bidding
                    </label>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Maximum Bid Increase</label>
                    <Input
                      type="number"
                      value={autoBidSettings.maxIncrease}
                      onChange={(e) =>
                        setAutoBidSettings((prev) => ({ ...prev, maxIncrease: Number.parseInt(e.target.value) }))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Stop Bidding At</label>
                    <Input
                      type="number"
                      value={autoBidSettings.stopAt}
                      onChange={(e) =>
                        setAutoBidSettings((prev) => ({ ...prev, stopAt: Number.parseInt(e.target.value) }))
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <div className="relative">
              <Button
                onClick={() => setShowNotifications(!showNotifications)}
                className="neu-button-maroon px-6 py-3 rounded-xl flex items-center gap-2 relative"
              >
                <Bell className="h-4 w-4" />
                Notifications
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </Button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 glass-card rounded-xl p-4 z-50">
                  <h3 className="font-semibold text-gray-900 mb-3">Recent Notifications</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg border ${notification.read ? "bg-gray-50" : "bg-white border-maroon-200"}`}
                      >
                        <div className="flex items-start gap-3">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notification.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-maroon-600">{userStats.totalBids}</div>
            <div className="text-xs text-gray-600">Total Bids</div>
          </Card>
          <Card className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{userStats.wonAuctions}</div>
            <div className="text-xs text-gray-600">Won Auctions</div>
          </Card>
          <Card className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{userStats.watchlistItems}</div>
            <div className="text-xs text-gray-600">Watching</div>
          </Card>
          <Card className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{userStats.successRate}%</div>
            <div className="text-xs text-gray-600">Success Rate</div>
          </Card>
          <Card className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(userStats.totalSpent)}</div>
            <div className="text-xs text-gray-600">Total Spent</div>
          </Card>
          <Card className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{formatCurrency(userStats.avgBid)}</div>
            <div className="text-xs text-gray-600">Avg Bid</div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search auctions by name, artist, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 rounded-xl border-2 border-gray-200 focus:border-maroon-400"
              />
            </div>

            <div className="flex gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 h-12 rounded-xl border-2 border-gray-200">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 h-12 rounded-xl border-2 border-gray-200">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ending-soon">Ending Soon</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="most-bids">Most Bids</SelectItem>
                  <SelectItem value="newest">Newly Listed</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-12 px-6 rounded-xl border-2 border-gray-200"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Price Range</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
                      type="number"
                    />
                    <Input
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
                      type="number"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Condition</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mint">Mint</SelectItem>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="very-good">Very Good</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Time Remaining</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">Less than 1 hour</SelectItem>
                      <SelectItem value="6h">Less than 6 hours</SelectItem>
                      <SelectItem value="24h">Less than 24 hours</SelectItem>
                      <SelectItem value="7d">Less than 7 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="all-auctions" className="space-y-6">
          <TabsList className="glass-card p-1 rounded-2xl">
            <TabsTrigger
              value="all-auctions"
              className="neu-button rounded-xl px-6 py-3 data-[state=active]:neu-button-maroon data-[state=active]:text-white"
            >
              <Gavel className="h-4 w-4 mr-2" />
              All Auctions ({activeAuctions.length})
            </TabsTrigger>
            <TabsTrigger
              value="my-bids"
              className="neu-button rounded-xl px-6 py-3 data-[state=active]:neu-button-maroon data-[state=active]:text-white"
            >
              <Target className="h-4 w-4 mr-2" />
              My Bids ({myBiddingAuctions.length})
            </TabsTrigger>
            <TabsTrigger
              value="watchlist"
              className="neu-button rounded-xl px-6 py-3 data-[state=active]:neu-button-maroon data-[state=active]:text-white"
            >
              <Heart className="h-4 w-4 mr-2" />
              Watchlist ({watchedAuctions.length})
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="neu-button rounded-xl px-6 py-3 data-[state=active]:neu-button-maroon data-[state=active]:text-white"
            >
              <Activity className="h-4 w-4 mr-2" />
              Activity
            </TabsTrigger>
          </TabsList>

          {/* All Auctions Tab */}
          <TabsContent value="all-auctions" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Live Auctions ({activeAuctions.length})</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                Updated every 30 seconds
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeAuctions.map((auction) => (
                <div key={auction.id} className="relative">
                  <AuctionCard
                    auction={auction}
                    onBidPlaced={handleBidPlaced}
                    isWatched={isWatched(auction.id)}
                    onToggleWatchlist={() => toggleWatchlist(auction.id)}
                    userBids={getUserBidsForAuction(auction.id)}
                  />
                </div>
              ))}
            </div>

            {activeAuctions.length === 0 && (
              <div className="text-center py-12">
                <Gavel className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No auctions found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or filters</p>
              </div>
            )}
          </TabsContent>

          {/* My Bids Tab */}
          <TabsContent value="my-bids" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Active Bids</h3>
                <div className="space-y-4">
                  {myBiddingAuctions.map((auction) => {
                    const userAuctionBids = getUserBidsForAuction(auction.id)
                    const highestUserBid = Math.max(...userAuctionBids.map((b) => b.amount))
                    const isWinning = highestUserBid >= auction.currentBid

                    return (
                      <Card key={auction.id} className="glass-card rounded-2xl p-6">
                        <div className="flex items-start gap-4">
                          <img
                            src={auction.image || "/placeholder.svg"}
                            alt={auction.name}
                            className="w-24 h-24 object-cover rounded-xl"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="text-lg font-bold text-gray-900">{auction.name}</h4>
                              <Badge
                                className={`${isWinning ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                              >
                                {isWinning ? "Winning" : "Outbid"}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-4 gap-4 text-sm">
                              <div>
                                <div className="text-gray-500">Your Bid</div>
                                <div className="font-bold text-maroon-600">{formatCurrency(highestUserBid)}</div>
                              </div>
                              <div>
                                <div className="text-gray-500">Current Bid</div>
                                <div className="font-bold">{formatCurrency(auction.currentBid)}</div>
                              </div>
                              <div>
                                <div className="text-gray-500">Time Left</div>
                                <div className="font-bold">{formatTime(auction.timeRemaining)}</div>
                              </div>
                              <div>
                                <div className="text-gray-500">Total Bids</div>
                                <div className="font-bold">{auction.totalBids}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Bidding Summary</h3>
                <div className="space-y-4">
                  <Card className="glass-card rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span className="font-semibold">Winning Bids</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {
                        myBiddingAuctions.filter((a) => {
                          const userBids = getUserBidsForAuction(a.id)
                          const highestBid = Math.max(...userBids.map((b) => b.amount))
                          return highestBid >= a.currentBid
                        }).length
                      }
                    </div>
                  </Card>

                  <Card className="glass-card rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Target className="h-5 w-5 text-maroon-600" />
                      <span className="font-semibold">Total Active</span>
                    </div>
                    <div className="text-2xl font-bold text-maroon-600">{myBiddingAuctions.length}</div>
                  </Card>

                  <Card className="glass-card rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold">Total Committed</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(
                        myBiddingAuctions.reduce((sum, auction) => {
                          const userBids = getUserBidsForAuction(auction.id)
                          return sum + Math.max(...userBids.map((b) => b.amount))
                        }, 0),
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Watchlist Tab */}
          <TabsContent value="watchlist" className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Watchlist ({watchedAuctions.length})</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {watchedAuctions.map((auction) => (
                <AuctionCard
                  key={auction.id}
                  auction={auction}
                  onBidPlaced={handleBidPlaced}
                  isWatched={true}
                  onToggleWatchlist={() => toggleWatchlist(auction.id)}
                  userBids={getUserBidsForAuction(auction.id)}
                />
              ))}
            </div>

            {watchedAuctions.length === 0 && (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No items in watchlist</h3>
                <p className="text-gray-500">Add items to your watchlist to track them here</p>
              </div>
            )}
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Recent Activity</h3>

            <div className="space-y-4">
              {userBids
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, 20)
                .map((bid) => (
                  <Card key={bid.id} className="glass-card rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            bid.status === "winning"
                              ? "bg-green-500"
                              : bid.status === "outbid"
                                ? "bg-red-500"
                                : bid.status === "won"
                                  ? "bg-blue-500"
                                  : "bg-gray-500"
                          }`}
                        />
                        <div>
                          <div className="font-semibold">{bid.auctionName}</div>
                          <div className="text-sm text-gray-600">
                            Bid placed: {formatCurrency(bid.amount)}
                            {bid.autoBid && <Badge className="ml-2 bg-purple-100 text-purple-800">Auto</Badge>}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">{new Date(bid.timestamp).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-400">{new Date(bid.timestamp).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
