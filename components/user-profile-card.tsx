"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Award, Settings, LogOut } from "lucide-react"

interface UserStats {
  totalBids: number
  wonAuctions: number
  watchlistItems: number
  successRate: number
  totalSpent: number
  avgBid: number
  memberSince: string
  reputation: number
}

interface UserProfileCardProps {
  user: {
    name: string
    email: string
    avatar: string
    verified: boolean
    premium: boolean
  }
  stats: UserStats
}

export function UserProfileCard({ user, stats }: UserProfileCardProps) {
  const [showProfile, setShowProfile] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getReputationBadge = (reputation: number) => {
    if (reputation >= 95) return { label: "Elite Bidder", color: "bg-purple-500" }
    if (reputation >= 90) return { label: "Expert Bidder", color: "bg-blue-500" }
    if (reputation >= 80) return { label: "Trusted Bidder", color: "bg-green-500" }
    if (reputation >= 70) return { label: "Active Bidder", color: "bg-yellow-500" }
    return { label: "New Bidder", color: "bg-gray-500" }
  }

  const reputationBadge = getReputationBadge(stats.reputation)

  return (
    <div className="relative">
      <Button
        onClick={() => setShowProfile(!showProfile)}
        variant="ghost"
        className="neu-button p-2 rounded-xl flex items-center gap-3"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-gray-900">{user.name}</div>
          <div className="text-xs text-gray-500">{stats.reputation}% reputation</div>
        </div>
      </Button>

      {showProfile && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />

          {/* Profile Panel */}
          <div className="absolute right-0 top-full mt-2 w-80 glass-card rounded-2xl p-6 z-50">
            <div className="text-center mb-6">
              <Avatar className="h-16 w-16 mx-auto mb-3">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="text-lg">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>

              <div className="flex items-center justify-center gap-2 mt-2">
                <Badge className={`${reputationBadge.color} text-white`}>{reputationBadge.label}</Badge>
                {user.verified && (
                  <Badge className="bg-blue-100 text-blue-800">
                    <Award className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {user.premium && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Trophy className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Card className="p-3 text-center">
                <div className="text-lg font-bold text-maroon-600">{stats.totalBids}</div>
                <div className="text-xs text-gray-600">Total Bids</div>
              </Card>
              <Card className="p-3 text-center">
                <div className="text-lg font-bold text-green-600">{stats.wonAuctions}</div>
                <div className="text-xs text-gray-600">Won</div>
              </Card>
              <Card className="p-3 text-center">
                <div className="text-lg font-bold text-blue-600">{stats.successRate}%</div>
                <div className="text-xs text-gray-600">Success Rate</div>
              </Card>
              <Card className="p-3 text-center">
                <div className="text-lg font-bold text-purple-600">{formatCurrency(stats.totalSpent)}</div>
                <div className="text-xs text-gray-600">Total Spent</div>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="space-y-2 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Average Bid:</span>
                <span className="font-medium">{formatCurrency(stats.avgBid)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Watching:</span>
                <span className="font-medium">{stats.watchlistItems} items</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Member Since:</span>
                <span className="font-medium">{stats.memberSince}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button className="w-full neu-button rounded-xl flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Account Settings
              </Button>
              <Button variant="ghost" className="w-full text-gray-600 hover:text-gray-800">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
