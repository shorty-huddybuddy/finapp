"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function SubscriptionSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get('type')

  useEffect(() => {
    toast.success("Subscription activated successfully!")
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Thank you!</h1>
          <p className="text-muted-foreground mb-6">
            Your {type === 'platform' ? 'platform premium' : 'creator'} subscription is now active.
          </p>
          <Button onClick={() => router.push('/social')} className="w-full">
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
