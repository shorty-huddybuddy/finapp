// "use client"
// import React from "react"
// import { useEffect, useRef, useState } from "react"

// export function CustomScreener() {
//   const container = useRef<HTMLDivElement>(null)
//   const [isInitialized, setIsInitialized] = useState(false)

//   useEffect(() => {
//     // Prevent multiple initializations
//     if (isInitialized || !container.current) return

//     const widgetContainer = container.current.querySelector('.tradingview-widget-container__widget')
    
//     // Check if widget is already initialized
//     if (widgetContainer && widgetContainer.children.length > 0) return
    
//     const script = document.createElement("script")
//     script.src = "https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js"
//     script.type = "text/javascript"
//     script.async = true
//     script.innerHTML = JSON.stringify({
//       colorTheme: "light",
//       dateRange: "12M",
//       exchange: "US",
//       showChart: true,
//       locale: "en",
//       largeChartUrl: "",
//       isTransparent: false,
//       showSymbolLogo: true,
//       showFloatingTooltip: false,
//       width: "100%",
//       height: "100%",
//       plotLineColorGrowing: "rgba(41, 98, 255, 1)",
//       plotLineColorFalling: "rgba(41, 98, 255, 1)",
//       gridLineColor: "rgba(240, 243, 250, 0)",
//       scaleFontColor: "rgba(120, 123, 134, 1)",
//       belowLineFillColorGrowing: "rgba(41, 98, 255, 0.12)",
//       belowLineFillColorFalling: "rgba(41, 98, 255, 0.12)",
//       belowLineFillColorGrowingBottom: "rgba(41, 98, 255, 0)",
//       belowLineFillColorFallingBottom: "rgba(41, 98, 255, 0)",
//       symbolActiveColor: "rgba(41, 98, 255, 0.12)",
//       tabs: [
//         {
//           title: "Gainers",
//           symbols: [
//             {
//               s: "NASDAQ:TOPS",
//               d: "Top Gainers",
//             },
//           ],
//         },
//         {
//           title: "Losers",
//           symbols: [
//             {
//               s: "NASDAQ:BOTM",
//               d: "Top Losers",
//             },
//           ],
//         },
//         {
//           title: "Most Active",
//           symbols: [
//             {
//               s: "NASDAQ:ACTIVE",
//               d: "Most Active",
//             },
//           ],
//         },
//         {
//           title: "All Time Highs",
//           symbols: [
//             {
//               s: "NASDAQ:HIGH",
//               d: "All Time Highs",
//             },
//           ],
//         },
//       ],
//     })

//     // Set attribute to identify this script
//     script.setAttribute('data-widget-id', 'custom-screener')
    
//     // Mark as initialized before appending to prevent any race conditions
//     setIsInitialized(true)
    
//     if (container.current) {
//       container.current.innerHTML = "";
//       container.current.appendChild(script)
//     }

//     return () => {
//       if (script.parentNode) {
//         script.parentNode.removeChild(script)
//       }
//       setIsInitialized(false)
//     }
//   }, [isInitialized])

//   return (
//     <div className="tradingview-widget-container h-full" ref={container}>
//       <div className="tradingview-widget-container__widget h-full"></div>
//     </div>
//   )
// }


"use client";
import React, { useState, useRef, useEffect } from "react";

export function CustomScreener() {
  const container = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || initializedRef.current || !container.current) return;

    const widgetContainer = container.current.querySelector(
      ".tradingview-widget-container__widget"
    );
    if (widgetContainer && widgetContainer.children.length > 0) {
      initializedRef.current = true;
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: "light",
      dateRange: "12M",
      exchange: "US",
      showChart: true,
      locale: "en",
      largeChartUrl: "",
      isTransparent: false,
      showSymbolLogo: true,
      showFloatingTooltip: false,
      width: "100%",
      height: "100%",
      plotLineColorGrowing: "rgba(41, 98, 255, 1)",
      plotLineColorFalling: "rgba(41, 98, 255, 1)",
      gridLineColor: "rgba(240, 243, 250, 0)",
      scaleFontColor: "rgba(120, 123, 134, 1)",
      belowLineFillColorGrowing: "rgba(41, 98, 255, 0.12)",
      belowLineFillColorFalling: "rgba(41, 98, 255, 0.12)",
      belowLineFillColorGrowingBottom: "rgba(41, 98, 255, 0)",
      belowLineFillColorFallingBottom: "rgba(41, 98, 255, 0)",
      symbolActiveColor: "rgba(41, 98, 255, 0.12)",
      tabs: [
        {
          title: "Gainers",
          symbols: [
            {
              s: "NASDAQ:TOPS",
              d: "Top Gainers",
            },
          ],
        },
        {
          title: "Losers",
          symbols: [
            {
              s: "NASDAQ:BOTM",
              d: "Top Losers",
            },
          ],
        },
        {
          title: "Most Active",
          symbols: [
            {
              s: "NASDAQ:ACTIVE",
              d: "Most Active",
            },
          ],
        },
        {
          title: "All Time Highs",
          symbols: [
            {
              s: "NASDAQ:HIGH",
              d: "All Time Highs",
            },
          ],
        },
      ],
    });
    script.setAttribute("data-widget-id", "custom-screener");

    container.current.innerHTML = "";
    container.current.appendChild(script);
    initializedRef.current = true;

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [mounted]);

  if (!mounted) return null;
  return (
    <div className="tradingview-widget-container h-full" ref={container}>
      <div className="tradingview-widget-container__widget h-full"></div>
    </div>
  );
}