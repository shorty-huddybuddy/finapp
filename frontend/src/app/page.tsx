"use client";
import React, { useEffect } from "react";
import {ArrowRight,} from "lucide-react";
import { Chatbot } from "../components/Chatbot";
import { MarketWidgets } from "../components/MarketWidgets";
import {Footer} from "../components/Footer";
import {Testimonails} from "../components/Testimonails";  
import {Features} from "../components/Features_2";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header } from "../components/Header";
import { Navbar } from "../components/Navbar";

function App() {
  useEffect(() => {
    // Add a style element to fix z-index issues
    const style = document.createElement('style');
    style.innerHTML = `
      .dropdown-menu {
        z-index: 1030 !important;
      }
      .group:hover .group-hover\\:visible {
        visibility: visible !important;
      }
      .group:hover .group-hover\\:opacity-100 {
        opacity: 1 !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <div>
      <Navbar/>

      <div className="min-h-screen bg-white">
        {/* Market Ticker */}
        {/* <MarketTicker /> */}

        {/* Hero Section */}
        <Header/>

        {/* Features Section */}
        <Features/>

        {/* Market Data Section */}
        <MarketWidgets />

        <Testimonails/>
        
        {/* CTA Section */}
        <section className="bg-blue-600 text-white py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">
              Ready to Transform Your Financial Journey?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of investors who are leveraging AI to make smarter
              financial decisions and achieve their goals.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors inline-flex items-center">
              Start Your AI-Powered Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </section>

        <Footer/>
        <Chatbot />
      </div>
    </div>
  );
}

export default App;
