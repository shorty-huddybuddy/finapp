'use client'
import React, { useState, useEffect } from "react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import PredictionChart from "../../components/PredictionChart";

export default function Prediction() {
  // Default tickers to display
  const defaultTickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "CSCO"];
  
  // State to manage current tickers and input value
  const [tickers, setTickers] = useState<string[]>([]);
  const [inputTicker, setInputTicker] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Load default tickers on component mount
  useEffect(() => {
    setTickers(defaultTickers);
  }, []);

  // Handle form submission to add a new ticker
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputTicker.trim()) {
      setError("Please enter a valid ticker symbol");
      return;
    }
    
    const ticker = inputTicker.trim().toUpperCase();
    
    // Check if ticker already exists
    if (tickers.includes(ticker)) {
      setError("This ticker is already displayed");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      // You can add actual API validation here if needed
      // For example, check if the ticker exists before adding it
      
      // Simulate API call to validate ticker
      // const response = await fetch(`/api/validate-ticker?ticker=${ticker}`);
      // if (!response.ok) throw new Error("Invalid ticker symbol");
      
      // Add the new ticker to the list
      setTickers(prev => [ticker, ...prev]);
      setInputTicker("");
    } catch (err) {
      setError("Failed to add ticker. Please check the symbol and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar/>
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
            <h2 className="text-xl font-semibold text-white">Add New Stock</h2>
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
                    disabled={isLoading}
                  />
                </div>
                {error && (
                  <p className="mt-2 text-red-600 text-sm">{error}</p>
                )}
              </div>
              <div className="self-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:bg-blue-300"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </>
                  ) : (
                    <>Add Ticker</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Display charts for each ticker */}
        {tickers.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-xl shadow-lg border border-gray-100">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No tickers added</h3>
            <p className="mt-1 text-gray-500">Add a ticker symbol above to see stock predictions.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 mb-8">
            {tickers.map((ticker) => (
              <div key={ticker} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 py-4 px-6 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">{ticker} Stock Prediction</h2>
                  <button 
                    onClick={() => setTickers(prev => prev.filter(t => t !== ticker))}
                    className="flex items-center justify-center h-8 w-8 rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200"
                    aria-label={`Remove ${ticker}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  <PredictionChart ticker={ticker} />
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Stock Info Quick Tips */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-12">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Stock Tickers</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {["AAPL", "MSFT", "GOOGL", "AMZN", "META", "TSLA", "NVDA", "JPM", "V", "WMT"].map((symbol) => (
              <button
                key={symbol}
                onClick={() => {
                  if (!tickers.includes(symbol)) {
                    setTickers(prev => [symbol, ...prev.filter(t => t !== symbol)]);
                  }
                }}
                disabled={tickers.includes(symbol)}
                className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 
                  ${tickers.includes(symbol) 
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
              >
                {symbol}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}