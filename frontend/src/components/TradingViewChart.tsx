"use client"

import { useEffect, useRef } from "react"
import React from "react"


declare global {
  interface Window {
    TradingView: any
  }
}

interface TradingViewChartProps {
  symbol: string
}

export default function TradingViewChart({ symbol }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/tv.js"
    script.async = true
    script.onload = () => {
      if (containerRef.current) {
        new window.TradingView.MediumWidget({
          container_id: containerRef.current.id,
          symbols: [[symbol, `COINBASE:${symbol}|12m`]],
          greyText: "Quotes by",
          gridLineColor: "#e9e9ea",
          fontColor: "#83888D",
          underLineColor: "#dbeffb",
          trendLineColor: "#4bafe9",
          width: "100%",
          height: "400px",
          locale: "en",
        })
      }
    }
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [symbol])

  return <div id="tradingview_widget_container" ref={containerRef} />
}

