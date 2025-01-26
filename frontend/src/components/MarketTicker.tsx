import React, { useEffect, useState } from 'react';

interface TickerItem {
  symbol: string;
  price: string;
  change: string;
  isPositive: boolean;
}

export function MarketTicker() {
  const [tickerData, setTickerData] = useState<TickerItem[]>([
    { symbol: 'NIFTY 50', price: '22,147.50', change: '+0.75%', isPositive: true },
    { symbol: 'BTC/USD', price: '67,890.00', change: '+1.25%', isPositive: true },
    { symbol: 'ETH/USD', price: '3,890.00', change: '-0.50%', isPositive: false },
    { symbol: 'USD/INR', price: '74.25', change: '-0.15%', isPositive: false },
    { symbol: 'GOLD', price: '2,150.80', change: '+0.90%', isPositive: true }
  ]);

  return (
    <div className="bg-gray-900 text-white py-2 overflow-hidden">
      <div className="animate-ticker flex whitespace-nowrap">
        {[...tickerData, ...tickerData].map((item, index) => (
          <div key={index} className="flex items-center mx-8">
            <span className="font-semibold">{item.symbol}</span>
            <span className="ml-2">{item.price}</span>
            <span className={`ml-2 ${item.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}