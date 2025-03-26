import type { Metadata } from "next"
import FeatureSlider from "../../components/feature-slider"
import ContributorSection from "../../components/contributor-section"
import {Footer} from "../../components/Footer";
import { Navbar2 } from "@/components/Navbar2"

export const metadata: Metadata = {
  title: "About Finaura | AI-Powered Financial Assistant",
  description:
    "Learn about Finaura, the GenAI-powered financial assistant helping you make better investment decisions through AI-driven insights and portfolio analysis.",
}

export default function AboutPage() {
  // Features data for the slider
  const features = [
    {
      title: "AI-Powered Portfolio Analysis",
      description:
        "Get asset-specific recommendations with BUY, HOLD, SELL guidance backed by factual reasoning and risk exposure analysis.",
      icon: "line-chart",
      color: "blue",
    },
    {
      title: "Risk-Based Investment Suggestions",
      description:
        "Receive personalized investment recommendations based on your risk profile, from high-risk options like crypto to low-risk investments.",
      icon: "bar-chart",
      color: "blue",
    },
    {
      title: "Financial Literacy Content",
      description:
        "Access blogs, videos, and interactive resources to improve your financial knowledge and make informed decisions.",
      icon: "book-open",
      color: "blue",
    },
    {
      title: "Portfolio Management",
      description:
        "Evaluate and score your portfolio with AI-driven insights and receive tailored investment recommendations.",
      icon: "briefcase",
      color: "blue",
    },
    {
      title: "Integrated Chatbot",
      description:
        "Get answers to your financial and general queries through our intelligent assistant powered by Gemini API.",
      icon: "message-circle",
      color: "blue",
    },
    {
      title: "Interactive Spreadsheets",
      description:
        "Collaborate in real-time and leverage API integrations for financial data automation, similar to Rows.com.",
      icon: "table",
      color: "blue",
    },
  ]

  // Contributors data with real names and GitHub usernames
  const contributors = [
    {
      name: "Divyansh Omar",
      github: "cauxtic",
      avatar: "/p1.svg?height=200&width=200",
    },
    {
      name: "Tejas Sharma",
      github: "tej-as1",
      avatar: "/p2.svg?height=200&width=200",
    },
    {
      name: "Karan Deoli",
      github: "karansenpai",
      avatar: "/p3.svg?height=200&width=200",
    },
    {
      name: "Aaditya Goyal",
      github: "AAditya260305",
      avatar: "/p4.svg?height=200&width=200",
    },
  ]

  return (
    <div>
    <Navbar2/>
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <section className="mb-20">
          <div className="text-center mb-16">
            {/* <div className="inline-block p-2 px-6 mb-4 bg-blue-600 text-white rounded-full">
              <span className="text-lg font-medium">About Us</span>
            </div> */}
            <h1 className="text-5xl font-bold tracking-tight mb-4 text-blue-800">Finaura</h1>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto">
              A GenAI-powered financial assistant aimed at improving investing decisions through AI-driven insights,
              automation, and interactive features.
            </p>
          </div>

          <FeatureSlider features={features} />
        </section>

        <ContributorSection contributors={contributors} />
      </div>
    </main>
    <Footer />
    </div>
  )
}

