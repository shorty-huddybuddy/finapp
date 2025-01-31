"use client"

import { useEffect, useRef } from "react"
import React from "react"

declare global {
  interface Window {
    TradingView: any
  }
}

interface TradingViewWidgetProps {
  symbols?: string[][]
  height?: string | number
}

export function TradingViewWidget({
  symbols = [
    ["AAPL", "NASDAQ:AAPL|12m"],
    ["MSFT", "NASDAQ:MSFT|12m"],
    ["GOOGL", "NASDAQ:GOOGL|12m"],
    ["AMZN", "NASDAQ:AMZN|12m"],
  ],
  height = "400",
}: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/tv.js"
    script.async = true
    script.onload = () => {
      if (container.current && window.TradingView) {
        new window.TradingView.MediumWidget({
          container_id: container.current.id,
          symbols: symbols,
          greyText: "Quotes by",
          gridLineColor: "#e9e9ea",
          fontColor: "rgb(var(--foreground))",
          underLineColor: "rgba(var(--primary), 0.3)",
          trendLineColor: "rgba(var(--primary), 1)",
          width: "100%",
          height: height,
          locale: "en",
        })
      }
    }
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [symbols, height])

  return (
    <div className="tradingview-widget-container">
      <div id="tradingview_widget" ref={container}></div>
    </div>
  )
}

