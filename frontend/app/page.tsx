"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, Gavel, Clock, TrendingUp, Zap, Shield, Users, Star, ArrowRight, Play, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: Mic,
      title: "AI Voice Commands",
      description: "Place bids, get updates, and navigate using natural voice commands powered by advanced AI",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 to-cyan-950/50",
    },
    {
      icon: Clock,
      title: "Real-Time Updates",
      description: "Get instant notifications about bid changes, time remaining, and auction status updates",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 to-emerald-950/50",
    },
    {
      icon: TrendingUp,
      title: "Smart Analytics",
      description: "AI-powered bidding insights, market trends, and personalized auction recommendations",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 to-pink-950/50",
    },
  ]

  const stats = [
    { label: "Active Users", value: "50K+", icon: Users },
    { label: "Auctions Daily", value: "1.2K+", icon: Gavel },
    { label: "Success Rate", value: "98%", icon: Star },
    { label: "Avg Response", value: "<1s", icon: Zap },
  ]

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="relative container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div
          className={`text-center mb-20 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium animate-pulse">
            <Sparkles className="h-4 w-4 mr-2" />
            Now with Advanced AI Voice Recognition
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text animate-gradient text-black">
              Voice Auction
            </span>
            <br />
            <span className="text-primary">Revolution</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience the future of online auctions with our revolutionary AI-powered voice agent. Bid in real-time,
            get instant updates, and never miss an opportunity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/auction">
              <Button
                size="lg"
                className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Play className="mr-2 h-5 w-5" />
                Enter Auction Room
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4 hover:bg-accent transition-all duration-200"
            >
              <Mic className="mr-2 h-5 w-5" />
              Try Voice Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 mb-3 group-hover:scale-110 transition-transform">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Cutting-edge technology meets intuitive design for the ultimate auction experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${feature.bgColor} ${activeFeature === index ? "ring-2 ring-primary scale-105" : ""}`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <div className={`w-full h-full rounded-full bg-gradient-to-br ${feature.color}`} />
                </div>

                <CardHeader className="relative">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} mb-4 shadow-lg`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{feature.title}</CardTitle>
                </CardHeader>

                <CardContent className="relative">
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Simple steps to auction success</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Connect",
                desc: "Enter the auction room and activate your AI voice agent",
                icon: "🔗",
              },
              {
                step: "2",
                title: "Browse",
                desc: "Explore live auctions with real-time updates and insights",
                icon: "👀",
              },
              { step: "3", title: "Bid", desc: "Place bids using voice commands or manual input", icon: "🎯" },
              { step: "4", title: "Win", desc: "Get instant notifications when you win an auction", icon: "🏆" },
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform">
                    <span className="text-3xl">{item.icon}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl p-12 border border-primary/20">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Bidding?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already experiencing the future of online auctions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auction">
              <Button
                size="lg"
                className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <Gavel className="mr-2 h-5 w-5" />
                Start Bidding Now
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              <Shield className="mr-2 h-5 w-5" />
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
