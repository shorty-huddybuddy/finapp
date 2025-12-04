import React from "react"

interface Contributor {
  name: string
  github: string
  avatar: string
}

interface ContributorSectionProps {
  contributors: Contributor[]
}

export default function ContributorSection({ contributors }: ContributorSectionProps) {
  const title = contributors.length === 1 ? "Developer" : "Our Contributors";
  
  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">{title}</h2>
      <div className="flex justify-center items-center">
        <div className="grid grid-cols-1 gap-8">
        {contributors.map((contributor, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-center"
          >
            <div className="flex justify-center mb-4">
              <img
                src={contributor.avatar}
                alt={contributor.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-transparent bg-gradient-to-r from-green-400 to-blue-500 p-1 shadow-md"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{contributor.name}</h3>
            <a
              href={`https://github.com/${contributor.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              @{contributor.github}
            </a>
          </div>
        ))}
        </div>
      </div>
    </div>
  )
} 