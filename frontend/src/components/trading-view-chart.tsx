"use client"

import { useEffect, useRef } from "react"

interface TradingViewChartProps {
  symbol: string
  theme?: "light" | "dark"
}

export function TradingViewChart({ symbol, theme = "light" }: TradingViewChartProps) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/tv.js"
    script.async = true
    script.onload = () => {
      if (container.current && window.TradingView) {
        new window.TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: "D",
          timezone: "Etc/UTC",
          theme: theme,
          style: "3", // Use "3" for line chart (1 = bars, 2 = candles, 3 = line)
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          container_id: container.current.id,
          studies: [], // Remove default studies
          show_popup_button: true,
          popup_width: "1000",
          popup_height: "650",
          hide_volume: true, // Hide volume by default
          range: "YTD", // Show year-to-date range by default
        })
      }
    }
    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [symbol, theme])

  return (
    <div className="tradingview-chart h-full">
      <div id="tradingview_widget" ref={container} className="h-full" />
    </div>
  )
}

