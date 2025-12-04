import type { Metadata } from "next"
import { Navbar2 } from "@/components/Navbar2"
import { Footer } from "../../components/Footer"
import FeatureCard from "@/components/feature-card"
import ContributorSection from "../../components/contributor-section"
import { IconKey, getIconForKey } from "@/components/get-icon-for-key"

export const metadata: Metadata = {
  title: "About FinAaura | AI-Powered Financial Assistant",
  description:
    "Learn about FinAura, the GenAI-powered financial assistant helping you make better investment decisions through AI-driven insights and portfolio analysis.",
}

export default function AboutPage() {
  const features: { title: string; description: string; icon: IconKey; color: string }[] = [
    {
      title: "AI-Powered Portfolio Analysis",
      description:
        "Get asset-specific recommendations with BUY, HOLD, SELL guidance backed by factual reasoning.",
      icon: "line-chart",
      color: "blue",
    },
    {
      title: "Risk-Based Investment Suggestions",
      description:
        "Receive personalized investment recommendations based on your risk profile.",
      icon: "bar-chart",
      color: "blue",
    },
    {
      title: "Financial Literacy Content",
      description:
        "Access blogs, videos, and interactive resources to improve your financial knowledge.",
      icon: "book-open",
      color: "blue",
    },
    {
      title: "Portfolio Management",
      description:
        "Evaluate and score your portfolio with AI-driven insights.",
      icon: "briefcase",
      color: "blue",
    },
    {
      title: "Integrated Chatbot",
      description:
        "Get answers to your financial and general queries through our intelligent assistant.",
      icon: "message-circle",
      color: "blue",
    },
    {
      title: "Interactive Spreadsheets",
      description:
        "Collaborate in real-time and leverage API integrations for financial data automation.",
      icon: "table",
      color: "blue",
    },
  ]

  const contributors = [
    { name: "Dinesh", github: "shorty-huddybuddy", avatar: "/p1.svg?height=200&width=200" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar2 />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold text-white mb-4 animate-fadeInDown">
            FinAura
          </h1>
          <p className="text-xl text-indigo-200 max-w-3xl mx-auto animate-fadeInUp">
            A GenAI-powered financial assistant that elevates your investing with AI-driven insights, 
            automation, and interactive tools.
          </p>
        </div>
      </div>
      {/* Main Content */}
      <main className="flex-grow -mt-10 bg-gray-100 rounded-t-3xl shadow-lg">
        <div className="container mx-auto px-4 py-16">
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
              Our Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <FeatureCard
                  key={idx}
                  feature={{
                    ...feature,
                    icon: getIconForKey(feature.icon),
                  }}
                />
              ))}
            </div>
          </section>
          <section className="mt-16">
            <ContributorSection contributors={contributors} />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}