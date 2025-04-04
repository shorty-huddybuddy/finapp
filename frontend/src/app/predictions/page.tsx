'use client'
import React, { useState } from "react";
import { Navbar2 } from "../../components/Navbar2";
import { Footer } from "../../components/Footer";
import PredictionChart from "../../components/PredictionChart";

export default function Prediction() {
  // Default tickers to display
  const defaultTickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "CSCO", "META", "TSLA", "NVDA", "JPM", "WMT"];

  // State to manage the current ticker and input value
  const [currentTicker, setCurrentTicker] = useState<string>(defaultTickers[0]);
  const [inputTicker, setInputTicker] = useState("");
  const [error, setError] = useState("");

  // Handle form submission to search for a new ticker
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputTicker.trim()) {
      setError("Please enter a valid ticker symbol");
      return;
    }

    const ticker = inputTicker.trim().toUpperCase();
    setError("");
    setCurrentTicker(ticker);
    setInputTicker("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar2/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Stock <span className="text-blue-600">Predictions</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl">
            Analyze and visualize future trends for your favorite stocks
          </p>
        </div>
        
        {/* Ticker Input Form */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-12 transition-all duration-300 hover:shadow-2xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-4 px-6">
            <h2 className="text-xl font-semibold text-white">Search Stock</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <label htmlFor="ticker" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter Stock Ticker Symbol
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    id="ticker"
                    value={inputTicker}
                    onChange={(e) => setInputTicker(e.target.value)}
                    placeholder="e.g. AAPL, MSFT"
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                {error && (
                  <p className="mt-2 text-red-600 text-sm">{error}</p>
                )}
              </div>
              <div className="self-end">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Search Ticker
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Stock Info Quick Tips */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-12">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Stock Tickers</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {defaultTickers.map((symbol) => (
              <button
                key={symbol}
                onClick={() => setCurrentTicker(symbol)}
                className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 
                  ${currentTicker === symbol 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
              >
                {symbol}
              </button>
            ))}
          </div>
        </div>


        {/* Display chart for the current ticker */}
        <div className="grid grid-cols-1 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 py-4 px-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">{currentTicker} Stock Prediction</h2>
            </div>
            <div className="p-6">
              <PredictionChart ticker={currentTicker} />
            </div>
          </div>
        </div>
        
      </div>
      <Footer/>
    </div>
  );
}