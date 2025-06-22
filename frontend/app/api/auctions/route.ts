import { NextResponse } from "next/server"

// Mock auction data
const mockAuctions = [
  {
    id: "1",
    title: "Vintage Rolex Watch",
    description: "Rare 1960s Rolex Submariner in excellent condition",
    currentBid: 15000,
    timeRemaining: 7200, // 2 hours
    totalBids: 23,
    image: "/placeholder.svg?height=200&width=400",
    status: "active",
  },
  {
    id: "2",
    title: "Classic Ferrari Model",
    description: "1:18 scale Ferrari 250 GTO collectible model",
    currentBid: 850,
    timeRemaining: 3600, // 1 hour
    totalBids: 12,
    image: "/placeholder.svg?height=200&width=400",
    status: "ending",
  },
  {
    id: "3",
    title: "Antique Vase",
    description: "Ming Dynasty ceramic vase, authenticated",
    currentBid: 25000,
    timeRemaining: 10800, // 3 hours
    totalBids: 45,
    image: "/placeholder.svg?height=200&width=400",
    status: "active",
  },
  {
    id: "4",
    title: "Rare Baseball Card",
    description: "1952 Topps Mickey Mantle rookie card",
    currentBid: 5000,
    timeRemaining: 0,
    totalBids: 67,
    image: "/placeholder.svg?height=200&width=400",
    status: "ended",
  },
]

const mockBiddingHistory = [
  {
    id: "1",
    auctionId: "1",
    auctionTitle: "Vintage Rolex Watch",
    bidAmount: 14500,
    bidder: "User123",
    timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
    status: "outbid",
  },
  {
    id: "2",
    auctionId: "2",
    auctionTitle: "Classic Ferrari Model",
    bidAmount: 850,
    bidder: "User123",
    timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
    status: "winning",
  },
  {
    id: "3",
    auctionId: "3",
    auctionTitle: "Antique Vase",
    bidAmount: 24000,
    bidder: "User123",
    timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
    status: "outbid",
  },
]

export async function GET() {
  try {
    // Simulate real-time updates by slightly modifying data
    const updatedAuctions = mockAuctions.map((auction) => ({
      ...auction,
      timeRemaining: Math.max(0, auction.timeRemaining - Math.floor(Math.random() * 10)),
    }))

    return NextResponse.json({
      auctions: updatedAuctions,
      biddingHistory: mockBiddingHistory,
    })
  } catch (error) {
    console.error("Error in GET /api/auctions:", error)
    return NextResponse.json({ error: "Failed to fetch auction data" }, { status: 500 })
  }
}
