"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Mic, MicOff, Volume2, VolumeX, Bot, Zap, MessageCircle } from "lucide-react"

interface VoiceAgentProps {
  isActive: boolean
  onToggle: (active: boolean) => void
  auctions: any[]
  onPlaceBid: (auctionId: string, bidAmount: number) => void
}

export function VoiceAgent({ isActive, onToggle, auctions, onPlaceBid }: VoiceAgentProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [responses, setResponses] = useState<string[]>([
    "🎯 Welcome to VoiceAuction Pro!",
    "🤖 I'm your AI bidding assistant.",
    "💬 Say 'list auctions' to see available items.",
  ])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceLevel, setVoiceLevel] = useState(0)

  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setVoiceLevel(Math.random() * 100)
      }, 100)
      return () => clearInterval(interval)
    }
  }, [isListening])

  const handleVoiceToggle = () => {
    onToggle(!isActive)
    if (!isActive) {
      startListening()
    } else {
      stopListening()
    }
  }

  const startListening = () => {
    setIsListening(true)
    setTimeout(() => {
      setTranscript("List current auctions")
      processVoiceCommand("List current auctions")
      setIsListening(false)
    }, 2000)
  }

  const stopListening = () => {
    setIsListening(false)
    setVoiceLevel(0)
  }

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase()
    let response = ""

    if (lowerCommand.includes("list") && lowerCommand.includes("auction")) {
      const activeAuctions = auctions.filter((a) => a.status === "active")
      response = `🔥 Found ${activeAuctions.length} active auctions: ${activeAuctions.map((a) => a.title).join(", ")}`
    } else if (lowerCommand.includes("bid")) {
      response = '💰 Please specify the auction and bid amount. For example: "Bid $500 on Vintage Watch"'
    } else if (lowerCommand.includes("time")) {
      response = "⏰ Auction times vary. The shortest auction ends in 2 hours and 15 minutes."
    } else if (lowerCommand.includes("help")) {
      response =
        "🆘 I can help you list auctions, place bids, check times, or get auction stats. What would you like to do?"
    } else {
      response = "🤔 I can help you list auctions, place bids, or check auction times. What would you like to do?"
    }

    setResponses((prev) => [...prev, `👤 You: ${command}`, `🤖 Agent: ${response}`])
    speakResponse(response)
  }

  const speakResponse = (text: string) => {
    setIsSpeaking(true)
    setTimeout(() => {
      setIsSpeaking(false)
    }, 2000)
  }

  const quickCommands = [
    { text: "List auctions", icon: "📋" },
    { text: "Check time remaining", icon: "⏰" },
    { text: "Place bid", icon: "💰" },
    { text: "Get auction stats", icon: "📊" },
  ]

  return (
    <Card className="h-fit sticky top-4 bg-gradient-to-br from-card to-muted/20 border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-primary" />
            <span>AI Voice Agent</span>
          </div>
          <Badge
            variant={isActive ? "default" : "secondary"}
            className={isActive ? "bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse" : ""}
          >
            {isActive ? "🟢 Active" : "⚫ Inactive"}
          </Badge>
        </CardTitle>
        <CardDescription>AI-powered voice assistant for auction bidding</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex space-x-2">
          <Button
            onClick={handleVoiceToggle}
            variant={isActive ? "destructive" : "default"}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            {isActive ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
            {isActive ? "Stop Voice" : "Start Voice"}
          </Button>

          <Button variant="outline" size="icon" disabled={!isActive} className="hover:bg-accent">
            {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>

        {isActive && (
          <>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-sm flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-blue-600" />
                    Voice Status
                  </h4>
                  <div className={`w-3 h-3 rounded-full ${isListening ? "bg-red-500 animate-pulse" : "bg-gray-300"}`} />
                </div>

                <p className="text-sm text-muted-foreground mb-2">
                  {isListening ? "🎤 Listening..." : "🔇 Ready to listen"}
                </p>

                {isListening && (
                  <div className="space-y-2">
                    <Progress value={voiceLevel} className="h-2" />
                    <p className="text-xs text-muted-foreground">Voice level: {Math.round(voiceLevel)}%</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center">
                  <MessageCircle className="h-4 w-4 mr-2 text-purple-600" />
                  Quick Commands
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {quickCommands.map((command, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="justify-start text-xs bg-muted/50 hover:bg-muted transition-all"
                      onClick={() => processVoiceCommand(command.text)}
                    >
                      <span className="mr-2">{command.icon}</span>"{command.text}"
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center">
                  <Bot className="h-4 w-4 mr-2 text-green-600" />
                  Conversation
                </h4>
                <div className="bg-muted/30 rounded-xl p-4 max-h-64 overflow-y-auto space-y-2">
                  {responses.map((response, index) => (
                    <div
                      key={index}
                      className={`text-xs p-2 rounded-lg ${
                        response.startsWith("👤")
                          ? "bg-blue-100 dark:bg-blue-950/30 text-blue-800 dark:text-blue-200 ml-4"
                          : "bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-200 mr-4"
                      }`}
                    >
                      {response}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {!isActive && (
          <div className="text-center py-8 space-y-4">
            <Bot className="h-16 w-16 mx-auto text-muted-foreground/50" />
            <div>
              <h3 className="font-semibold text-muted-foreground">Voice Agent Offline</h3>
              <p className="text-sm text-muted-foreground/70">Click "Start Voice" to activate AI assistance</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
