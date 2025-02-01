import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { ArrowUp } from "lucide-react"
import React from "react"

interface TopGainersProps {
  data: any[]
  onSelectCoin: (coin: string) => void
}

export default function TopGainers({ data, onSelectCoin }: TopGainersProps) {
  if (!data) {
    return (
      <Card className="bg-[#1A2332] border-[#2A3442]">
        <CardHeader>
          <CardTitle className="text-white">Top Gainers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">Loading...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-[#1A2332] border-[#2A3442]">
      <CardHeader>
        <CardTitle className="text-white">Top Gainers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {data.map((coin) => (
          <div
            key={coin.id}
            className="flex items-center justify-between p-2 rounded hover:bg-[#2A3442] cursor-pointer"
            onClick={() => onSelectCoin(`${coin.symbol.toUpperCase()}USD`)}
          >
            <span className="font-medium text-white">{coin.symbol.toUpperCase()}</span>
            <div className="text-right">
              <div className="text-white">${coin.current_price.toLocaleString()}</div>
              <div className="text-sm flex items-center gap-1 text-green-500">
                <ArrowUp className="w-4 h-4" />
                {coin.price_change_percentage_24h.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

