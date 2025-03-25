"use client"

import type React from "react"

import { ArrowRight, BarChart3, FileText, LineChart, PieChart, Wallet } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Navbar2 } from "@/components/Navbar2"
import {Footer} from "../../components/Footer";

export default function HomePage() {
  const tools = [
    {
      id: "analyzer",
      title: "AI Investment Generator",
      description:
        "Input your amount, risk tolerance, and liquidity needs to receive a personalized investment plan tailored to your financial goals.",
      icon: <PieChart className="w-10 h-10 text-[#2563eb]" />,
      href: "analyzer",
      color: "bg-gradient-to-br from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30",
    },
    {
      id: "portfolio",
      title: "AI Portfolio Analyzer",
      description:
        "Upload your current portfolio and get AI-powered insights on risk assessment, diversification, and optimization recommendations.",
      icon: <BarChart3 className="w-10 h-10 text-[#2563eb]" />,
      href: "/portfolio",
      color: "bg-gradient-to-br from-blue-400/20 to-sky-500/20 hover:from-blue-400/30 hover:to-sky-500/30",
    },
    {
      id: "predictions",
      title: "AI Price Predictions",
      description:
        "Access our proprietary ML models to forecast cryptocurrency prices with advanced technical analysis and market sentiment indicators.",
      icon: <LineChart className="w-10 h-10 text-[#2563eb]" />,
      href: "predictions",
      color: "bg-gradient-to-br from-sky-500/20 to-blue-500/20 hover:from-sky-500/30 hover:to-blue-500/30",
    },
    {
      id: "expenses",
      title: "AI Expense Tracker",
      description:
        "Upload your transaction CSV files and leverage AI intelligence to analyze spending patterns and answer specific financial questions.",
      icon: <Wallet className="w-10 h-10 text-[#2563eb]" />,
      href: "expenses",
      color: "bg-gradient-to-br from-blue-300/20 to-blue-500/20 hover:from-blue-300/30 hover:to-blue-500/30",
    },
    {
      id: "pdf-summarizer",
      title: "AI PDF Summarizer",
      description:
        "Upload any financial document and instantly get answers to your questions using our Gemini-powered document intelligence system.",
      icon: <FileText className="w-10 h-10 text-[#2563eb]" />,
      href: "pdf-summarizer",
      color: "bg-gradient-to-br from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30",
    },
  ]

  return (
    <div className="bg-white">
    <Navbar2/>
    <main className="mx-auto px-4 py-12 max-w-7xl">
      
      <div className="text-center mb-16 space-y-4">
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent"
          style={{
            backgroundImage: "linear-gradient(to right, #2563eb, #60a5fa)",
            backgroundSize: "200% 200%",
            backgroundClip: "text",
            animation: "gradient 8s ease infinite",
          }}
        >
          AI-Powered Financial Tools
        </h1>
        <style jsx>{`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Leverage the power of artificial intelligence to optimize your investments, analyze your portfolio, and make
          smarter financial decisions.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
      
    </main>
    <Footer />
    </div>
  )
}

interface Tool {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
}

function ToolCard({ tool }: { tool: Tool }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link href={tool.href} className="block h-full">
      <div
        className={cn(
          "h-full transition-all duration-300 transform hover:scale-[1.01] hover:shadow-lg rounded-lg",
          tool.color,
          "border-2 border-blue-100 overflow-hidden",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-5 flex flex-row items-start h-full">
          <div className="flex-shrink-0 mr-4">
            <div className="p-3 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm border border-blue-50 inline-block">
              {tool.icon}
            </div>
          </div>
          <div className="flex-grow flex flex-col h-full">
            <div>
              <h3 className="text-xl font-semibold text-blue-900">{tool.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
            </div>
            <div className="mt-auto pt-4">
              <button
                className={cn(
                  "group p-1.5 px-3 rounded-full border border-blue-100 flex items-center text-sm",
                  isHovered ? "text-blue-600 bg-blue-50" : "text-gray-500",
                )}
              >
                <span className="mr-2">Try it</span>
                <ArrowRight
                  className={cn("w-3.5 h-3.5 transition-transform duration-300", isHovered ? "translate-x-1" : "")}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

