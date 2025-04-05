"use client"
import React from 'react';
import { 
  LineChart, 
  PieChart,
  Shield,
  TrendingUp,
  Users,
  Brain,
  ArrowRight,
  Sparkles,
  MessageCircle,
  Globe,
  Calendar,
  Wallet,
  BarChart2,
  Newspaper,
  Landmark,
  Goal,
  AlertTriangle,
} from 'lucide-react';
import { Chatbot } from '@/components/Chatbot';
import { MarketWidgets } from '@/components/MarketWidgets';
import Carousel from 'react-bootstrap/Carousel';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Image from 'next/image';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function App() {
  const features = [
        {
          icon: Brain,
          title: "AI-Driven Market Analysis",
          description: "Leverage cutting-edge AI algorithms to analyze real-time market trends, historical data, and economic indicators. Get personalized investment recommendations tailored to your financial goals and risk tolerance.",
        },
        {
          icon: TrendingUp,
          title: "Smart Portfolio Management",
          description: "Optimize your investment portfolio with AI-powered tools that assess risk, diversify assets, and suggest rebalancing strategies. Track performance and make data-driven decisions for stocks, bonds, and crypto.",
        },
        {
          icon: Shield,
          title: "Comprehensive Financial Education",
          description: "Access interactive learning modules, tutorials, and AI-powered resources to enhance your financial literacy. Learn about bonds, stocks, crypto, and other investment vehicles at your own pace.",
        },
        {
          icon: PieChart,
          title: "Multi-Asset Investment Insights",
          description: "Gain in-depth insights into stocks, bonds, ETFs, mutual funds, and cryptocurrencies. Compare performance, analyze trends, and make informed decisions across all asset classes.",
        },
        {
          icon: Users,
          title: "Personalized Investment Strategies",
          description: "Create customized investment plans based on your financial goals, time horizon, and risk appetite. Our AI adapts to your preferences and provides actionable strategies for long-term growth.",
        },
        {
          icon: LineChart,
          title: "Real-Time Market Data",
          description: "Stay ahead with real-time updates on stock prices, bond yields, crypto valuations, and global market indices. Access live charts, news, and alerts to make timely decisions.",
        },
        {
          icon: MessageCircle,
          title: "Integrated AI Chatbot",
          description: "Get instant answers to your finance-related questions with our AI-powered chatbot. From bond yields to crypto trends, the chatbot provides accurate, real-time assistance.",
        },
        {
          icon: Globe,
          title: "Global Market Coverage",
          description: "Explore investment opportunities across global markets. Analyze international stocks, bonds, and crypto assets with localized insights and currency conversion tools.",
        },
        {
          icon: AlertTriangle,
          title: "Risk Assessment Tools",
          description: "Evaluate the risk profile of your investments with advanced risk assessment tools. Understand volatility, credit risk, and market exposure for better decision-making.",
        },
        {
          icon: Calendar,
          title: "Event-Driven Alerts",
          description: "Receive notifications for earnings reports, bond issuances, crypto market movements, and other key financial events. Never miss an opportunity to act on market changes.",
        },
        {
          icon: Wallet,
          title: "Crypto Portfolio Tracker",
          description: "Monitor your cryptocurrency investments with real-time tracking, price alerts, and portfolio analysis. Stay informed about market trends and manage your crypto assets effectively.",
        },
        {
          icon: Landmark,
          title: "Bond Investment Tools",
          description: "Analyze bond yields, maturity dates, and credit ratings to make informed fixed-income investments. Compare government and corporate bonds for optimal returns.",
        },
        {
          icon: BarChart2,
          title: "Stock Screener & Analysis",
          description: "Use advanced filters to screen stocks based on market cap, P/E ratio, dividend yield, and more. Access detailed analysis and valuation metrics for informed stock picking.",
        },
        {
          icon: Newspaper,
          title: "Curated Financial News",
          description: "Stay updated with curated news and insights on stocks, bonds, crypto, and global markets. Our AI filters out noise and delivers only the most relevant information.",
        },
        { 
          icon: Goal,
          title: "Goal-Based Investing",
          description: "Set financial goals like retirement, education, or buying a home. Our platform creates tailored investment plans to help you achieve your objectives efficiently.",
        },
      ];
    

  function setImagePreviewOpen(arg0: boolean): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Market Ticker */}
      {/* <MarketTicker /> */}

      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <LineChart className="h-6 w-6" />
            <span className="text-xl font-bold">FinanceHub</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="hover:text-blue-200">Features</a>
            {/* Dropdown for Market Data */}
            <DropdownButton
              id="dropdown-basic-button"
              title="Market Data"
              // variant="link"
              className="text-white hover:text-white-200"
            >
              <Dropdown.Item href="#stocks">Stocks</Dropdown.Item>
              <Dropdown.Item href="#cryptocurrencies">Cryptocurrencies</Dropdown.Item>
            </DropdownButton>
            <a href="#testimonials" className="hover:text-blue-200">Testimonials</a>
          </div>
          <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition-colors">
            Get Started
          </button>
        </nav>
        
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="h-6 w-6 text-yellow-300" />
              <span className="text-yellow-300 font-semibold">AI-Powered Financial Intelligence</span>
            </div>
            <h1 className="text-5xl font-bold mb-6">
              Transform Your Financial Future with AI-Driven Insights
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Harness the power of artificial intelligence to make smarter investment decisions. Our AI analyzes market trends, provides personalized recommendations, and helps you achieve financial literacy through interactive learning.
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

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">AI-Powered Financial Solutions</h2>
          
          {/* Carousel Container with Curved Rectangle and Background Color */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-6">
            {/* Carousel for Features */}
            <Carousel data-bs-theme="dark" indicators={false} interval={5000}>
              {features.map((feature, index) => (
                <Carousel.Item key={index}>
                  <div className="text-center p-8">
                    <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                      <feature.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
                    <p className="text-gray-200">{feature.description}</p>
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        </div>
      </section>

      {/* Market Data Section */}
      <MarketWidgets />

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">Success Stories</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div 
                  className="relative w-full rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => setImagePreviewOpen(true)}
                >
                  <Image 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100"
                    alt="Sarah Johnson"
                    width={100}
                    height={100}
                    className="w-12 h-12 rounded-full mr-4"
                    priority
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-gray-600">Investment Analyst</p>
                </div>
              </div>
              <p className="text-gray-700">
                {`The AI-powered insights have revolutionized my investment strategy. The platform's ability to analyze market trends and provide actionable recommendations is incredible.`}
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div 
                  className="relative w-full rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => setImagePreviewOpen(true)}
                >
                  <Image 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100"
                    alt="Mark Thompson"
                    width={100}
                    height={100}
                    className="w-12 h-12 rounded-full mr-4"
                    priority
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Mark Thompson</h4>
                  <p className="text-gray-600">Small Business Owner</p>
                </div>
              </div>
              <p className="text-gray-700">
                {`As someone new to investing, the AI-driven learning resources have been invaluable. I've gained confidence in making financial decisions.`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Transform Your Financial Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of investors who are leveraging AI to make smarter financial decisions and achieve their goals.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors inline-flex items-center">
            Start Your AI-Powered Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <LineChart className="h-6 w-6" />
                <span className="text-xl font-bold">FinanceHub</span>
              </div>
              <p className="text-gray-400">
                AI-powered financial solutions for a smarter future.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">AI Features</a></li>
                <li><a href="#" className="hover:text-white">Market Analysis</a></li>
                <li><a href="#" className="hover:text-white">Learning Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FinanceHub. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}

export default App;