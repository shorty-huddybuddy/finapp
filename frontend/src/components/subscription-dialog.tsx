"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { loadStripe } from "@stripe/stripe-js"
import { toast } from "sonner"
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '')

const PLATFORM_TIERS = [
  {
    id: "premium-monthly",
    name: "Premium Monthly",
    price: 19.99,
    features: ["Access all premium content", "Early access to features", "Priority support"]
  },
  {
    id: "premium-yearly",
    name: "Premium Yearly",
    price: 199.99,
    features: ["Everything in monthly", "2 months free", "Exclusive events"]
  }
]

const CREATOR_TIERS = [
  {
    id: "creator-basic",
    name: "Basic Support",
    price: 4.99,
    features: [
      "Access all premium posts",
      "Monthly newsletter",
      "Community posts"
    ]
  },
  {
    id: "creator-pro",
    name: "Pro Support",
    price: 9.99,
    features: [
      "Everything in Basic",
      "Private chat with creator",
      "Trading signals",
      "Priority support"
    ]
  },
  {
    id: "creator-vip",
    name: "VIP Member",
    price: 19.99,
    features: [
      "Everything in Pro",
      "1-on-1 monthly consultation",
      "Early access to content",
      "Exclusive VIP community"
    ]
  }
]

interface SubscriptionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "creator" | "platform" | null
  creatorId: string | null
}

export function SubscriptionDialog({ 
  open, 
  onOpenChange, 
  type,
  creatorId 
}: SubscriptionDialogProps) {
  const [loading, setLoading] = useState(false)
  const { user } = useUser()

  const handleSubscribe = async (tierId: string) => {
    if (!user) return
    setLoading(true)

    try {
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error("Stripe failed to initialize")
      }

      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tierId,
          type,
          creatorId,
          userId: user.id,
          subscriptionType: type === "creator" ? "individual" : "platform"
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create subscription")
      }

      const { sessionId } = await response.json()
      await stripe?.redirectToCheckout({ sessionId })
    } catch (error) {
      console.error("Subscription error:", error)
      toast.error("Failed to create subscription")
    } finally {
      setLoading(false)
    }
  }

  const tiers = type === "platform" ? PLATFORM_TIERS : CREATOR_TIERS

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === "platform" ? "Platform Premium" : "Creator Subscription"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {tiers.map((tier) => (
            <div key={tier.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">{tier.name}</h3>
                <span className="text-2xl font-bold">${tier.price}</span>
              </div>
              <ul className="space-y-2 mb-4">
                {tier.features.map((feature, i) => (
                  <li key={i} className="text-sm text-muted-foreground">
                    ✓ {feature}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                onClick={() => handleSubscribe(tier.id)}
                disabled={loading}
              >
                {loading ? "Processing..." : "Subscribe"}
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
