import React from 'react';
import {LineChart,ArrowRight,Sparkles,} from "lucide-react";


export function Header (){
    return (
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="h-6 w-6 text-yellow-300" />
              <span className="text-yellow-300 font-semibold">
                AI-Powered Financial Intelligence
              </span>
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Transform Your Financial Future with AI-Driven Insights
            </h1>
            <p className="text-xl mb-8 text-blue-100 mx-auto max-w-2xl">
              Harness the power of artificial intelligence to make smarter
              investment decisions. Our AI analyzes market trends, provides
              personalized recommendations, and helps you achieve financial
              literacy through interactive learning.
            </p>
            <div className="flex justify-center">
              <a 
                href="https://www.youtube.com/watch?v=E2v8UEyJjDU"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center border-2 border-white text-white px-8 py-3 rounded-full font-semibold no-underline hover:bg-white/10 transition-colors"
              >
                Watch Demo <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </header>     
)}
