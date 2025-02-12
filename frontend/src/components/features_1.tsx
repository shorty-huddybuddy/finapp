import { CheckCircle } from "lucide-react"

export function Features() {
  const features = [
    "Summarize PDF files on Mac, Windows, and Linux",
    "Trusted by 2.4 billion people since 2013",
    "Free and easy to use—no installation required",
  ]

  return (
    <div className="mt-8">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-muted-foreground">{feature}</span>
        </div>
      ))}
    </div>
  )
}

