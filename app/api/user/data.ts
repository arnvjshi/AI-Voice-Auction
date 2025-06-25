// In-memory user data store (in production, use a real database)
interface UserBid {
  id: string
  auctionId: string
  auctionName: string
  amount: number
  timestamp: number
  status: "winning" | "outbid" | "won" | "lost"
  maxBid?: number
  autoBid?: boolean
  bidder: string
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

const userBids: UserBid[] = [
  {
    id: "user-bid-1",
    auctionId: "auction-1",
    auctionName: "Vintage Oil Painting - Mountain Landscape",
    amount: 2800,
    timestamp: Date.now() - 1800000,
    status: "outbid",
    bidder: "Current User",
    autoBid: false,
  },
  {
    id: "user-bid-2",
    auctionId: "auction-2",
    auctionName: "Patek Philippe Pocket Watch - 18K Gold",
    amount: 4100,
    timestamp: Date.now() - 3600000,
    status: "outbid",
    bidder: "Current User",
    autoBid: false,
  },
]

let userWatchlist: WatchlistItem[] = [
  {
    id: "watch-1",
    auctionId: "auction-3",
    addedAt: Date.now() - 86400000,
  },
  {
    id: "watch-2",
    auctionId: "auction-5",
    addedAt: Date.now() - 172800000,
  },
]

export async function getUserBids() {
  return userBids
}

export async function getUserWatchlist() {
  return userWatchlist
}

export async function getUserStats(): Promise<UserStats> {
  const totalBids = userBids.length
  const wonAuctions = userBids.filter((bid) => bid.status === "won").length
  const watchlistItems = userWatchlist.length
  const successRate = totalBids > 0 ? Math.round((wonAuctions / totalBids) * 100) : 0
  const totalSpent = userBids.filter((bid) => bid.status === "won").reduce((sum, bid) => sum + bid.amount, 0)
  const avgBid = totalBids > 0 ? Math.round(userBids.reduce((sum, bid) => sum + bid.amount, 0) / totalBids) : 0

  return {
    totalBids,
    wonAuctions,
    watchlistItems,
    successRate,
    totalSpent,
    avgBid,
  }
}

export async function addUserBid(bid: Omit<UserBid, "id">) {
  const newBid: UserBid = {
    id: `user-bid-${Date.now()}`,
    ...bid,
  }

  userBids.push(newBid)
  return newBid
}

export async function updateBidStatus(bidId: string, status: UserBid["status"]) {
  const bidIndex = userBids.findIndex((bid) => bid.id === bidId)
  if (bidIndex !== -1) {
    userBids[bidIndex].status = status
    return userBids[bidIndex]
  }
  return null
}

export async function addToWatchlist(auctionId: string) {
  // Check if already in watchlist
  const exists = userWatchlist.some((item) => item.auctionId === auctionId)
  if (exists) {
    return { success: false, error: "Item already in watchlist" }
  }

  const newItem: WatchlistItem = {
    id: `watch-${Date.now()}`,
    auctionId,
    addedAt: Date.now(),
  }

  userWatchlist.push(newItem)
  return { success: true, watchlist: userWatchlist }
}

export async function removeFromWatchlist(auctionId: string) {
  const initialLength = userWatchlist.length
  userWatchlist = userWatchlist.filter((item) => item.auctionId !== auctionId)

  if (userWatchlist.length === initialLength) {
    return { success: false, error: "Item not found in watchlist" }
  }

  return { success: true, watchlist: userWatchlist }
}
