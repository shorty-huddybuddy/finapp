"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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
    <section className="mb-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Meet the Team</h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
          Our talented contributors are passionate about creating innovative financial solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
        {contributors.map((contributor, index) => (
          <Card
            key={index}
            className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 text-center hover:shadow-md transition-shadow"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 overflow-hidden rounded-full">
                <Image
                  src={contributor.avatar || "/globe.svg"}
                  alt={contributor.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-1">{contributor.name}</h3>
            <Link
              href={`https://github.com/${contributor.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Github className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              @{contributor.github}
            </Link>
          </Card>
        ))}
      </div>
    </section>
  )
}

