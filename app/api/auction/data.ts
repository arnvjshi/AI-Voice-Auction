// In-memory auction data store (in production, use a real database)
let auctionData = [
  {
    id: "auction-1",
    name: "Vintage Oil Painting - Mountain Landscape",
    description:
      "Exquisite 19th century landscape painting by renowned French artist Marcel Dubois. This masterpiece features stunning Alpine mountain scenery with exceptional detail, vibrant autumn colors, and masterful brushwork. The painting depicts a serene valley with a crystal-clear lake reflecting the majestic peaks above. Acquired from a private European collection.",
    currentBid: 2850,
    timeRemaining: 3600,
    totalBids: 18,
    startingBid: 1200,
    reservePrice: 2500,
    category: "Art",
    condition: "Excellent",
    dimensions: "24x36 inches (61x91 cm)",
    year: "1890",
    artist: "Marcel Dubois",
    medium: "Oil on Canvas",
    frame: "Original gilded frame included",
    provenance:
      "Private collection, Paris (1890-1950); Estate sale, London (1950); Private collection, New York (1950-2024)",
    certificate: "Certificate of authenticity included",
    insurance: "Fully insured for $5,000",
    image: "/placeholder.svg?height=400&width=600",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=300&width=400",
    ],
    bidHistory: [
      {
        id: "bid-1",
        amount: 1200,
        timestamp: Date.now() - 7200000,
        bidder: "ArtCollector_NYC",
        bidderAvatar: "/placeholder.svg?height=40&width=40",
        bidType: "manual",
      },
      {
        id: "bid-2",
        amount: 1500,
        timestamp: Date.now() - 5400000,
        bidder: "MuseumCurator_LA",
        bidderAvatar: "/placeholder.svg?height=40&width=40",
        bidType: "manual",
      },
      {
        id: "bid-3",
        amount: 1800,
        timestamp: Date.now() - 3600000,
        bidder: "EuropeanDealer",
        bidderAvatar: "/placeholder.svg?height=40&width=40",
        bidType: "auto",
      },
      {
        id: "bid-4",
        amount: 2200,
        timestamp: Date.now() - 2700000,
        bidder: "PrivateCollector_TX",
        bidderAvatar: "/placeholder.svg?height=40&width=40",
        bidType: "manual",
      },
      {
        id: "bid-5",
        amount: 2500,
        timestamp: Date.now() - 1800000,
        bidder: "GalleryOwner_SF",
        bidderAvatar: "/placeholder.svg?height=40&width=40",
        bidType: "auto",
      },
      {
        id: "bid-6",
        amount: 2850,
        timestamp: Date.now() - 900000,
        bidder: "ArtInvestor_Miami",
        bidderAvatar: "/placeholder.svg?height=40&width=40",
        bidType: "manual",
      },
    ],
    status: "active" as const,
    seller: "Heritage Fine Arts",
    sellerRating: 4.9,
    sellerSince: "2010",
    location: "New York, NY",
    shippingInfo: "Free worldwide shipping, fully insured, professional art handling",
    estimatedValue: "$3,500 - $4,500",
    viewCount: 247,
    watchCount: 34,
  },
  {
    id: "auction-2",
    name: "Patek Philippe Pocket Watch - 18K Gold",
    description:
      "Exceptional Swiss pocket watch from the prestigious Patek Philippe manufacture, circa 1895. Features an 18-karat yellow gold hunting case with intricate hand-engraved patterns, white enamel dial with Roman numerals, and blued steel hands. The mechanical movement is in perfect working condition with original chain and presentation box.",
    currentBid: 4200,
    timeRemaining: 1800,
    totalBids: 23,
    startingBid: 2500,
    reservePrice: 3800,
    category: "Watches",
    condition: "Very Good",
    dimensions: "2.2 inches diameter, 0.6 inches thick",
    year: "1895",
    brand: "Patek Philippe",
    model: "Hunter Case Pocket Watch",
    movement: "Manual wind, 15 jewels",
    case: "18K Yellow Gold",
    dial: "White enamel with Roman numerals",
    hands: "Blued steel",
    serial: "Serial #847291",
    provenance: "Original owner family estate, Switzerland",
    serviceHistory: "Recently serviced by certified watchmaker (2023)",
    accessories: "Original chain, presentation box, service papers",
    image: "/placeholder.svg?height=400&width=600",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=300&width=400",
    ],
    bidHistory: [
      {
        id: "bid-7",
        amount: 2500,
        timestamp: Date.now() - 5400000,
        bidder: "WatchEnthusiast_UK",
        bidderAvatar: "/placeholder.svg?height=40&width=40",
        bidType: "manual",
      },
      {
        id: "bid-8",
        amount: 2800,
        timestamp: Date.now() - 4500000,
        bidder: "TimeCollector_CH",
        bidderAvatar: "/placeholder.svg?height=40&width=40",
        bidType: "auto",
      },
      {
        id: "bid-9",
        amount: 3200,
        timestamp: Date.now() - 3600000,
        bidder: "VintageDealer_NY",
        bidderAvatar: "/placeholder.svg?height=40&width=40",
        bidType: "manual",
      },
      {
        id: "bid-10",
        amount: 3600,
        timestamp: Date.now() - 2700000,
        bidder: "HorologyExpert",
        bidderAvatar: "/placeholder.svg?height=40&width=40",
        bidType: "auto",
      },
      {
        id: "bid-11",
        amount: 3900,
        timestamp: Date.now() - 1800000,
        bidder: "SwissCollector",
        bidderAvatar: "/placeholder.svg?height=40&width=40",
        bidType: "manual",
      },
      {
        id: "bid-12",
        amount: 4200,
        timestamp: Date.now() - 900000,
        bidder: "PatekPhilippeFan",
        bidderAvatar: "/placeholder.svg?height=40&width=40",
        bidType: "auto",
      },
    ],
    status: "active" as const,
    seller: "Timepiece Gallery International",
    sellerRating: 4.8,
    sellerSince: "2008",
    location: "Geneva, Switzerland",
    shippingInfo: "Express shipping available, fully insured, signature required",
    estimatedValue: "$5,000 - $6,500",
    viewCount: 189,
    watchCount: 28,
  },
  {
    id: "auction-3",
    name: "First Edition Book Collection - Literary Classics",
    description:
      "Remarkable collection of first edition books featuring literary masterpieces from the 19th and early 20th centuries. Includes works by Charles Dickens, William Shakespeare, Mark Twain, and Oscar Wilde. All books are in pristine condition with original dust jackets where applicable. A true treasure for any serious book collector or literature enthusiast.",
    currentBid: 1850,
    timeRemaining: 7200,
    totalBids: 12,
    startingBid: 1200,
    reservePrice: 1600,
    category: "Books",
    condition: "Mint to Near Mint",
    dimensions: "Various sizes, largest 12x9 inches",
    year: "1800-1920",
    publisher: "Various prestigious publishers",
    titles:
      "Great Expectations (1861), Hamlet First Folio (1623 facsimile), Adventures of Huckleberry Finn (1885), The Picture of Dorian Gray (1890)",
    binding: "Original cloth and leather bindings",
    dustJackets: "Original dust jackets preserved where applicable",
    provenance: "Private library collection, Boston",
    rarity: "Several titles extremely rare in this condition",
    appraisal: "Professional appraisal available upon request",
    image: "/placeholder.svg?height=400&width=600",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=300&width=400",
    ],
    bidHistory: [
      {
        id: "bid-13",
        amount: 1200,
        timestamp: Date.now() - 6300000,
        bidder: "BookCollector_Boston",
        bidderAvatar: "/placeholder.svg?height=40&width=40",
        bidType: "manual",
      },
      {
        id: "bid-14",
        amount: 1350,
        timestamp: Date.now() - 5400000,
        bidder: "LibrarySpecialist",
        bidderAvatar: "/placeholder.svg?height=40&width=40",
        bidType: "auto",
      },
      {
        id: "bid-15",
        amount: 1500,
        timestamp: Date.now() - 4500000,
        bidder: "RareBookDealer_UK",
        bidderAvatar: "/placeholder.svg?height=40&width=40",
        bidType: "manual",
      },
      {
        id: "bid-16",
        amount: 1650,
        timestamp: Date.now() - 3600000,
        bidder: "UniversityLibrary",
        bidderAvatar: "/placeholder.svg?height=40&width=40",
        bidType: "auto",
      },
      {
        id: "bid-17",
        amount: 1850,
        timestamp: Date.now() - 1800000,
        bidder: "LiteratureProf_Yale",
        bidderAvatar: "/placeholder.svg?height=40&width=40",
        bidType: "manual",
      },
    ],
    status: "active" as const,
    seller: "Antiquarian Books & Manuscripts",
    sellerRating: 4.9,
    sellerSince: "2005",
    location: "Boston, MA",
    shippingInfo: "Careful packaging, signature required, insurance included",
    estimatedValue: "$2,200 - $2,800",
    viewCount: 156,
    watchCount: 19,
  },
  {
    id: "auction-4",
    name: "1965 Fender Stratocaster - Sunburst Finish",
    description:
      "Iconic 1965 Fender Stratocaster in excellent condition with original sunburst finish. This vintage electric guitar features the classic alder body, maple neck with rosewood fingerboard, and all original hardware including pickups, tuning machines, and tremolo system. Comes with original hard case and certificate of authenticity. A true collector's piece with that legendary Stratocaster tone.",
    currentBid: 8500,
    timeRemaining: 0,
    totalBids: 31,
    startingBid: 5000,
    reservePrice: 7500,
    category: "Musical Instruments",
    condition: "Excellent",
    dimensions: "Standard Stratocaster dimensions",
    year: "1965",
    brand: "Fender",
    model: "Stratocaster",
    finish: "3-Color Sunburst",
    body: "Alder",
    neck: "Maple with rosewood fingerboard",
    pickups: "Original single-coil pickups",
    hardware: "Original chrome hardware",
    serial: "Serial #L67891",
    modifications: "None - completely original",
    playability: "Professionally set up, plays beautifully",
    case: "Original Fender hard case included",
    image: "/placeholder.svg?height=400&width=600",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=300&width=400",
    ],
    bidHistory: [
      {
        id: "bid-18",
        amount: 5000,
        timestamp: Date.now() - 10800000,
        bidder: "GuitarCollector_TX",
        bidderAvatar: "/placeholder.svg?height=40&width=40",
        bidType: "manual",
      },
      {
        id: "bid-19",
        amount: 5500,
        timestamp: Date.now() - 9900000,
        bidder: "VintageGuitarDealer",
        bidderAvatar: "/placeholder.svg?height=40&width=40",
        bidType: "auto",
      },
      {
        id: "bid-20",
        amount: 6200,
        timestamp: Date.now() - 8100000,
        bidder: "SessionMusician_LA",
        bidderAvatar: "/placeholder.svg?height=40&width=40",
        bidType: "manual",
      },
      {
        id: "bid-21",
        amount: 6800,
        timestamp: Date.now() - 7200000,
        bidder: "RockGuitarist",
        bidderAvatar: "/placeholder.svg?height=40&width=40",
        bidType: "auto",
      },
      {
        id: "bid-22",
        amount: 7500,
        timestamp: Date.now() - 5400000,
        bidder: "FenderEnthusiast",
        bidderAvatar: "/placeholder.svg?height=40&width=40",
        bidType: "manual",
      },
      {
        id: "bid-23",
        amount: 8200,
        timestamp: Date.now() - 3600000,
        bidder: "MusicStore_Nashville",
        bidderAvatar: "/placeholder.svg?height=40&width=40",
        bidType: "auto",
      },
      {
        id: "bid-24",
        amount: 8500,
        timestamp: Date.now() - 1800000,
        bidder: "StratocasterFan_UK",
        bidderAvatar: "/placeholder.svg?height=40&width=40",
        bidType: "manual",
      },
    ],
    status: "ended" as const,
    seller: "Guitar Heaven Vintage",
    sellerRating: 4.9,
    sellerSince: "2012",
    location: "Nashville, TN",
    shippingInfo: "Professional instrument shipping, fully insured",
    estimatedValue: "$8,000 - $10,000",
    viewCount: 423,
    watchCount: 67,
  },
  {
    id: "auction-5",
    name: "Art Deco Diamond Ring - Platinum Setting",
    description:
      "Stunning Art Deco diamond engagement ring from the 1920s featuring a brilliant 2.5-carat center diamond surrounded by smaller diamonds in an intricate platinum setting. The ring showcases the geometric patterns characteristic of the Art Deco period with exceptional craftsmanship and attention to detail.",
    currentBid: 12500,
    timeRemaining: 5400,
    totalBids: 19,
    startingBid: 8000,
    reservePrice: 11000,
    category: "Jewelry",
    condition: "Excellent",
    dimensions: "Size 6.5 (can be resized)",
    year: "1925",
    metal: "Platinum",
    centerStone: "2.5ct Round Brilliant Diamond, G color, VS1 clarity",
    accentStones: "16 smaller diamonds, approximately 0.8ct total",
    setting: "Art Deco geometric design",
    certification: "GIA certified center diamond",
    appraisal: "Recent appraisal: $15,000",
    provenance: "Estate jewelry from prominent New York family",
    image: "/placeholder.svg?height=400&width=600",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=300&width=400",
    ],
    bidHistory: [
      {
        id: "bid-25",
        amount: 8000,
        timestamp: Date.now() - 7200000,
        bidder: "JewelryCollector_NYC",
        bidderAvatar: "/placeholder.svg?height=40&width=40",
        bidType: "manual",
      },
      {
        id: "bid-26",
        amount: 9200,
        timestamp: Date.now() - 6300000,
        bidder: "EstateJewelryDealer",
        bidderAvatar: "/placeholder.svg?height=40&width=40",
        bidType: "auto",
      },
      {
        id: "bid-27",
        amount: 10500,
        timestamp: Date.now() - 5400000,
        bidder: "DiamondExpert_LA",
        bidderAvatar: "/placeholder.svg?height=40&width=40",
        bidType: "manual",
      },
      {
        id: "bid-28",
        amount: 11800,
        timestamp: Date.now() - 3600000,
        bidder: "VintageRingLover",
        bidderAvatar: "/placeholder.svg?height=40&width=40",
        bidType: "auto",
      },
      {
        id: "bid-29",
        amount: 12500,
        timestamp: Date.now() - 1800000,
        bidder: "ArtDecoCollector",
        bidderAvatar: "/placeholder.svg?height=40&width=40",
        bidType: "manual",
      },
    ],
    status: "active" as const,
    seller: "Prestige Estate Jewelry",
    sellerRating: 4.8,
    sellerSince: "2015",
    location: "Beverly Hills, CA",
    shippingInfo: "Secure shipping, fully insured, signature required",
    estimatedValue: "$13,000 - $16,000",
    viewCount: 312,
    watchCount: 45,
  },
  {
    id: "auction-6",
    name: "Ming Dynasty Porcelain Vase - Blue and White",
    description:
      "Exceptional Ming Dynasty porcelain vase dating to the Wanli period (1572-1620). Features traditional blue and white glazing with intricate floral motifs and geometric patterns. This museum-quality piece represents the pinnacle of Chinese ceramic artistry and would be a centerpiece in any serious collection of Asian art.",
    currentBid: 15800,
    timeRemaining: 10800,
    totalBids: 14,
    startingBid: 12000,
    reservePrice: 14000,
    category: "Asian Art",
    condition: "Very Good",
    dimensions: "Height: 14 inches, Diameter: 8 inches",
    year: "1572-1620 (Wanli Period)",
    dynasty: "Ming Dynasty",
    kiln: "Jingdezhen Imperial Kilns",
    glaze: "Blue and white underglaze",
    decoration: "Floral scrollwork and geometric borders",
    mark: "Six-character Wanli mark on base",
    provenance: "Private collection, acquired in Hong Kong (1960s)",
    condition_report: "Minor age-appropriate wear, no chips or cracks",
    authentication: "Authenticated by Asian art specialist",
    image: "/placeholder.svg?height=400&width=600",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=300&width=400",
    ],
    bidHistory: [
      {
        id: "bid-30",
        amount: 12000,
        timestamp: Date.now() - 9000000,
        bidder: "AsianArtCollector",
        bidderAvatar: "/placeholder.svg?height=40&width=40",
        bidType: "manual",
      },
      {
        id: "bid-31",
        amount: 13200,
        timestamp: Date.now() - 7200000,
        bidder: "MuseumCurator_SF",
        bidderAvatar: "/placeholder.svg?height=40&width=40",
        bidType: "auto",
      },
      {
        id: "bid-32",
        amount: 14500,
        timestamp: Date.now() - 5400000,
        bidder: "ChinesePorcelainExpert",
        bidderAvatar: "/placeholder.svg?height=40&width=40",
        bidType: "manual",
      },
      {
        id: "bid-33",
        amount: 15800,
        timestamp: Date.now() - 3600000,
        bidder: "InternationalDealer_HK",
        bidderAvatar: "/placeholder.svg?height=40&width=40",
        bidType: "auto",
      },
    ],
    status: "active" as const,
    seller: "Oriental Arts & Antiques",
    sellerRating: 4.9,
    sellerSince: "2003",
    location: "San Francisco, CA",
    shippingInfo: "Museum-quality packing, international shipping available",
    estimatedValue: "$18,000 - $22,000",
    viewCount: 278,
    watchCount: 31,
  },
]

// Simulate time countdown
setInterval(() => {
  auctionData = auctionData.map((auction) => {
    if (auction.status === "active" && auction.timeRemaining > 0) {
      const newTimeRemaining = Math.max(0, auction.timeRemaining - 1)
      return {
        ...auction,
        timeRemaining: newTimeRemaining,
        status: newTimeRemaining === 0 ? ("ended" as const) : ("active" as const),
      }
    }
    return auction
  })
}, 1000)

export async function getAuctionData() {
  return auctionData
}

export async function getAuctionById(id: string) {
  return auctionData.find((auction) => auction.id === id)
}

export async function getAuctionStats() {
  const totalItems = auctionData.length
  const activeBids = auctionData.filter((a) => a.status === "active").reduce((sum, a) => sum + a.totalBids, 0)
  const totalRevenue = auctionData.reduce((sum, a) => sum + a.currentBid, 0)
  const activeUsers = new Set(auctionData.flatMap((a) => a.bidHistory.map((b) => b.bidder))).size

  return {
    totalItems,
    activeBids,
    totalRevenue,
    activeUsers,
  }
}

export async function placeBid(auctionId: string, amount: number, bidder: string, bidderAvatar?: string) {
  const auctionIndex = auctionData.findIndex((a) => a.id === auctionId)

  if (auctionIndex === -1) {
    return { success: false, error: "Auction not found" }
  }

  const auction = auctionData[auctionIndex]

  if (auction.status !== "active" || auction.timeRemaining <= 0) {
    return { success: false, error: "Auction has ended" }
  }

  if (amount <= auction.currentBid) {
    return {
      success: false,
      error: `Bid must be higher than current bid of $${auction.currentBid}`,
    }
  }

  // Create new bid
  const newBid = {
    id: `bid-${Date.now()}`,
    amount,
    timestamp: Date.now(),
    bidder,
    bidderAvatar: bidderAvatar || "/placeholder.svg?height=40&width=40",
  }

  // Update auction
  auctionData[auctionIndex] = {
    ...auction,
    currentBid: amount,
    totalBids: auction.totalBids + 1,
    bidHistory: [...auction.bidHistory, newBid],
  }

  return {
    success: true,
    auction: auctionData[auctionIndex],
    bid: newBid,
  }
}

// Update auction details from OmniDimension agent
export async function updateAuctionFromAgent(auctionId: string, updates: any) {
  const auctionIndex = auctionData.findIndex((a) => a.id === auctionId)

  if (auctionIndex === -1) {
    return { success: false, error: "Auction not found" }
  }

  // Apply updates from agent
  auctionData[auctionIndex] = {
    ...auctionData[auctionIndex],
    ...updates,
    // Preserve critical fields
    id: auctionData[auctionIndex].id,
    bidHistory: auctionData[auctionIndex].bidHistory,
  }

  return {
    success: true,
    auction: auctionData[auctionIndex],
  }
}
