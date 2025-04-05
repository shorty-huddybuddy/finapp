import { type IconKey, getIconForKey } from "./get-icon-for-key"

import { LucideIcon } from "lucide-react"

interface FeatureCardProps {
  feature: {
    title: string
    description: string
    icon: LucideIcon // Update type here
    color: string
  }
  className?: string
}

export default function FeatureCard({ feature, className }: FeatureCardProps) {
  const { title, description, icon: Icon, color } = feature

  return (
    <div className={`p-4 rounded-lg shadow-md ${className}`} style={{ backgroundColor: color }}>
      <Icon className="h-6 w-6 mb-2" />
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  )
}
// export default function FeatureCard({ feature, className = "" }: FeatureCardProps) {
//   const Icon = getIconForKey(feature.icon)

//   return (
//     <div 
//       className={`bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:scale-[1.01] ${className}`}
//     >
//       <div className="flex items-center space-x-3 mb-3">
//         <div className={`p-2 sm:p-3 rounded-lg bg-${feature.color}-100`}>
//           <Icon className={`h-5 w-5 sm:h-6 sm:w-6 text-${feature.color}-600`} />
//         </div>
//         <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{feature.title}</h3>
//       </div>
//       <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
//     </div>
//   )
// }