import { Card, CardContent } from "../components/ui/card"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import React from "react"


interface Stock {
  symbol: string
  price: number
  change: number
  name: string
}

export function StockHeader({ stocks }: { stocks: Stock[] | null }) {
  if (!stocks) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stocks.map((stock) => (
        <Card key={stock.symbol} className="bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stock.name}</p>
                <h3 className="text-2xl font-bold">${stock.price.toFixed(2)}</h3>
              </div>
              <div className={`flex items-center ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                {stock.change >= 0 ? (
                  <ArrowUpIcon className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4 mr-1" />
                )}
                <span className="font-medium">{Math.abs(stock.change).toFixed(2)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

