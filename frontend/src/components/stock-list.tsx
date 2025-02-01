import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import React from "react"


interface Stock {
  symbol: string
  price: number
  change: number
  volume?: number
}

export function StockList({ title, stocks }: { title: string; stocks: Stock[] | null }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stocks?.map((stock) => (
            <div key={stock.symbol} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{stock.symbol}</div>
                <div className="text-sm text-muted-foreground">${stock.price.toFixed(2)}</div>
              </div>
              <div className={`flex items-center ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                {stock.change >= 0 ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                {Math.abs(stock.change).toFixed(2)}%
              </div>
            </div>
          ))}
          {!stocks && <div className="text-center text-muted-foreground">Loading...</div>}
        </div>
      </CardContent>
    </Card>
  )
}

