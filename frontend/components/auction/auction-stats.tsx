import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, Clock, Users, Gavel } from "lucide-react"

interface AuctionStatsProps {
  auctions: any[]
}

export function AuctionStats({ auctions }: AuctionStatsProps) {
  const totalAuctions = auctions.length
  const activeAuctions = auctions.filter((a) => a.status === "active").length
  const totalBids = auctions.reduce((sum, auction) => sum + auction.totalBids, 0)
  const totalValue = auctions.reduce((sum, auction) => sum + auction.currentBid, 0)
  const avgBidPerAuction = totalAuctions > 0 ? Math.round(totalBids / totalAuctions) : 0
  const highestBid = Math.max(...auctions.map((a) => a.currentBid), 0)

  const stats = [
    {
      title: "Total Auctions",
      value: totalAuctions,
      icon: Gavel,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Auctions",
      value: activeAuctions,
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Bids",
      value: totalBids,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Value",
      value: `$${totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Avg Bids/Auction",
      value: avgBidPerAuction,
      icon: TrendingUp,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Highest Bid",
      value: `$${highestBid.toLocaleString()}`,
      icon: DollarSign,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Auction Statistics</h2>
        <Badge variant="outline">Real-time Data</Badge>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Auction Performance</CardTitle>
          <CardDescription>Overview of auction activity and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Most Active Auction</p>
                <p className="font-semibold">
                  {auctions.length > 0
                    ? auctions.reduce((prev, current) => (prev.totalBids > current.totalBids ? prev : current)).title
                    : "No auctions available"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ending Soon</p>
                <p className="font-semibold">{auctions.filter((a) => a.timeRemaining < 3600).length} auctions</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">Auction Status Distribution</p>
              <div className="flex space-x-4">
                <Badge variant="outline" className="text-green-600">
                  Active: {auctions.filter((a) => a.status === "active").length}
                </Badge>
                <Badge variant="outline" className="text-yellow-600">
                  Ending: {auctions.filter((a) => a.status === "ending").length}
                </Badge>
                <Badge variant="outline" className="text-red-600">
                  Ended: {auctions.filter((a) => a.status === "ended").length}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
