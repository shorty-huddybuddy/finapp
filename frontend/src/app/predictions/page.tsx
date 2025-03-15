// pages/index.js

'use client'
import React from "react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import PredictionChart from "../../components/PredictionChart";

export default function Prediction() {
  // Array of ticker symbols to display
  const tickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "CSCO"];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Navbar/><br /><br />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Stock Predictions</h1>
        
        {/* Map through tickers array and render a PredictionChart for each ticker */}
        {tickers.map((ticker) => (
          <div key={ticker} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">{ticker} Stock Prediction</h2>
            <PredictionChart ticker={ticker} />
          </div>
        ))}
      </div>
      <br /><br /><Footer/>
    </div>
  );
}