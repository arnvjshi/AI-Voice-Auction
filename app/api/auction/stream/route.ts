export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import type { NextRequest } from "next/server"
import { subscribeToUpdates, getAuctionData, getAuctionStats } from "../data"

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      console.log("SSE connection established")

      // Send initial data immediately
      const sendInitialData = async () => {
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
          console.log("Initial data sent via SSE")
        } catch (error) {
          console.error("Error sending initial data:", error)
        }
      }

      // Send initial data
      sendInitialData()

      // Subscribe to real-time updates
      const unsubscribe = subscribeToUpdates((updateData) => {
        try {
          const data = JSON.stringify(updateData)
          controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          console.log("Real-time update sent via SSE:", updateData.type)
        } catch (error) {
          console.error("Error sending real-time update:", error)
        }
      })

      // Send heartbeat every 30 seconds to keep connection alive
      const heartbeatInterval = setInterval(() => {
        try {
          const heartbeat = JSON.stringify({
            type: "heartbeat",
            timestamp: Date.now(),
          })
          controller.enqueue(encoder.encode(`data: ${heartbeat}\n\n`))
        } catch (error) {
          console.error("Error sending heartbeat:", error)
        }
      }, 30000)

      // Clean up on close
      const cleanup = () => {
        console.log("SSE connection closed")
        unsubscribe()
        clearInterval(heartbeatInterval)
        try {
          controller.close()
        } catch (error) {
          // Connection already closed
        }
      }

      // Handle client disconnect
      request.signal.addEventListener("abort", cleanup)

      // Handle stream errors
      controller.error = (error: any) => {
        console.error("SSE stream error:", error)
        cleanup()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
    },
  })
}
