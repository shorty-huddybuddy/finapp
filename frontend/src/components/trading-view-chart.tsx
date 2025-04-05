"use client";

import { useEffect, useRef } from "react";
import React from "react";

declare global {
  interface Window {
    TradingView: any;
  }
}

interface TradingViewChartProps {
  symbol: string;
  theme?: "light" | "dark";
}

export function TradingViewChart({ symbol, theme = "light" }: TradingViewChartProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadWidget = () => {
      if (container.current && window.TradingView) {
        // Clear previous widget if any
        container.current.innerHTML = "";
        new window.TradingView.widget({
          autosize: true,
          symbol,
          interval: "D",
          timezone: "Etc/UTC",
          theme,
          style: "3",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          container_id: container.current.id,
          studies: [],
          show_popup_button: true,
          popup_width: "1000",
          popup_height: "650",
          hide_volume: true,
          range: "YTD",
        });
      }
    };

    if (window.TradingView) {
      loadWidget();
    } else {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = loadWidget;
      document.head.appendChild(script);
    }

    return () => {
      if (container.current) container.current.innerHTML = "";
    };
  }, [symbol, theme]);

  return (
    <div className="tradingview-chart h-full">
      <div id="tradingview_widget" ref={container} className="h-full" />
    </div>
  );
}
