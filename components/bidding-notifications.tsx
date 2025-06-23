"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, X, TrendingUp, Trophy, Clock, AlertCircle } from "lucide-react"

interface Notification {
  id: string
  type: "outbid" | "winning" | "ending" | "won" | "lost"
  title: string
  message: string
  timestamp: number
  read: boolean
  auctionId: string
  urgent?: boolean
}

interface BiddingNotificationsProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onClearAll: () => void
}

export function BiddingNotifications({ notifications, onMarkAsRead, onClearAll }: BiddingNotificationsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: string, urgent = false) => {
    const iconClass = urgent ? "h-5 w-5 animate-pulse" : "h-4 w-4"

    switch (type) {
      case "outbid":
        return <TrendingUp className={`${iconClass} text-red-500`} />
      case "winning":
        return <Trophy className={`${iconClass} text-green-500`} />
      case "ending":
        return <Clock className={`${iconClass} text-orange-500`} />
      case "won":
        return <Trophy className={`${iconClass} text-blue-500`} />
      case "lost":
        return <AlertCircle className={`${iconClass} text-gray-500`} />
      default:
        return <Bell className={`${iconClass} text-gray-500`} />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "outbid":
        return "border-red-200 bg-red-50"
      case "winning":
        return "border-green-200 bg-green-50"
      case "ending":
        return "border-orange-200 bg-orange-50"
      case "won":
        return "border-blue-200 bg-blue-50"
      case "lost":
        return "border-gray-200 bg-gray-50"
      default:
        return "border-gray-200 bg-white"
    }
  }

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return "Just now"
  }

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="neu-button-maroon px-4 py-2 rounded-xl flex items-center gap-2 relative"
      >
        <Bell className="h-4 w-4" />
        <span className="hidden sm:inline">Notifications</span>
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center p-0">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Notification Panel */}
          <div className="absolute right-0 top-full mt-2 w-96 glass-card rounded-2xl p-6 z-50 max-h-96 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <Button onClick={onClearAll} variant="ghost" className="text-xs text-gray-500 hover:text-gray-700">
                    Clear All
                  </Button>
                )}
                <Button onClick={() => setIsOpen(false)} variant="ghost" className="p-1 h-auto">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      notification.read
                        ? "bg-gray-50 border-gray-200"
                        : `${getNotificationColor(notification.type)} border-2`
                    } ${notification.urgent ? "ring-2 ring-red-200" : ""}`}
                    onClick={() => {
                      if (!notification.read) {
                        onMarkAsRead(notification.id)
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type, notification.urgent)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4
                            className={`text-sm font-semibold ${notification.read ? "text-gray-600" : "text-gray-900"}`}
                          >
                            {notification.title}
                          </h4>
                          {!notification.read && <div className="w-2 h-2 bg-maroon-500 rounded-full flex-shrink-0" />}
                        </div>
                        <p className={`text-sm ${notification.read ? "text-gray-500" : "text-gray-700"}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">{formatTimeAgo(notification.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {notifications.length > 5 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button variant="ghost" className="w-full text-sm text-maroon-600 hover:text-maroon-700">
                  View All Notifications
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
