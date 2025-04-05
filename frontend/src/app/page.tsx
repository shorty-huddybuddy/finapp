"use client";
import React from "react";
import {
  ArrowRight, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Share2, 
  LineChart as ChartLineUp,
  Brain as BrainCog,
  Calendar as CalendarIcon,
  Brain,
  Wallet,
  GraduationCap,
  BarChart
} from "lucide-react";
import { Chatbot } from "../components/Chatbot";
import { MarketWidgets } from "../components/MarketWidgets";
import {Footer} from "../components/Footer";
import {Testimonails} from "../components/Testimonails";  
import {Features} from "../components/Features_2";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header } from "../components/Header";
import { Navbar } from "../components/Navbar";
import Link from "next/link";
import { PageTransition } from "../components/page-transition";
import { ScrollToTop } from "@/components/scroll-to-top";

function App() {
  return (
    <div>
      <PageTransition>
        <Navbar/>
        <div className="min-h-screen bg-white">
          {/* Hero Section */}
          <Header/>

          {/* Features Section */}
          <Features/>

          {/* Market Data Section */}
          <MarketWidgets />

          {/* Social Trading Section */}
          <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-blue-900 mb-4">Social Trading Features</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Connect with fellow traders, share insights, and learn from the community
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <Users className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Community Trading</h3>
                  <p className="text-gray-600">Follow successful traders and replicate their winning strategies</p>
                </div>

                <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <MessageSquare className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Live Discussions</h3>
                  <p className="text-gray-600">Engage in real-time conversations about market trends and opportunities</p>
                </div>

                <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <TrendingUp className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Performance Tracking</h3>
                  <p className="text-gray-600">Track and showcase your trading performance to build credibility</p>
                </div>

                <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <Share2 className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Share Analysis</h3>
                  <p className="text-gray-600">Share your technical analysis and trading ideas with the community</p>
                </div>
              </div>

              <div className="text-center mt-12">
                <Link href="/social" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors">
                  Join the Trading Community
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </section>

          {/* Prediction Section */}
          <section className="py-20 bg-gradient-to-br from-indigo-50 to-white">
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-indigo-900 mb-4">AI-Powered Predictions</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Make data-driven decisions with our advanced market prediction tools
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <ChartLineUp className="w-12 h-12 text-indigo-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Market Predictions</h3>
                  <p className="text-gray-600">Get accurate predictions for various market movements</p>
                </div>

                <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <TrendingUp className="w-12 h-12 text-indigo-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Trend Analysis</h3>
                  <p className="text-gray-600">Advanced trend analysis using machine learning</p>
                </div>

                <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <BrainCog className="w-12 h-12 text-indigo-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">AI Insights</h3>
                  <p className="text-gray-600">Get AI-powered insights for better trading decisions</p>
                </div>
              </div>

              <div className="text-center mt-12">
                <Link href="/predictions" className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors">
                  Try Predictions
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </section>

          {/* Calendar Section */}
          <section className="py-20 bg-gradient-to-br from-green-50 to-white">
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-green-900 mb-4">Financial Calendar</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Stay on top of important financial events and never miss market-moving announcements
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <CalendarIcon className="w-12 h-12 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Earnings Calendar</h3>
                  <p className="text-gray-600">Track upcoming earnings announcements from top companies</p>
                </div>

                <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <CalendarIcon className="w-12 h-12 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Economic Events</h3>
                  <p className="text-gray-600">Keep up with major economic announcements and data releases</p>
                </div>

                <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <CalendarIcon className="w-12 h-12 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Custom Alerts</h3>
                  <p className="text-gray-600">Set up personalized notifications for events that matter to you</p>
                </div>
              </div>

              <div className="text-center mt-12">
                <Link href="/calendar" className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-colors">
                  View Calendar
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </section>

          {/* AI Tools Section */}
          <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-purple-900 mb-4">AI Trading Tools</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Leverage the power of artificial intelligence to enhance your trading strategy
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <Brain className="w-12 h-12 text-purple-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Sentiment Analysis</h3>
                  <p className="text-gray-600">Understand market sentiment from news and social media</p>
                </div>

                <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <Brain className="w-12 h-12 text-purple-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Pattern Recognition</h3>
                  <p className="text-gray-600">Identify trading patterns with machine learning algorithms</p>
                </div>

                <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <Brain className="w-12 h-12 text-purple-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Trading Assistant</h3>
                  <p className="text-gray-600">Get AI-powered recommendations for your trading decisions</p>
                </div>
              </div>

              <div className="text-center mt-12">
                <Link href="/ai_landing" className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition-colors">
                  Explore AI Tools
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </section>

          {/* Portfolio Section */}
          <section className="py-20 bg-gradient-to-br from-amber-50 to-white">
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-amber-900 mb-4">Portfolio Management</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Track, analyze, and optimize your investment portfolio with advanced tools
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <Wallet className="w-12 h-12 text-amber-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Portfolio Tracker</h3>
                  <p className="text-gray-600">Track your investments across multiple assets and platforms</p>
                </div>

                <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <Wallet className="w-12 h-12 text-amber-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Performance Analytics</h3>
                  <p className="text-gray-600">Analyze your portfolio performance with detailed metrics</p>
                </div>

                <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <Wallet className="w-12 h-12 text-amber-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Risk Assessment</h3>
                  <p className="text-gray-600">Evaluate risk factors in your portfolio and get recommendations</p>
                </div>
              </div>

              <div className="text-center mt-12">
                <Link href="/portfolio" className="inline-flex items-center px-6 py-3 bg-amber-600 text-white font-semibold rounded-full hover:bg-amber-700 transition-colors">
                  Manage Portfolio
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </section>

          {/* Education Section */}
          <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-cyan-900 mb-4">Financial Education</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Learn trading strategies, financial concepts, and market analysis techniques
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <GraduationCap className="w-12 h-12 text-cyan-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Trading Courses</h3>
                  <p className="text-gray-600">Comprehensive courses for beginners to advanced traders</p>
                </div>

                <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <GraduationCap className="w-12 h-12 text-cyan-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Strategy Library</h3>
                  <p className="text-gray-600">Access a library of proven trading strategies and techniques</p>
                </div>

                <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <GraduationCap className="w-12 h-12 text-cyan-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Expert Webinars</h3>
                  <p className="text-gray-600">Learn from industry professionals in live and recorded sessions</p>
                </div>
              </div>

              <div className="text-center mt-12">
                <Link href="/education" className="inline-flex items-center px-6 py-3 bg-cyan-600 text-white font-semibold rounded-full hover:bg-cyan-700 transition-colors">
                  Start Learning
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </section>

          {/* Market Data Section (Enhanced) */}
          <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-blue-900 mb-4">Comprehensive Market Data</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Access real-time data across stocks, cryptocurrencies, commodities, and more
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <BarChart className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Stock Dashboard</h3>
                  <p className="text-gray-600">Real-time stock quotes, charts, and detailed company information</p>
                  <Link href="/stock-dashboard" className="inline-flex items-center mt-4 text-blue-600 font-medium hover:underline">
                    View Stocks
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>

                <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <BarChart className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Crypto Dashboard</h3>
                  <p className="text-gray-600">Live cryptocurrency prices, market cap, and trading volume</p>
                  <Link href="/finance-dashboard" className="inline-flex items-center mt-4 text-blue-600 font-medium hover:underline">
                    View Cryptocurrencies
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

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

          <ScrollToTop />
          <Footer/>
          <Chatbot />
        </div>
      </PageTransition>
    </div>
  );
}


export default App;