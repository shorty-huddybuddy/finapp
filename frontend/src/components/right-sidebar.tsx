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
import { Search } from "lucide-react"
import { useUserPermissions, useSubscriptionStatus } from "@/lib/swr/usePermissions"
import { Skeleton } from "@/components/ui/skeleton"
import { API_URL } from '@/lib/config'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function RightSidebar() {
  const [showSubscribeDialog, setShowSubscribeDialog] = useState(false)
  const [subscriptionType, setSubscriptionType] = useState<"creator" | "platform" | null>(null)
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { getToken } = useAuth()
  const { user } = useUser()
  
  // Get current permissions and loading state
  const { permissions, isLoadingPermissions } = useUserPermissions()
  const { subscriptions, isLoadingSubscriptions } = useSubscriptionStatus()
  
  // Derive premium status from permissions
  const isPremium = permissions?.isPremium || false
  const isLoading = isLoadingPermissions || isLoadingSubscriptions
  
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
      
      const response = await fetch(`${API_URL}/api/subscriptions/create`, {
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

  // Render search bar and trending/creator sections - shared between both premium and non-premium states
  const renderCommonSections = () => (
    <>
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>

      {/* Trending Topics */}
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

      {/* Top Creators */}
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
    </>
  )

  // If loading, show skeleton UI
  if (isLoading) {
    return (
      <aside className="w-80 h-screen">
        <div className="sticky top-0 p-6 space-y-6">
          {/* Search bar skeleton */}
          <Skeleton className="h-10 w-full rounded-lg" />
          
          {/* Membership status skeleton */}
          <Card className="border-gray-100">
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
          
          {/* Trending skeleton */}
          <Card className="border-gray-100">
            <CardHeader>
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Creators skeleton */}
          <Card className="border-gray-100">
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-8 w-20 rounded-md" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </aside>
    );
  }

  // For premium members
  if (isPremium) {
    return (
      <aside className="w-80 h-screen">
        <div className="sticky top-0 p-6 space-y-6">
          {/* Premium status */}
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
          
          {renderCommonSections()}
        </div>
      </aside>
    )
  }

  // For non-premium members
  return (
    <aside className="w-80 h-screen">
      <div className="sticky top-0 p-6 space-y-6">
        {/* Premium subscription CTA */}
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

        {renderCommonSections()}
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

