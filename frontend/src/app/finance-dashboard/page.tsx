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
import crypto from "crypto"

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [marketData, setMarketData] = useState<any>(null)
  const [filteredData, setFilteredData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCoin, setSelectedCoin] = useState("BTCUSD")

  // Example user authentication (if needed)
  const current_user = { id: "user-uuid-here" } // Replace with actual user ID
  const secret = "5b0fqtqg35dpelgtesk24xny70aqds0j" // Your verification secret key
  const userId = current_user.id
  const hash = crypto.createHmac("sha256", secret).update(userId).digest("hex")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
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
  }, [])

  useEffect(() => {
    // Load the chatbot script
    const onLoad = () => {
      const script = document.createElement("script")
      script.src = "https://www.chatbase.co/embed.min.js"
      script.id = "Q2rjth501r8z8EHph4FsZ"
      script.setAttribute("data-domain", "www.chatbase.co")
      document.body.appendChild(script)
    }

    if (document.readyState === "complete") {
      onLoad()
    } else {
      window.addEventListener("load", onLoad)
    }

    // Cleanup function to remove the script when the component unmounts
    return () => {
      const script = document.getElementById("Q2rjth501r8z8EHph4FsZ")
      if (script) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredData(null)
      return
    }
    const filtered = marketData.filter(
      (coin: any) =>
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredData(filtered)
  }

  const handleCoinSelect = (symbol: string) => {
    setSelectedCoin(`${symbol}USD`)
    setFilteredData(null)
    setSearchQuery("")
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 p-4">
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
            <Button onClick={handleSearch}>Search</Button>
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