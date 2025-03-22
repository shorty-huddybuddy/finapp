"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { SubscriptionDialog } from "@/components/subscription-dialog"
import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { useAuth } from "@clerk/nextjs"
import { toast } from "sonner"  
import { useUser } from "@clerk/nextjs"
import { useExtendedUser } from "@/hooks/useExtendedUser"
import { Search } from "lucide-react"
import { useUserPermissions, useSubscriptionStatus } from "@/lib/swr/usePermissions"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function RightSidebar() {
  const [showSubscribeDialog, setShowSubscribeDialog] = useState(false)
  const [subscriptionType, setSubscriptionType] = useState<"creator" | "platform" | null>(null)
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { getToken } = useAuth()
  const { user } = useUser()
  const { isPremium } = useExtendedUser()
  const trendingTopics = [
    { title: "Bitcoin", posts: "125K" },
    { title: "Trading", posts: "89K" },
    { title: "Crypto", posts: "65K" },
  ]

  const suggestedTraders = [
    { id: "trader-1", name: "Sarah Crypto", handle: "@sarahcrypto", rating: "4.9" },
    { id: "trader-2", name: "Trading Pro", handle: "@tradingpro", rating: "4.8" },
  ]

  const handleSubscribe = async (type: "creator" | "platform", creatorId?: string) => {
    if (!user) {
      toast.error("Please sign in to subscribe")
      return
    }

    try {
      setLoading(true)
      const token = await getToken()
      
      const response = await fetch('http://localhost:8080/api/subscriptions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type,
          creatorId,
          tierId: type === 'platform' ? 'premium-monthly' : 'creator-basic'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create subscription')
      }

      const { sessionId } = await response.json()
      
      // Redirect to Stripe checkout
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error('Stripe failed to load')
      }

      const { error } = await stripe.redirectToCheckout({ sessionId })
      if (error) {
        throw error
      }

    } catch (error) {
      console.error('Subscription error:', error)
      toast.error('Failed to start subscription process')
    } finally {
      setLoading(false)
    }
  }

  if (isPremium) {
    return (
      <aside className="w-80 h-screen">
        <div className="sticky top-0 p-6 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <Card className="border-gray-100 shadow-sm bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Premium Member</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                You have access to all premium content
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-900">Trending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendingTopics.map((topic) => (
                  <div key={topic.title} className="flex justify-between items-center">
                    <span className="font-medium">{topic.title}</span>
                    <Badge variant="secondary">{topic.posts} posts</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Top Creators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suggestedTraders.map((trader) => (
                  <div key={trader.handle} className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>TD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{trader.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{trader.handle}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSubscribe('creator', trader.id)}
                      disabled={loading}
                    >
                      {loading ? "..." : "Subscribe"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </aside>
    )
  }

  return (
    <aside className="w-80 h-screen">
      <div className="sticky top-0 p-6 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        <Card className="border-gray-100 shadow-sm bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Premium Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-bold mb-2">Platform Premium</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Access all premium content from all creators
                </p>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    setSubscriptionType("platform");
                    setShowSubscribeDialog(true);
                  }}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "$19.99/month"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-100 shadow-sm bg-white/70 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900">Trending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trendingTopics.map((topic) => (
                <div key={topic.title} className="flex justify-between items-center">
                  <span className="font-medium">{topic.title}</span>
                  <Badge variant="secondary">{topic.posts} posts</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-100 shadow-sm bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Top Creators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suggestedTraders.map((trader) => (
                <div key={trader.handle} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>TD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{trader.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{trader.handle}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSubscribe('creator', trader.id)}
                    disabled={loading}
                  >
                    {loading ? "..." : "Subscribe"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <SubscriptionDialog 
        open={showSubscribeDialog}
        onOpenChange={setShowSubscribeDialog}
        type={subscriptionType}
        creatorId={selectedCreator}
        onSubscribe={handleSubscribe}
        loading={loading}
      />
    </aside>
  )
}

