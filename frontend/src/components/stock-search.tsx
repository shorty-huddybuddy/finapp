"use client"
import React from "react"
import { useState, useEffect, useRef } from "react"
import { Search, X, Loader2 } from "lucide-react"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"

interface Symbol {
  symbol: string
  name: string
  type: string
  exchange: string
}

// Default suggestions grouped by category
const DEFAULT_SUGGESTIONS = {
  "Popular Stocks": [
    { symbol: "AAPL", name: "Apple Inc.", type: "stock", exchange: "NASDAQ" },
    { symbol: "MSFT", name: "Microsoft Corporation", type: "stock", exchange: "NASDAQ" },
    { symbol: "GOOGL", name: "Alphabet Inc.", type: "stock", exchange: "NASDAQ" },
    { symbol: "TSLA", name: "Tesla, Inc.", type: "stock", exchange: "NASDAQ" },
    { symbol: "NVDA", name: "NVIDIA Corporation", type: "stock", exchange: "NASDAQ" },
    { symbol: "META", name: "Meta Platforms Inc.", type: "stock", exchange: "NASDAQ" },
  ],
  "Market Indices": [
    { symbol: "SPX", name: "S&P 500", type: "index", exchange: "SP" },
    { symbol: "NDX", name: "Nasdaq 100", type: "index", exchange: "NASDAQ" },
    { symbol: "DJI", name: "Dow Jones Industrial Average", type: "index", exchange: "DJ" },
    { symbol: "RUT", name: "Russell 2000", type: "index", exchange: "RUSSELL" },
  ],
  "Popular ETFs": [
    { symbol: "SPY", name: "SPDR S&P 500 ETF", type: "etf", exchange: "NYSE" },
    { symbol: "QQQ", name: "Invesco QQQ Trust", type: "etf", exchange: "NASDAQ" },
    { symbol: "IWM", name: "iShares Russell 2000 ETF", type: "etf", exchange: "NYSE" },
    { symbol: "VTI", name: "Vanguard Total Stock Market ETF", type: "etf", exchange: "NYSE" },
  ],
}

// Common stock symbols and their details for search
const COMMON_STOCKS = [
  { symbol: "AAPL", name: "Apple Inc.", type: "stock", exchange: "NASDAQ" },
  { symbol: "MSFT", name: "Microsoft Corporation", type: "stock", exchange: "NASDAQ" },
  { symbol: "GOOGL", name: "Alphabet Inc.", type: "stock", exchange: "NASDAQ" },
  { symbol: "AMZN", name: "Amazon.com Inc.", type: "stock", exchange: "NASDAQ" },
  { symbol: "TSLA", name: "Tesla, Inc.", type: "stock", exchange: "NASDAQ" },
  { symbol: "NVDA", name: "NVIDIA Corporation", type: "stock", exchange: "NASDAQ" },
  { symbol: "META", name: "Meta Platforms Inc.", type: "stock", exchange: "NASDAQ" },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", type: "stock", exchange: "NYSE" },
  { symbol: "V", name: "Visa Inc.", type: "stock", exchange: "NYSE" },
  { symbol: "WMT", name: "Walmart Inc.", type: "stock", exchange: "NYSE" },
  { symbol: "JNJ", name: "Johnson & Johnson", type: "stock", exchange: "NYSE" },
  { symbol: "MA", name: "Mastercard Inc.", type: "stock", exchange: "NYSE" },
  { symbol: "PG", name: "Procter & Gamble Co.", type: "stock", exchange: "NYSE" },
  { symbol: "HD", name: "Home Depot Inc.", type: "stock", exchange: "NYSE" },
  { symbol: "BAC", name: "Bank of America Corp.", type: "stock", exchange: "NYSE" },
  { symbol: "DIS", name: "Walt Disney Co.", type: "stock", exchange: "NYSE" },
  { symbol: "NFLX", name: "Netflix Inc.", type: "stock", exchange: "NASDAQ" },
  { symbol: "ADBE", name: "Adobe Inc.", type: "stock", exchange: "NASDAQ" },
  { symbol: "PYPL", name: "PayPal Holdings Inc.", type: "stock", exchange: "NASDAQ" },
  { symbol: "INTC", name: "Intel Corporation", type: "stock", exchange: "NASDAQ" },
]

export function StockSearch({ onSelect }: { onSelect: (symbol: string) => void }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<Symbol[]>([])

  useEffect(() => {
    if (!value.trim()) {
      setSearchResults([])
      return
    }

    setIsLoading(true)

    // Filter common stocks based on search input
    const results = COMMON_STOCKS.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(value.toLowerCase()) ||
        stock.name.toLowerCase().includes(value.toLowerCase()),
    ).slice(0, 10) // Limit to 10 results

    // Simulate network delay for smoother UX
    setTimeout(() => {
      setSearchResults(results)
      setIsLoading(false)
    }, 150)
  }, [value])

  const handleSelect = (symbol: string) => {
    onSelect(symbol)
    setValue("")
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex w-full sm:w-auto gap-2">
          <div className="relative w-full sm:w-[300px]">
            <Input
              type="text"
              placeholder="Symbol, eg. AAPL"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="pr-8"
            />
            {value && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setValue("")}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
          </div>
          <Button size="icon">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            <span className="sr-only">Search</span>
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[300px]" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {value.trim() === "" ? (
              // Show default suggestions when no search query
              Object.entries(DEFAULT_SUGGESTIONS).map(([category, items]) => (
                <CommandGroup key={category} heading={category}>
                  {items.map((item) => (
                    <CommandItem
                      key={item.symbol}
                      onSelect={() => handleSelect(item.symbol)}
                      className="flex flex-col items-start gap-1 py-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.symbol}</span>
                        <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded-sm bg-muted">
                          {item.exchange}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">{item.name}</span>
                    </CommandItem>
                  ))}
                  <CommandSeparator />
                </CommandGroup>
              ))
            ) : (
              // Show search results when typing
              <CommandGroup heading="Search Results">
                {isLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((item) => (
                    <CommandItem
                      key={item.symbol}
                      onSelect={() => handleSelect(item.symbol)}
                      className="flex flex-col items-start gap-1 py-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.symbol}</span>
                        <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded-sm bg-muted">
                          {item.exchange}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">{item.name}</span>
                    </CommandItem>
                  ))
                ) : (
                  <CommandEmpty>No results found.</CommandEmpty>
                )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

