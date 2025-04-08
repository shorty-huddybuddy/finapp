"use client"
import { useState } from "react"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!)

interface SubscriptionButtonProps {
  creatorId: string
  creatorName: string
}

export function SubscriptionButton({ creatorId, creatorName }: SubscriptionButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const subscriptionTiers = [
    { id: 'tier1', name: 'Basic', price: 4.99, features: ['Access to premium posts', 'Monthly newsletter'] },
    { id: 'tier2', name: 'Pro', price: 9.99, features: ['All Basic features', 'Private chat', 'Early access'] },
    { id: 'tier3', name: 'Elite', price: 19.99, features: ['All Pro features', '1-on-1 consulting', 'Custom alerts'] }
  ]

  const handleSubscribe = async (tierId: string) => {
    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorId,
          tierId
        }),
      })

      const { sessionId } = await response.json()
      const stripe = await stripePromise
      await stripe?.redirectToCheckout({ sessionId })
    } catch (error) {
      console.error('Subscription error:', error)
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} >
        Subscribe
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subscribe to {creatorName}</DialogTitle>
            <DialogDescription>
              Choose a subscription tier to access premium content
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {subscriptionTiers.map((tier) => (
              <div key={tier.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold">{tier.name}</h3>
                  <span className="text-xl font-bold">${tier.price}</span>
                </div>
                <ul className="text-sm text-muted-foreground mb-4">
                  {tier.features.map((feature, i) => (
                    <li key={i}>• {feature}</li>
                  ))}
                </ul>
                <Button 
                  onClick={() => handleSubscribe(tier.id)}
                  className="w-full"
                >
                  Subscribe to {tier.name}
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
