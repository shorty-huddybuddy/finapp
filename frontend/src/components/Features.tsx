import React from "react";
import Carousel from "react-bootstrap/Carousel";
import {
    LineChart,
    PieChart,
    Shield,
    TrendingUp,
    Users,
    Brain,
    MessageCircle,
    Globe,
    Calendar,
    Wallet,
    BarChart2,
    Newspaper,
    Landmark,
    Goal,
    AlertTriangle,
  } from "lucide-react";


export function Features(){
    const features = [
        {
          icon: Brain,
          title: "AI-Driven Market Analysis",
          description:
            "Leverage cutting-edge AI algorithms to analyze real-time market trends, historical data, and economic indicators. Get personalized investment recommendations tailored to your financial goals and risk tolerance.",
        },
        {
          icon: TrendingUp,
          title: "Smart Portfolio Management",
          description:
            "Optimize your investment portfolio with AI-powered tools that assess risk, diversify assets, and suggest rebalancing strategies. Track performance and make data-driven decisions for stocks, bonds, and crypto.",
        },
        {
          icon: Shield,
          title: "Comprehensive Financial Education",
          description:
            "Access interactive learning modules, tutorials, and AI-powered resources to enhance your financial literacy. Learn about bonds, stocks, crypto, and other investment vehicles at your own pace.",
        },
        {
          icon: PieChart,
          title: "Multi-Asset Investment Insights",
          description:
            "Gain in-depth insights into stocks, bonds, ETFs, mutual funds, and cryptocurrencies. Compare performance, analyze trends, and make informed decisions across all asset classes.",
        },
        {
          icon: Users,
          title: "Personalized Investment Strategies",
          description:
            "Create customized investment plans based on your financial goals, time horizon, and risk appetite. Our AI adapts to your preferences and provides actionable strategies for long-term growth.",
        },
        {
          icon: LineChart,
          title: "Real-Time Market Data",
          description:
            "Stay ahead with real-time updates on stock prices, bond yields, crypto valuations, and global market indices. Access live charts, news, and alerts to make timely decisions.",
        },
        {
          icon: MessageCircle,
          title: "Integrated AI Chatbot",
          description:
            "Get instant answers to your finance-related questions with our AI-powered chatbot. From bond yields to crypto trends, the chatbot provides accurate, real-time assistance.",
        },
        {
          icon: Globe,
          title: "Global Market Coverage",
          description:
            "Explore investment opportunities across global markets. Analyze international stocks, bonds, and crypto assets with localized insights and currency conversion tools.",
        },
        {
          icon: AlertTriangle,
          title: "Risk Assessment Tools",
          description:
            "Evaluate the risk profile of your investments with advanced risk assessment tools. Understand volatility, credit risk, and market exposure for better decision-making.",
        },
        {
          icon: Calendar,
          title: "Event-Driven Alerts",
          description:
            "Receive notifications for earnings reports, bond issuances, crypto market movements, and other key financial events. Never miss an opportunity to act on market changes.",
        },
        {
          icon: Wallet,
          title: "Crypto Portfolio Tracker",
          description:
            "Monitor your cryptocurrency investments with real-time tracking, price alerts, and portfolio analysis. Stay informed about market trends and manage your crypto assets effectively.",
        },
        {
          icon: Landmark,
          title: "Bond Investment Tools",
          description:
            "Analyze bond yields, maturity dates, and credit ratings to make informed fixed-income investments. Compare government and corporate bonds for optimal returns.",
        },
        {
          icon: BarChart2,
          title: "Stock Screener & Analysis",
          description:
            "Use advanced filters to screen stocks based on market cap, P/E ratio, dividend yield, and more. Access detailed analysis and valuation metrics for informed stock picking.",
        },
        {
          icon: Newspaper,
          title: "Curated Financial News",
          description:
            "Stay updated with curated news and insights on stocks, bonds, crypto, and global markets. Our AI filters out noise and delivers only the most relevant information.",
        },
        {
          icon: Goal,
          title: "Goal-Based Investing",
          description:
            "Set financial goals like retirement, education, or buying a home. Our platform creates tailored investment plans to help you achieve your objectives efficiently.",
        },
      ];

return (

<section id="features" className="py-20">
    <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-16">
        AI-Powered Financial Solutions
        </h2>

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
                <h3 className="text-xl font-semibold mb-4 text-white">
                    {feature.title}
                </h3>
                <p className="text-gray-200">{feature.description}</p>
                </div>
            </Carousel.Item>
            ))}
        </Carousel>
        </div>
    </div>
</section>

)}