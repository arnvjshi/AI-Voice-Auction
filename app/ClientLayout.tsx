"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Script
          id="omnidimension-web-widget"
          src="https://backend.omnidim.io/web_widget.js?secret_key=8b22353a6e03d61d4654a223baf2f26f"
          strategy="afterInteractive"
          onLoad={() => {
            console.log("OmniDimension widget loaded successfully")
            // Initialize widget with custom styling
            if (typeof window !== "undefined" && (window as any).OmniDimensionWidget) {
              ;(window as any).OmniDimensionWidget.init({
                theme: "elegant",
                primaryColor: "#d85d5d",
                position: "bottom-right",
                greeting:
                  'Hello! I can help you with auction bidding. Try saying "Show me available auctions" or "Place a bid on the painting".',
                placeholder: 'Ask me about auctions or say "help" for commands...',
              })
            }
          }}
        />

        {/* Custom styling for OmniDimension widget */}
        <style jsx global>{`
          .omnidimension-widget {
            border-radius: 16px !important;
            box-shadow: 0 8px 32px rgba(216, 93, 93, 0.2) !important;
            border: 1px solid rgba(216, 93, 93, 0.1) !important;
          }
          
          .omnidimension-widget-button {
            background: linear-gradient(145deg, #d85d5d, #c44242) !important;
            border-radius: 50% !important;
            box-shadow: 0 6px 20px rgba(216, 93, 93, 0.3) !important;
            transition: all 0.3s ease !important;
          }
          
          .omnidimension-widget-button:hover {
            transform: scale(1.05) !important;
            box-shadow: 0 8px 25px rgba(216, 93, 93, 0.4) !important;
          }
          
          .omnidimension-chat-input {
            border: 2px solid rgba(216, 93, 93, 0.1) !important;
            border-radius: 12px !important;
          }
          
          .omnidimension-chat-input:focus {
            border-color: rgba(216, 93, 93, 0.3) !important;
            box-shadow: 0 0 0 3px rgba(216, 93, 93, 0.1) !important;
          }
          
          .omnidimension-send-button {
            background: linear-gradient(145deg, #d85d5d, #c44242) !important;
            border-radius: 8px !important;
          }
        `}</style>
      </body>
    </html>
  )
}
