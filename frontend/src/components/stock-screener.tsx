"use client"

import { useEffect, useRef } from "react"
import React from "react"

export function StockScreener() {
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
      defaultScreen: "general",
      market: "america",
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
  }, [])

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  )
}

