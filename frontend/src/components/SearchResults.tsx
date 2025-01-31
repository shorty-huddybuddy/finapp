import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { ArrowDown, ArrowUp } from "lucide-react"
import React from "react"

interface SearchResultsProps {
  data: any[]
  onSelectCoin: (symbol: string) => void
}

export default function SearchResults({ data, onSelectCoin }: SearchResultsProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-800">Search Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">No results found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle className="text-gray-800">Search Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {data.map((coin) => (
          <div
            key={coin.id}
            className="flex items-center justify-between p-2 rounded hover:bg-gray-100 cursor-pointer"
            onClick={() => onSelectCoin(coin.symbol.toUpperCase())}
          >
            <div className="flex items-center gap-2">
              <img src={coin.image || "/placeholder.svg"} alt={coin.name} className="w-6 h-6" />
              <span className="font-medium text-gray-800">
                {coin.name} ({coin.symbol.toUpperCase()})
              </span>
            </div>
            <div className="text-right">
              <div className="text-gray-800">${coin.current_price.toLocaleString()}</div>
              <div
                className={`text-sm flex items-center gap-1 ${
                  coin.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {coin.price_change_percentage_24h >= 0 ? (
                  <ArrowUp className="w-4 h-4" />
                ) : (
                  <ArrowDown className="w-4 h-4" />
                )}
                {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

