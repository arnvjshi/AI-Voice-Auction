export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"
import { getAuctionData, placeBid, updateAuctionFromAgent } from "../../auction/data"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("OmniDimension webhook received:", body)

    // Extract user intent and entities from OmniDimension
    const { intent, entities, user_input, session_id } = body

    const response = {
      message: "I'm sorry, I didn't understand that. You can ask about available auctions or place a bid.",
      data: null,
    }

    switch (intent) {
      case "list_auctions":
      case "get_auctions":
        const auctions = await getAuctionData()
        const activeAuctions = auctions.filter((a) => a.status === "active")

        if (activeAuctions.length === 0) {
          response.message = "There are currently no active auctions."
        } else {
          const auctionList = activeAuctions
            .map(
              (auction) =>
                `${auction.name}: Current bid is $${auction.currentBid}, ${Math.floor(auction.timeRemaining / 60)} minutes remaining`,
            )
            .join(". ")

          response.message = `Here are the active auctions: ${auctionList}. Would you like to place a bid on any of these items?`
          response.data = activeAuctions
        }
        break

      case "place_bid":
        // Extract bid amount and item name from entities
        const bidAmount = entities?.amount || extractAmountFromText(user_input)
        const itemName = entities?.item || extractItemFromText(user_input)

        if (!bidAmount || !itemName) {
          response.message =
            "To place a bid, please specify both the amount and the item name. For example: 'I want to bid $500 on the vintage painting'"
          break
        }

        // Find matching auction
        const allAuctions = await getAuctionData()
        const matchingAuction = allAuctions.find(
          (a) => a.name.toLowerCase().includes(itemName.toLowerCase()) && a.status === "active",
        )

        if (!matchingAuction) {
          response.message = `I couldn't find an active auction for "${itemName}". Please check the available auctions first.`
          break
        }

        // Attempt to place bid
        const bidResult = await placeBid(matchingAuction.id, bidAmount, `Voice User ${session_id}`)

        if (bidResult.success) {
          response.message = `Great! Your bid of $${bidAmount} on ${matchingAuction.name} has been placed successfully. You are now the highest bidder!`
          response.data = bidResult.auction
        } else {
          response.message = `Sorry, I couldn't place your bid. ${bidResult.error}. The current highest bid is $${matchingAuction.currentBid}.`
        }
        break

      case "get_auction_info":
        const queryItem = entities?.item || extractItemFromText(user_input)

        if (!queryItem) {
          response.message = "Which auction item would you like to know about?"
          break
        }

        const auctionsForInfo = await getAuctionData()
        const targetAuction = auctionsForInfo.find((a) => a.name.toLowerCase().includes(queryItem.toLowerCase()))

        if (!targetAuction) {
          response.message = `I couldn't find an auction for "${queryItem}". Please check the available auctions.`
        } else {
          const timeLeft =
            targetAuction.status === "active"
              ? `${Math.floor(targetAuction.timeRemaining / 60)} minutes remaining`
              : "auction has ended"

          response.message = `${targetAuction.name}: ${targetAuction.description}. Current bid is $${targetAuction.currentBid} with ${targetAuction.totalBids} total bids. ${timeLeft}.`
          response.data = targetAuction
        }
        break

      case "get_current_bid":
        const bidQueryItem = entities?.item || extractItemFromText(user_input)

        if (!bidQueryItem) {
          response.message = "Which item's current bid would you like to know?"
          break
        }

        const auctionsForBid = await getAuctionData()
        const bidTargetAuction = auctionsForBid.find((a) => a.name.toLowerCase().includes(bidQueryItem.toLowerCase()))

        if (!bidTargetAuction) {
          response.message = `I couldn't find an auction for "${bidQueryItem}".`
        } else {
          response.message = `The current bid for ${bidTargetAuction.name} is $${bidTargetAuction.currentBid}.`
          response.data = { currentBid: bidTargetAuction.currentBid, auction: bidTargetAuction }
        }
        break

      case "update_auction_details":
        // Handle auction updates from OmniDimension agent
        const auctionId = entities?.auction_id
        const updates = entities?.updates || {}

        if (auctionId) {
          const updateResult = await updateAuctionFromAgent(auctionId, updates)
          if (updateResult.success) {
            response.message = `Auction details for ${updateResult.auction.name} have been updated successfully.`
            response.data = updateResult.auction
          } else {
            response.message = `Failed to update auction: ${updateResult.error}`
          }
        }
        break

      default:
        // Handle general queries
        if (user_input?.toLowerCase().includes("help")) {
          response.message =
            "I can help you with auctions! You can ask me to 'list available auctions', 'tell me about an item', or 'place a bid'. What would you like to do?"
        }
        break
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error processing OmniDimension webhook:", error)
    return NextResponse.json(
      {
        message: "I'm experiencing technical difficulties. Please try again.",
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}

// Helper functions to extract information from natural language
function extractAmountFromText(text: string): number | null {
  const amountMatch = text.match(/\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/)
  return amountMatch ? Number.parseFloat(amountMatch[1].replace(/,/g, "")) : null
}

function extractItemFromText(text: string): string | null {
  // Simple keyword extraction - in production, use more sophisticated NLP
  const keywords = ["painting", "watch", "book", "guitar", "vintage", "antique", "collection"]
  const words = text.toLowerCase().split(" ")

  for (const keyword of keywords) {
    if (words.includes(keyword)) {
      return keyword
    }
  }

  // Try to extract item name after "on" or "for"
  const onMatch = text.match(/(?:on|for)\s+(?:the\s+)?([^,.!?]+)/i)
  return onMatch ? onMatch[1].trim() : null
}
