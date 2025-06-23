# 🗣️ AI Voice Auction

A next-gen auction platform that combines traditional web auction experiences with cutting-edge **AI-powered voice interaction**, enabling **web-based calling** and **real-time auction automation**.

![License](https://img.shields.io/github/license/arnvjshi/AI-Voice-Auction)
![Next.js](https://img.shields.io/badge/Frontend-Next.js-blue)
![Voice AI](https://img.shields.io/badge/Voice-OmniDimension-green)

## 🚀 Overview

**AI Voice Auction** lets users participate in auctions either through:
- A **conventional web interface**, or
- A **voice-enabled call**, powered by **OmniDimension Voice AI**.

With this dual-mode interface, the platform allows seamless human-like interaction — users can listen to the auctioneer, place bids, or even ask questions via voice calls — all automatically handled by the AI agent.

## 🎯 Features

- 🖥️ **Modern Web UI** with Next.js  
- 🗣️ **Voice Assistant Integration** with OmniDimension  
- 📞 **Web Calling Support** for real-time auction participation  
- 🔁 **Automated Bidding Process** via AI  
- ⏱️ **Live Auction Updates** with real-time bid tracking  
- 🎤 AI-powered **auctioneer speech generation and control**

## 💻 Tech Stack

| Layer         | Technology                          |
|---------------|-------------------------------------|
| Frontend      | [Next.js](https://nextjs.org)       |
| Voice Agent   | [OmniDimension](https://omnidimension.ai) |
| Realtime Comm | WebSockets / REST (planned)         |
| Deployment    | Vercel / Render / Railway (WIP)     |

## 🧠 How It Works

1. **Web Interface**: Users browse auction items, join live auctions, and bid through UI.
2. **Voice Interface**: Users call in via the web, interact with a voice AI agent that:
   - Reads auction items
   - Announces current bids
   - Accepts and validates user bids via voice
   - Updates the backend in real-time
3. **AI Agent**: Uses context-aware logic and emotional tones to simulate a human auctioneer.

## 📦 Installation

```bash
git clone https://github.com/arnvjshi/AI-Voice-Auction.git
cd AI-Voice-Auction
npm install
npm run dev
````

> ℹ️ Ensure Flask backend and OmniDimension agent are configured and running.

## 📲 Voice Calling Setup

* Requires integration with OmniDimension
* WebRTC or compatible client to initiate voice calls
* AI model trained or instructed to handle:

  * Greetings
  * Bidding prompts
  * Bid confirmations
  * Auction closing


## 📌 TODOs

* [ ] Add user authentication
* [ ] Implement WebRTC for scalable web calls
* [ ] Improve auction dashboard UI
* [ ] Handle multilingual voice bidding
* [ ] Host auction data on MongoDB or Firestore

## 🛡️ License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

