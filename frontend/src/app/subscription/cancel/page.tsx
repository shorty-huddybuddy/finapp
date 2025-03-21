"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"

export default function SubscriptionCancelPage() {
  const router = useRouter()

  useEffect(() => {
    toast.error("Subscription was cancelled")
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Subscription Cancelled</h1>
          <p className="text-muted-foreground mb-6">
            Your subscription was not completed. No charges were made.
          </p>
          <Button onClick={() => router.push('/social')} className="w-full">
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
