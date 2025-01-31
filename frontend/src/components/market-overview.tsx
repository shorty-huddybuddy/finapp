"use client"

import { useEffect, useRef } from "react"
import React from "react"


export function MarketOverview() {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js"
    script.type = "text/javascript"
    script.async = true
    script.innerHTML = JSON.stringify({
      colorTheme: "light",
      dateRange: "12M",
      showChart: true,
      locale: "en",
      largeChartUrl: "",
      isTransparent: false,
      showSymbolLogo: true,
      showFloatingTooltip: false,
      width: "100%",
      height: "100%",
      plotLineColorGrowing: "rgba(var(--primary), 1)",
      plotLineColorFalling: "rgba(var(--destructive), 1)",
      gridLineColor: "rgba(var(--muted), 0.3)",
      scaleFontColor: "rgba(var(--muted-foreground))",
      belowLineFillColorGrowing: "rgba(var(--primary), 0.12)",
      belowLineFillColorFalling: "rgba(var(--destructive), 0.12)",
      belowLineFillColorGrowingBottom: "rgba(var(--primary), 0)",
      belowLineFillColorFallingBottom: "rgba(var(--destructive), 0)",
      symbolActiveColor: "rgba(var(--primary), 0.12)",
      tabs: [
        {
          title: "Indices",
          symbols: [
            {
              s: "FOREXCOM:SPXUSD",
              d: "S&P 500",
            },
            {
              s: "FOREXCOM:NSXUSD",
              d: "US 100",
            },
            {
              s: "FOREXCOM:DJI",
              d: "Dow 30",
            },
          ],
        },
        {
          title: "Technology",
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
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  )
}

