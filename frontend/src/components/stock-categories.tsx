"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { Button } from "../components/ui/button"
import { ScrollArea } from "../components/ui/scroll-area"
import { Card, CardContent } from "../components/ui/card"
import React from "react"

interface Stock {
  symbol: string
  price: number
  change: number
  volume?: number
}

interface Category {
  id: string
  title: string
  stocks: Stock[]
}

export function StockCategories({
  categories,
  onSelectStock,
}: {
  categories: Category[]
  onSelectStock: (symbol: string) => void
}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <div key={category.id} className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-between font-medium"
            onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
          >
            {category.title}
            <ChevronRight
              className={`h-4 w-4 transition-transform ${activeCategory === category.id ? "rotate-90" : ""}`}
            />
          </Button>

          {activeCategory === category.id && (
            <Card>
              <CardContent className="p-2">
                <ScrollArea className="h-[300px]">
                  {category.stocks.map((stock) => (
                    <Button
                      key={stock.symbol}
                      variant="ghost"
                      className="w-full justify-between p-4 font-normal"
                      onClick={() => onSelectStock(stock.symbol)}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{stock.symbol}</span>
                        <span className="text-sm text-muted-foreground">${stock.price.toFixed(2)}</span>
                      </div>
                      <span className={stock.change >= 0 ? "text-green-500" : "text-red-500"}>
                        {stock.change >= 0 ? "+" : ""}
                        {stock.change.toFixed(2)}%
                      </span>
                    </Button>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      ))}
    </div>
  )
}

