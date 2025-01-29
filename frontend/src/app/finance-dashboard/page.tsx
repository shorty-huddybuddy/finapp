"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import MarketSummary from "@/components/MarketSummary"
import TradingViewChart from "@/components/TradingViewChart"
import TechnicalAnalysis from "@/components/TechnicalAnalysis"
import TopCoins from "@/components/TopCoins"
import SearchResults from "@/components/SearchResults"
import { getCryptoData } from "@/services/api"
import crypto from "crypto" // Import crypto for user verification

interface Coin {
  name: string
  symbol: string
  // Add other properties as needed
}

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [marketData, setMarketData] = useState<Coin[] | null>(null)
  const [filteredData, setFilteredData] = useState<Coin[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCoin, setSelectedCoin] = useState("BTCUSD")

  // Load chatbot script
  useEffect(() => {
    const loadChatbot = () => {
      const script = document.createElement("script")
      script.src = "https://www.chatbase.co/embed.min.js"
      script.id = "Q2rjth501r8z8EHph4FsZ"
      script.setAttribute("data-domain", "www.chatbase.co")
      script.defer = true
      document.body.appendChild(script)
    }

    if (document.readyState === "complete") {
      loadChatbot()
    } else {
      window.addEventListener("load", loadChatbot)
    }

    // Cleanup
    return () => {
      window.removeEventListener("load", loadChatbot)
    }
  }, [])

  // Fetch market data
  useEffect(() => {
    const fetchData = async () => {
      //setLoading(true)
      try {
        const data = await getCryptoData()
        setMarketData(data)
      } catch (error) {
        console.error("Error fetching market data:", error)
        setMarketData(null)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    const timer = setInterval(fetchData, 45000) // Refresh data every minute
    return () => clearInterval(timer)
    
  }, [])

  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredData(null)
      return
    }
    const filtered = marketData?.filter(
      (coin) =>
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredData(filtered || null)
  }

  // Handle coin selection
  const handleCoinSelect = (symbol: string) => {
    setSelectedCoin(`${symbol}USD`)
    setFilteredData(null)
    setSearchQuery("")
  }

  // User verification (optional)
  const verifyUser = () => {
    const secret = "5b0fqtqg35dpelgtesk24xny70aqds0j" // Your verification secret key
    const userId = "user-id" // Replace with actual user ID (e.g., from authentication)
    const hash = crypto.createHmac("sha256", secret).update(userId).digest("hex")
    return hash
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 p-4">
      {/* Chatbot container */}
      <div
        id="chatbot-container"
        className="fixed bottom-4 right-4 z-50"
        style={{ width: "350px", height: "500px" }}
      ></div>

      <div className="max-w-[1800px] mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Crypto Dashboard</h1>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Search coin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[200px] bg-white border-gray-300 text-gray-800"
            />
            <Button onClick={handleSearch} aria-label="Search">
              Search
            </Button>
          </div>
        </div>

        {filteredData && <SearchResults data={filteredData} onSelectCoin={handleCoinSelect} />}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <MarketSummary data={marketData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <div className="flex items-center">
                  <CardTitle className="text-gray-800">Price Chart</CardTitle>
                  <Separator orientation="vertical" className="mx-2 h-6" />
                  <span className="text-blue-600 font-semibold">{selectedCoin}</span>
                </div>
              </CardHeader>
              <CardContent>
                <TradingViewChart symbol={selectedCoin} />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <TopCoins data={marketData} onSelectCoin={handleCoinSelect} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-4">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-800">Technical Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <TechnicalAnalysis symbol={selectedCoin} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}