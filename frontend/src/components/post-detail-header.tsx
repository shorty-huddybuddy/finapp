"use client"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function PostDetailHeader() {
  const router = useRouter()

  return (
    <div className="p-4 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-center max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-semibold">Post</h1>
      </div>
    </div>
  )
}
