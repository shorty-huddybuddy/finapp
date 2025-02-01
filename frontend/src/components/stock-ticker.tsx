import { Card, CardContent } from "../components/ui/card"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import React from "react"

interface Stock {
  symbol: string
  price: number
  change: number
}

export function StockTicker({ stocks }: { stocks: Stock[] | null }) {
  if (!stocks) return null

  return (
    <div className="flex gap-4 overflow-x-auto p-4 w-full">
      {stocks.map((stock) => (
        <Card key={stock.symbol} className="min-w-[200px]">
          <CardContent className="p-4">
            <div className="text-sm font-medium">{stock.symbol}</div>
            <div className="text-2xl font-bold">${stock.price.toFixed(2)}</div>
            <div className={`flex items-center ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`}>
              {stock.change >= 0 ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
              {Math.abs(stock.change).toFixed(2)}%
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

