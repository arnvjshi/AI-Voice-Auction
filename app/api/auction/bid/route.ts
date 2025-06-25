import { type NextRequest, NextResponse } from "next/server"
import { placeBid, getAuctionById } from "../data"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { auctionId, amount, bidder = "Anonymous User", maxBid, autoBid = false } = body

    // Validate required fields
    if (!auctionId || !amount) {
      return NextResponse.json({ error: "Missing required fields: auctionId and amount" }, { status: 400 })
    }

    // Get current auction data
    const auction = await getAuctionById(auctionId)
    if (!auction) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 })
    }

    // Check if auction is still active
    if (auction.status !== "active" || auction.timeRemaining <= 0) {
      return NextResponse.json({ error: "Auction has ended" }, { status: 400 })
    }

    // Validate bid amount
    const bidAmount = Number.parseFloat(amount)
    if (isNaN(bidAmount) || bidAmount <= auction.currentBid) {
      return NextResponse.json(
        {
          error: `Bid must be higher than current bid of $${auction.currentBid}`,
          currentBid: auction.currentBid,
          minimumBid: auction.currentBid + 50, // Minimum increment of $50
        },
        { status: 400 },
      )
    }

    // Place the bid
    const result = await placeBid(auctionId, bidAmount, bidder, {
      maxBid: maxBid ? Number.parseFloat(maxBid) : undefined,
      autoBid,
      bidderAvatar: "/placeholder.svg?height=40&width=40",
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Bid of $${bidAmount} placed successfully`,
        auction: result.auction,
        bid: result.bid,
        isWinning: bidAmount >= result.auction.currentBid,
      })
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error("Error placing bid:", error)
    return NextResponse.json({ error: "Failed to place bid" }, { status: 500 })
  }
}
