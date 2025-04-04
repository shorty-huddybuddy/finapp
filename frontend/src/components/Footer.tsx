import React from "react";
import {LineChart,} from "lucide-react";

export function Footer(){
return (
    <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <LineChart className="h-6 w-6" />
            <span className="text-xl font-bold">FinAura</span>
          </div>
          <p className="text-gray-400 mb-4">
            AI-powered financial solutions for a smarter future.
          </p>
          <div className="mb-8">
            <a href="/about" className="text-gray-400 hover:text-white">
              About Us
            </a>
          </div>
          {/* <div className="border-t border-gray-800 mt-8 pt-8 text-gray-400">
            <p>&copy; 2025 FinanceHub. All rights reserved.</p>
          </div> */}
        </div>
    </footer>
    )}

