"use client"

import type React from "react"

import { ArrowRight, BarChart3, FileText, LineChart, PieChart, Wallet } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Navbar } from "@/components/Navbar"
import {Footer} from "../../components/Footer";

export default function HomePage() {
  const tools = [
    {
      id: "analyzer",
      title: "AI Investment Generator",
      description:
        "Input your amount, risk tolerance, and liquidity needs to receive a personalized investment plan tailored to your financial goals.",
      icon: <PieChart className="w-10 h-10 text-[#8b5cf6]" />,
      href: "analyzer",
      color: "bg-gradient-to-br from-violet-500/20 to-purple-500/20 hover:from-violet-500/30 hover:to-purple-500/30",
    },
    {
      id: "portfolio",
      title: "AI Portfolio Analyzer",
      description:
        "Upload your current portfolio and get AI-powered insights on risk assessment, diversification, and optimization recommendations.",
      icon: <BarChart3 className="w-10 h-10 text-[#8b5cf6]" />,
      href: "/portfolio",
      color: "bg-gradient-to-br from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30",
    },
    {
      id: "predictions",
      title: "AI Price Predictions",
      description:
        "Access our proprietary ML models to forecast cryptocurrency prices with advanced technical analysis and market sentiment indicators.",
      icon: <LineChart className="w-10 h-10 text-[#8b5cf6]" />,
      href: "predictions",
      color: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30",
    },
    {
      id: "expenses",
      title: "AI Expense Tracker",
      description:
        "Upload your transaction CSV files and leverage AI intelligence to analyze spending patterns and answer specific financial questions.",
      icon: <Wallet className="w-10 h-10 text-[#8b5cf6]" />,
      href: "expenses",
      color: "bg-gradient-to-br from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30",
    },
    {
      id: "pdf-summarizer",
      title: "AI PDF Summarizer",
      description:
        "Upload any financial document and instantly get answers to your questions using our Gemini-powered document intelligence system.",
      icon: <FileText className="w-10 h-10 text-[#8b5cf6]" />,
      href: "pdf-summarizer",
      color: "bg-gradient-to-br from-rose-500/20 to-pink-500/20 hover:from-rose-500/30 hover:to-pink-500/30",
    },
  ]

  return (

    
    <main className="mx-auto px-4 py-12 max-w-7xl">
      <div className="text-center mb-16 space-y-4">
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent"
          style={{
            backgroundImage: "linear-gradient(to right, #8b5cf6, rgba(139, 92, 246, 0.7))",
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
        <p className="text-xl text-gray-500 max-w-3xl mx-auto">
          Leverage the power of artificial intelligence to optimize your investments, analyze your portfolio, and make
          smarter financial decisions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      
    </main>
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
          "h-full transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg rounded-lg",
          tool.color,
          "border-2 border-gray-200 overflow-hidden",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-6">
          <div className="flex justify-between items-start pb-2">
            <div className="p-3 rounded-lg bg-white/80 backdrop-blur-sm">{tool.icon}</div>
          </div>
          <h3 className="text-2xl font-semibold mt-4">{tool.title}</h3>
          <p className="text-base text-gray-600 mt-2">{tool.description}</p>
          <div className="mt-6">
            <button
              className={cn(
                "group p-0 h-auto font-medium flex items-center",
                isHovered ? "text-[#8b5cf6]" : "text-gray-500",
              )}
            >
              <span className="mr-2">Try it now</span>
              <ArrowRight
                className={cn("w-4 h-4 transition-transform duration-300", isHovered ? "translate-x-1" : "")}
              />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

