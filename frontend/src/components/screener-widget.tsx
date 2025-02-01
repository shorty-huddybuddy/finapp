"use client"

import { useEffect, useRef } from "react"
import React from "react"


interface ScreenerWidgetProps {
  defaultScreen: "general" | "performance" | "valuation" | "divide" | "custom"
  market?: "america" | "europe" | "asia" | "forex" | "crypto"
}

export function ScreenerWidget({ defaultScreen = "general", market = "america" }: ScreenerWidgetProps) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js"
    script.type = "text/javascript"
    script.async = true
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: "100%",
      defaultColumn: "overview",
      defaultScreen: defaultScreen,
      market: market,
      showToolbar: true,
      colorTheme: "light",
      locale: "en",
      transparency: false,
    })

    if (container.current) {
      container.current.appendChild(script)
    }

    return () => {
      if (container.current && script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [defaultScreen, market])

  return (
    <div className="tradingview-widget-container h-full" ref={container}>
      <div className="tradingview-widget-container__widget h-full"></div>
    </div>
  )
}

