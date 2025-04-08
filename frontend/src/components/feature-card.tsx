import React from "react"
import { type IconKey } from "@/components/get-icon-for-key"

interface Feature {
  title: string
  description: string
  // We expect icon to be a component that accepts a className prop
  icon: React.ComponentType<{ className?: string }>
  color: string
}

interface FeatureCardProps {
  feature: Feature
  className?: string
}

export default function FeatureCard({ feature, className = "" }: FeatureCardProps) {
  const IconComponent = feature.icon
  return (
    <div
      className={`bg-purple-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 ${className}`}
    >
      <div className="flex justify-center mb-4">
      <div className="p-4 rounded-full bg-white shadow-md">
        {IconComponent && <IconComponent className="h-10 w-10 text-purple-700" />}
      </div>
      </div>
      <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
      {feature.title}
      </h3>
      <p className="text-gray-700 text-center">{feature.description}</p>
    </div>
  )
}