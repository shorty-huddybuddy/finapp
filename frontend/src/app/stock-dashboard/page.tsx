"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { SymbolOverviewWidget } from "@/components/symbol-overview-widget"
import { MarketOverviewWidget } from "@/components/market-overview-widget"
import { CustomScreener } from "@/components/custom-screener"
import { TradingViewChart } from "@/components/trading-view-chart"
import { StockSearch } from "@/components/stock-search"

export default function Dashboard() {
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL")

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold">Stock Dashboard</h1>
          <StockSearch onSelect={setSelectedSymbol} />
        </div>

        <Card>
          <CardContent className="p-4">
            <SymbolOverviewWidget />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 h-[600px]">
            <Card className="h-full">
              <CardContent className="p-4 h-full">
                <CustomScreener />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-3 h-[600px]">
            <Card className="h-full">
              <CardContent className="p-4 h-full">
                <TradingViewChart symbol={`NASDAQ:${selectedSymbol}`} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

