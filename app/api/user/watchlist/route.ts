import { type NextRequest, NextResponse } from "next/server"
import { addToWatchlist, removeFromWatchlist, getUserWatchlist } from "../data"

export async function GET() {
  try {
    const watchlist = await getUserWatchlist()
    return NextResponse.json({ watchlist })
  } catch (error) {
    console.error("Error fetching watchlist:", error)
    return NextResponse.json({ error: "Failed to fetch watchlist" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { auctionId, action } = body

    if (!auctionId || !action) {
      return NextResponse.json({ error: "Missing required fields: auctionId and action" }, { status: 400 })
    }

    let result
    if (action === "add") {
      result = await addToWatchlist(auctionId)
    } else if (action === "remove") {
      result = await removeFromWatchlist(auctionId)
    } else {
      return NextResponse.json({ error: "Invalid action. Use 'add' or 'remove'" }, { status: 400 })
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        watchlist: result.watchlist,
        message: `Item ${action === "add" ? "added to" : "removed from"} watchlist`,
      })
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error("Error updating watchlist:", error)
    return NextResponse.json({ error: "Failed to update watchlist" }, { status: 500 })
  }
}
