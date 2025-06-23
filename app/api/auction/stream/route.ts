export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import type { NextRequest } from "next/server"
import { getAuctionData, getAuctionStats } from "../data"

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      // Send initial data
      const sendUpdate = async () => {
        try {
          const auctions = await getAuctionData()
          const stats = await getAuctionStats()

          const data = JSON.stringify({
            type: "auction_update",
            auctions,
            stats,
            timestamp: Date.now(),
          })

          controller.enqueue(encoder.encode(`data: ${data}\n\n`))
        } catch (error) {
          console.error("Error sending update:", error)
        }
      }

      // Send initial update
      sendUpdate()

      // Set up interval for regular updates
      const interval = setInterval(sendUpdate, 2000) // Update every 2 seconds

      // Clean up on close
      request.signal.addEventListener("abort", () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
