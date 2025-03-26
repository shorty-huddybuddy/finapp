"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink } from "lucide-react"

interface Contributor {
  name: string
  github: string
  avatar: string
}

interface ContributorSectionProps {
  contributors: Contributor[]
}

export default function ContributorSection({ contributors }: ContributorSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <div className="inline-block p-2 px-6 mb-4 bg-blue-600 text-white rounded-full">
          <span className="text-lg font-medium">Our Team</span>
        </div>
        <h2 className="text-4xl font-bold tracking-tight mb-4 text-blue-800">Meet The Contributors</h2>
        <p className="text-lg text-slate-700 max-w-3xl mx-auto">
          The talented individuals behind Finaura who are passionate about revolutionizing financial assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {contributors.map((contributor, index) => (
          <Card
            key={index}
            className="overflow-hidden transition-all duration-300 hover:shadow-xl border-2 border-blue-100 group bg-white"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="relative h-64 overflow-hidden bg-blue-600">
              <div className="absolute inset-0 bg-[url('/globe.svg?height=400&width=400')] bg-center opacity-20"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white">
                <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden mb-4 bg-white">
                  <img
                    src={contributor.avatar || "/globe.svg"}
                    alt={contributor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-center">{contributor.name}</h3>
                <div className="flex space-x-3 mt-4">
                  <Button
                    size="sm"
                    className="bg-white text-blue-600 hover:bg-blue-50 transition-all"
                    onClick={() => window.open(`https://github.com/${contributor.github}`, "_blank")}
                  >
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                </div>
              </div>
            </div>
            <CardContent className="p-6 bg-white">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-700">@{contributor.github}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto text-blue-600 hover:text-blue-800 hover:bg-transparent"
                  onClick={() => window.open(`https://github.com/${contributor.github}`, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

