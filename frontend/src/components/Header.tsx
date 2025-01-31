import React from 'react';
import { Navbar } from './Navbar';
import {LineChart,ArrowRight,Sparkles,} from "lucide-react";


export function Header (){
    return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <Navbar/>
 
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="h-6 w-6 text-yellow-300" />
              <span className="text-yellow-300 font-semibold">
                AI-Powered Financial Intelligence
              </span>
            </div>
            <h1 className="text-5xl font-bold mb-6">
              Transform Your Financial Future with AI-Driven Insights
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Harness the power of artificial intelligence to make smarter
              investment decisions. Our AI analyzes market trends, provides
              personalized recommendations, and helps you achieve financial
              literacy through interactive learning.
            </p>
            <div className="flex space-x-4">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors">
                Start Free Trial
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </header>     
)}
    