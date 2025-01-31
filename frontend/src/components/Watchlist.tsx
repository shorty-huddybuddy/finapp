import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { ArrowDown, ArrowUp } from "lucide-react"
import React from "react"


interface WatchlistProps {
  type: "stocks" | "crypto"
}

export default function Watchlist({ type }: WatchlistProps) {
  const watchlistItems =
    type === "stocks"
      ? [
          { symbol: "NIFTY", price: "23,467", change: -0.53 },
          { symbol: "BANKNIFTY", price: "51,613.35", change: -0.27 },
          { symbol: "SPX", price: "5,464.61", change: -0.16 },
          { symbol: "VIX", price: "13.2", change: -0.6 },
          { symbol: "USDJPY", price: "159.76", change: 0.54 },
        ]
      : [
          { symbol: "BTCUSD", price: "64,444", change: 0.33 },
          { symbol: "ETHUSD", price: "3,321.875", change: -1.62 },
          { symbol: "XRPUSD", price: "0.952", change: -0.83 },
        ]

  return (
    <Card className="bg-[#1A2332] border-[#2A3442]">
      <CardHeader>
        <CardTitle>Watchlist</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {watchlistItems.map((item) => (
          <div
            key={item.symbol}
            className="flex items-center justify-between p-2 rounded hover:bg-[#2A3442] cursor-pointer"
          >
            <span className="font-medium">{item.symbol}</span>
            <div className="text-right">
              <div>{item.price}</div>
              <div
                className={`text-sm flex items-center gap-1 ${item.change >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {item.change >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {Math.abs(item.change)}%
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

