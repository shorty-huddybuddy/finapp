"use client"

import { useEffect, useRef } from "react"
import React from "react"

export function MarketOverviewWidget() {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js"
    script.type = "text/javascript"
    script.async = true
    script.innerHTML = JSON.stringify({
      colorTheme: "light",
      dateRange: "1D",
      showChart: true,
      locale: "en",
      largeChartUrl: "",
      isTransparent: false,
      showSymbolLogo: true,
      showFloatingTooltip: false,
      width: "100%",
      height: "100%",
      tabs: [
        {
          title: "Indices",
          symbols: [
            {
              s: "FOREXCOM:SPXUSD",
              d: "S&P 500",
            },
            {
              s: "NASDAQ:NDX",
              d: "Nasdaq 100",
            },
            {
              s: "FOREXCOM:DJI",
              d: "Dow 30",
            },
            {
              s: "RUSSELL:RUT",
              d: "Russell 2000",
            },
          ],
          originalTitle: "Indices",
        },
        {
          title: "Major Stocks",
          symbols: [
            {
              s: "NASDAQ:AAPL",
              d: "Apple",
            },
            {
              s: "NASDAQ:MSFT",
              d: "Microsoft",
            },
            {
              s: "NASDAQ:GOOGL",
              d: "Google",
            },
            {
              s: "NASDAQ:AMZN",
              d: "Amazon",
            },
          ],
        },
      ],
    })

    if (container.current) {
      container.current.appendChild(script)
    }

    return () => {
      if (container.current && script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  return (
    <div className="tradingview-widget-container h-full" ref={container}>
      <div className="tradingview-widget-container__widget h-full"></div>
    </div>
  )
}

