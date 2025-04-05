// "use client"
// import React from "react"
// import { useEffect, useRef, useState } from "react"

// export function SymbolOverviewWidget() {
//   const container = useRef<HTMLDivElement>(null)
//   const [initialized, setInitialized] = useState(false)

//   useEffect(() => {
//     // Prevent duplicate initialization
//     if (initialized || !container.current) return

//     // Check if widget already exists in the container
//     const existingScript = container.current.querySelector('script[src*="embed-widget-symbol-overview.js"]')
//     if (existingScript) return

//     const script = document.createElement("script")
//     script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js"
//     script.type = "text/javascript"
//     script.async = true
//     script.innerHTML = JSON.stringify({
//       symbols: [["NASDAQ:AAPL|1D"], ["NASDAQ:MSFT|1D"], ["NASDAQ:GOOGL|1D"], ["NASDAQ:AMZN|1D"]],
//       chartOnly: false,
//       width: "100%",
//       height: "100%",
//       locale: "en",
//       colorTheme: "light",
//       autosize: true,
//       showVolume: false,
//       showMA: false,
//       hideDateRanges: false,
//       hideMarketStatus: false,
//       hideSymbolLogo: false,
//       scalePosition: "right",
//       scaleMode: "Normal",
//       fontFamily: "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
//       fontSize: "10",
//       noTimeScale: false,
//       valuesTracking: "1",
//       changeMode: "price-and-percent",
//       chartType: "area",
//       maLineColor: "#2962FF",
//       maLineWidth: 1,
//       maLength: 9,
//       lineWidth: 2,
//       lineType: 0,
//     })

//     container.current.appendChild(script)
//     setInitialized(true)

//     return () => {
//       if (container.current) {
//         // More thorough cleanup
//         container.current.innerHTML = "";
//         const scripts = container.current.querySelectorAll('script[src*="embed-widget-symbol-overview.js"]')
//         scripts.forEach(script => script.parentNode?.removeChild(script))
        
//         // Reset initialized state
//         setInitialized(false)
//       }
//     }
//   }, [initialized])

//   return (
//     <div className="tradingview-widget-container h-[120px] symbol-overview-instance" ref={container}>
//       <div className="tradingview-widget-container__widget h-full"></div>
//     </div>
//   )
// }


"use client";
import React, { useEffect, useRef, useState } from "react";

export function SymbolOverviewWidget() {
  const container = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || initializedRef.current || !container.current) return;

    const existingScript = container.current.querySelector(
      'script[src*="embed-widget-symbol-overview.js"]'
    );
    if (existingScript) {
      initializedRef.current = true;
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        ["NASDAQ:AAPL|1D"],
        ["NASDAQ:MSFT|1D"],
        ["NASDAQ:GOOGL|1D"],
        ["NASDAQ:AMZN|1D"],
      ],
      chartOnly: false,
      width: "100%",
      height: "100%",
      locale: "en",
      colorTheme: "light",
      autosize: true,
      showVolume: false,
      showMA: false,
      hideDateRanges: false,
      hideMarketStatus: false,
      hideSymbolLogo: false,
      scalePosition: "right",
      scaleMode: "Normal",
      fontFamily:
        "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
      fontSize: "10",
      noTimeScale: false,
      valuesTracking: "1",
      changeMode: "price-and-percent",
      chartType: "area",
      maLineColor: "#2962FF",
      maLineWidth: 1,
      maLength: 9,
      lineWidth: 2,
      lineType: 0,
    });

    container.current.appendChild(script);
    initializedRef.current = true;

    return () => {
      if (container.current) {
        container.current.innerHTML = "";
      }
    };
  }, [mounted]);

  if (!mounted) return null;
  return (
    <div
      className="tradingview-widget-container h-[120px] symbol-overview-instance"
      ref={container}
    >
      <div className="tradingview-widget-container__widget h-full"></div>
    </div>
  );
}