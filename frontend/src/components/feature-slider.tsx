"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { LineChart, BarChart, BookOpen, Briefcase, MessageCircle, Table, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useMobile } from "../hooks/use-mobile"
import Autoplay from "embla-carousel-autoplay"
import useEmblaCarousel from "embla-carousel-react"

interface Feature {
  title: string
  description: string
  icon: string
  color: string
}

interface FeatureSliderProps {
  features: Feature[]
}

export default function FeatureSlider({ features }: FeatureSliderProps) {
  const isMobile = useMobile()
  const [activeIndex, setActiveIndex] = useState(0)

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: true,
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 5000, stopOnInteraction: true })],
  )

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("select", () => {
        setActiveIndex(emblaApi.selectedScrollSnap())
      })
    }
  }, [emblaApi])

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "line-chart":
        return <LineChart className="h-10 w-10" />
      case "bar-chart":
        return <BarChart className="h-10 w-10" />
      case "book-open":
        return <BookOpen className="h-10 w-10" />
      case "briefcase":
        return <Briefcase className="h-10 w-10" />
      case "message-circle":
        return <MessageCircle className="h-10 w-10" />
      case "table":
        return <Table className="h-10 w-10" />
      default:
        return <ArrowRight className="h-10 w-10" />
    }
  }

  return (
    <div className="relative max-w-6xl mx-auto px-4">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4 first:pl-0"
            >
              <Card className="h-full border-2 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-white">
                <CardContent className="p-0 h-full flex flex-col">
                  <div className="bg-blue-600 p-6 flex justify-center">
                    <div className="bg-white/20 p-4 rounded-full">
                      <div className="text-white">{getIcon(feature.icon)}</div>
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold mb-3 text-blue-800">{feature.title}</h3>
                    <p className="text-slate-600 flex-grow">{feature.description}</p>
                    <div className="mt-4 pt-4 border-t border-blue-100">
                      <Button variant="ghost" className="p-0 text-blue-600 hover:text-blue-800 hover:bg-transparent">
                        Learn more <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-8">
        {features.map((_, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className={cn("w-3 h-3 p-0 rounded-full mx-1", index === activeIndex ? "bg-blue-600" : "bg-blue-200")}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>

      <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white shadow-md border-blue-100 hover:bg-blue-50"
          onClick={() => emblaApi?.scrollPrev()}
        >
          <ArrowRight className="h-4 w-4 rotate-180 text-blue-600" />
        </Button>
      </div>

      <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white shadow-md border-blue-100 hover:bg-blue-50"
          onClick={() => emblaApi?.scrollNext()}
        >
          <ArrowRight className="h-4 w-4 text-blue-600" />
        </Button>
      </div>
    </div>
  )
}

