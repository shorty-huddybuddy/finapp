"use client"

import { useEffect, useRef } from "react"
import React from "react"

interface TechnicalAnalysisProps {
  symbol: string
}

export default function TechnicalAnalysis({ symbol }: TechnicalAnalysisProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js"
    script.async = true
    script.innerHTML = JSON.stringify({
      showIntervalTabs: true,
      width: "100%",
      colorTheme: "light",
      isTransparent: false,
      locale: "en",
      symbol: `COINBASE:${symbol}`,
      interval: "1W",
      height: "400",
    })

    if (containerRef.current) {
      containerRef.current.innerHTML = ""
      containerRef.current.appendChild(script)
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [symbol])

  return <div ref={containerRef} />
}

