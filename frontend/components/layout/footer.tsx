"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Gavel, Twitter, Github, Linkedin, Mail, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-gradient-to-r from-muted/50 to-muted/30 backdrop-blur">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Gavel className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                VoiceAuction Pro
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Revolutionary voice-enabled auction platform powered by cutting-edge AI technology.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Features</h3>
            <ul className="space-y-3 text-sm">
              {["Voice Commands", "Real-time Bidding", "AI Analytics", "Smart Notifications", "Auction History"].map(
                (item) => (
                  <li key={item}>
                    <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      {item}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Support</h3>
            <ul className="space-y-3 text-sm">
              {["Help Center", "Contact Us", "API Documentation", "System Status", "Community"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
            <ul className="space-y-3 text-sm">
              {["Terms of Service", "Privacy Policy", "Cookie Policy", "Auction Rules", "Refund Policy"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">© 2024 VoiceAuction Pro. All rights reserved.</div>
            <div className="flex items-center text-sm text-muted-foreground">
              Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> for auction enthusiasts
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
