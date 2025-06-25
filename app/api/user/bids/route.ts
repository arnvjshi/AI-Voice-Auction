import { NextResponse } from "next/server"
import { getUserBids, getUserStats, getUserWatchlist } from "../data"

export async function GET() {
  try {
    const bids = await getUserBids()
    const stats = await getUserStats()
    const watchlist = await getUserWatchlist()

    return NextResponse.json({
      bids,
      stats,
      watchlist,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("Error fetching user bids:", error)
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
  }
}
