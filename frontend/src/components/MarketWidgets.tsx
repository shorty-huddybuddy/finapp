import React, { useEffect } from "react";

declare global {
  interface Window {
    Widget: any;
  }
}

export function MarketWidgets() {
  var flag = 1;

  useEffect(() => {
    // Check if the Finlogix script is already added to the DOM
    const existingScript = document.querySelector(
      'script[src="https://widget.finlogix.com/Widget.js"]'
    );

    if (!existingScript) {
      // Create and append the script if it doesn't exist
      const script = document.createElement("script");
      script.src = "https://widget.finlogix.com/Widget.js";
      script.async = true;
      script.onload = () => {
        initializeWidget(); // Initialize widget after script loads
      };
      if (flag === 1) {
        flag = 2;
        document.body.appendChild(script);
      }
    } else if (window.Widget && window.Widget.init) {
      // If script already exists, ensure the widget is initialized
      initializeWidget();
    }

    // Optional cleanup function to remove the script when the component unmounts
    return () => {
      const addedScript = document.querySelector(
        'script[src="https://widget.finlogix.com/Widget.js"]'
      );
      if (addedScript) {
        document.body.removeChild(addedScript);
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once

  // Widget initialization logic
  const initializeWidget = () => {
    const symbols = [
      // { id: "83", name: "INDIA50", icon: "fas fa-chart-line" },
      { id: "20273", name: "HDFC Bank", icon: "fas fa-university" },
      { id: "20281", name: "ICICI Bank", icon: "fas fa-piggy-bank" },
      { id: "20070", name: "Infosys", icon: "fas fa-laptop-code" },
      { id: "20199", name: "AXIS Capital", icon: "fas fa-building" },
      { id: "10029", name: "Microsoft", icon: "fab fa-microsoft" },
      { id: "66", name: "BTC/USD", icon: "fab fa-bitcoin" },
      { id: "20317", name: "Reliance Steel", icon: "fas fa-industry" },
      { id: "10007", name: "Apple", icon: "fab fa-apple" },
      { id: "19", name: "EUR/USD", icon: "fas fa-euro-sign" },
    ];

    if (window.Widget && window.Widget.init) {
      window.Widget.init({
        widgetId: "720e589b-b9f1-40f8-904d-79ecc0ff2d18",
        type: "StripBar",
        language: "en",
        symbolPairs: symbols.map((sym) => ({
          symbolId: sym.id,
          symbolName: sym.name,
        })),
        isAdaptive: true,
      });
    }
  };

  return (
    <section className="market-status-section-unique py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-16">Market Pulse</h2>

        {/* Finlogix Widget */}
        <div className="finlogix-container mb-16" id="marketWidgets" />

        {/* Market News Timeline */}
        <div className="mb-16">
          <iframe
            src="https://www.tradingview-widget.com/embed-widget/timeline/#%7B%22isTransparent%22%3Afalse%2C%22displayMode%22%3A%22adaptive%22%2C%22currentTheme%22%3A%22light%22%2C%22locale%22%3A%22in%22%7D"
            className="w-full h-[445px] border-none"
          />
        </div>

        {/* Cryptocurrency Heatmap
        <div className="mb-16">
          <h3 className="text-2xl font-semibold mb-8">Cryptocurrency Market</h3>
          <iframe 
            src="https://www.tradingview-widget.com/embed-widget/crypto-coins-heatmap/?locale=in#%7B%22dataSource%22:%22Crypto%22,%22blockSize%22:%22market_cap_calc%22,%22blockColor%22:%22change%22,%22locale%22:%22in%22,%22symbolUrl%22:%22%22,%22colorTheme%22:%22light%22,%22hasTopBar%22:false,%22isDataSetEnabled%22:false,%22isZoomEnabled%22:true,%22hasSymbolTooltip%22:true,%22width%22:%22auto%22,%22height%22:500%7D"
            className="w-full h-[500px] border-none"
          />
        </div> */}

        {/* Indian Stocks Heatmap
        <div className="mb-16">
          <h3 className="text-2xl font-semibold mb-8">Indian Stock Market</h3>
          <iframe 
            src="https://www.tradingview-widget.com/embed-widget/stock-heatmap/?locale=in#%7B%22exchanges%22%3A%5B%5D%2C%22dataSource%22%3A%22SENSEX%22%2C%22grouping%22%3A%22sector%22%2C%22blockSize%22:%22market_cap_basic%22,%22blockColor%22:%22change%22,%22locale%22:%22in%22,%22symbolUrl%22:%22%22,%22colorTheme%22:%22light%22,%22hasTopBar%22:false,%22isDataSetEnabled%22:false,%22isZoomEnabled%22:true,%22hasSymbolTooltip%22:true,%22width%22:%22auto%22,%22height%22:500%7D"
            className="w-full h-[500px] border-none"
          />
        </div> */}

        {/* Forex Heatmap */}
        {/* <div>
          <h3 className="text-2xl font-semibold mb-8">Forex Market</h3>
          <iframe 
            src="https://www.tradingview-widget.com/embed-widget/forex-heat-map/?locale=in#%7B%22width%22:%22auto%22,%22height%22:500,%22currencies%22:%5B%22EUR%22,%22USD%22,%22JPY%22,%22GBP%22,%22AUD%22,%22CAD%22,%22NZD%22,%22CNY%22,%22INR%22%5D,%22isTransparent%22:false,%22colorTheme%22:%22light%22,%22locale%22:%22in%22%7D"
            className="w-full h-[500px] border-none"
          />
        </div> */}
      </div>
    </section>
  );
}
