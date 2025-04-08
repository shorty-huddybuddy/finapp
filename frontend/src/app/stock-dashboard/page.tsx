// "use client"

// import React from "react"
// import { useEffect, useState } from "react"
// import { Card, CardContent } from "../../components/ui/card"
// import { SymbolOverviewWidget } from "../../components/symbol-overview-widget"
// import { MarketOverviewWidget } from "../../components/market-overview-widget"
// import { CustomScreener } from "../../components/custom-screener"
// import { TradingViewChart } from "../../components/trading-view-chart"
// import { StockSearch } from "../../components/stock-search"
// import { useUser } from "@clerk/nextjs";
// import {Navbar} from "../../components/Navbar"
// import {Footer} from "../../components/Footer"
// import {Chatbot} from "../../components/Chatbot"
// import {Loader} from "../../components/Loader"
// import crypto from "crypto"

// export default function Dashboard() {
//   const [loading, setLoading] = useState(true)
//   const [selectedSymbol, setSelectedSymbol] = useState("AAPL")

//   useEffect(() => {
//     // Load the chatbot script
//     const onLoad = () => {
//       const script = document.createElement("script")
//       script.src = "https://www.chatbase.co/embed.min.js"
//       script.id = "2In_f7kIwyagxPktG5fIe"
//       script.setAttribute("data-domain", "www.chatbase.co")
//       document.body.appendChild(script)
//     }

//     if (document.readyState === "complete") {
//       onLoad()
//     } else {
//       <Loader/>
//       window.addEventListener("load", onLoad)
//     }

//     // Cleanup function to remove the script when the component unmounts
//     return () => {
//       const script = document.getElementById("2In_f7kIwyagxPktG5fIe")
//       if (script) {
//         document.body.removeChild(script)
//       }
//     }
//   }, [])

//   // Example user authentication (if needed)
//   const current_user = { id: "user-uuid-here" } // Replace with actual user ID
//   const secret = "h0evxrcvs1g8dynoburr3957l39arwsy" // Your verification secret key
//   const userId = current_user.id
//   const hash = crypto.createHmac("sha256", secret).update(userId).digest("hex")

//   // You can now use `hash` and `userId` to authenticate the user with the chatbot service

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar/>
//       <div className="container mx-auto p-4 space-y-6">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <h1 className="text-2xl font-bold">Stock Dashboard</h1>
//           <StockSearch onSelect={setSelectedSymbol} />
//         </div>
//         <Card>
//           <CardContent className="p-4">
//             <SymbolOverviewWidget />
//           </CardContent>
//         </Card>
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           <div className="lg:col-span-1 h-[600px]">
//             <Card className="h-full">
//               <CardContent className="p-4 h-full">
//                 <CustomScreener />
//               </CardContent>
//             </Card>
//           </div>
//           <div className="lg:col-span-3 h-[600px]">
//             <Card className="h-full">
//               <CardContent className="p-4 h-full">
//                 <TradingViewChart symbol={`NASDAQ:${selectedSymbol}`} />
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     <Footer/>

//     <br/><br/>
//     </div>
//   )
// }

"use client";

import React, { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { SymbolOverviewWidget } from "../../components/symbol-overview-widget";
import { CustomScreener } from "../../components/custom-screener";
import { TradingViewChart } from "../../components/trading-view-chart";
import { StockSearch } from "../../components/stock-search";
import { Navbar2 } from "../../components/Navbar2";
import { Footer } from "../../components/Footer";
import { Chatbot } from "../../components/Chatbot"; // New chatbot component

export default function Dashboard() {
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");


  return (
    <div className="min-h-screen bg-background">
      <Navbar2 />
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">Stock Dashboard</h1>
          <StockSearch onSelect={setSelectedSymbol} />
        </div>
        <Card>
          <CardContent className="p-4">
            <SymbolOverviewWidget />
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 h-[600px]">
            <Card className="h-full">
              <CardContent className="p-4 h-full">
                <CustomScreener />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-3 h-[600px]">
            <Card className="h-full">
              <CardContent className="p-4 h-full">
                <TradingViewChart symbol={`NASDAQ:${selectedSymbol}`} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
      {/* New Chatbot component */}
      <Chatbot />
      <br />
      <br />
    </div>
  );
}
