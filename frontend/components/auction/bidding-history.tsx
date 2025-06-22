import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, DollarSign, User } from "lucide-react"

interface BidHistoryItem {
  id: string
  auctionId: string
  auctionTitle: string
  bidAmount: number
  bidder: string
  timestamp: string
  status: "winning" | "outbid" | "lost"
}

interface BiddingHistoryProps {
  history: BidHistoryItem[]
}

export function BiddingHistory({ history }: BiddingHistoryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "winning":
        return "bg-green-500"
      case "outbid":
        return "bg-yellow-500"
      case "lost":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Bidding History</h2>
        <Badge variant="outline">{history.length} Total Bids</Badge>
      </div>

      <div className="space-y-4">
        {history.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Bidding History</h3>
                <p className="text-muted-foreground">Start bidding on auctions to see your history here.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          history.map((bid) => (
            <Card key={bid.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{bid.auctionTitle}</CardTitle>
                  <Badge className={`${getStatusColor(bid.status)} text-white`}>{bid.status.toUpperCase()}</Badge>
                </div>
                <CardDescription className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatDate(bid.timestamp)}
                  </span>
                  <span className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {bid.bidder}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold">${bid.bidAmount.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Auction ID</p>
                    <p className="font-mono text-sm">{bid.auctionId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
