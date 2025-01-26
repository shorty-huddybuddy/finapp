import { Card, CardContent } from "@/components/ui/card"
import { ArrowDown, ArrowUp } from "lucide-react"

interface MarketSummaryProps {
  data: any[]
}

export default function MarketSummary({ data }: MarketSummaryProps) {
  if (!data) {
    return (
      <>
        {[1, 2, 3, 4].map((index) => (
          <Card key={index} className="bg-white border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Loading...</span>
                <span className="text-sm text-gray-400">Loading...</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">---.--</div>
            </CardContent>
          </Card>
        ))}
      </>
    )
  }

  return (
    <>
      {data.slice(0, 4).map((coin) => (
        <Card key={coin.id} className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{coin.symbol.toUpperCase()}</span>
              <span
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
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-800">${coin.current_price.toLocaleString()}</div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

