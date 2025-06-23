import { NextResponse } from "next/server"
import { getAuctionData, getAuctionStats } from "../data"

export async function GET() {
  try {
    const auctions = await getAuctionData()
    const stats = await getAuctionStats()

    return NextResponse.json({
      auctions,
      stats,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("Error fetching auction data:", error)
    return NextResponse.json({ error: "Failed to fetch auction data" }, { status: 500 })
  }
}
