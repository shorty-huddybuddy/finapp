"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@clerk/nextjs"
import { SubscriptionDialog } from "@/components/subscription-dialog"
import { useState } from "react"

export function RightSidebar() {
  const [showSubscribeDialog, setShowSubscribeDialog] = useState(false)
  const [subscriptionType, setSubscriptionType] = useState<"creator" | "platform" | null>(null)
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null)

  const trendingTopics = [
    { title: "Bitcoin", posts: "125K" },
    { title: "Trading", posts: "89K" },
    { title: "Crypto", posts: "65K" },
  ]

  const suggestedTraders = [
    { id: "trader-1", name: "Sarah Crypto", handle: "@sarahcrypto", rating: "4.9" },
    { id: "trader-2", name: "Trading Pro", handle: "@tradingpro", rating: "4.8" },
  ]

  return (
    <aside className="w-[280px] p-4 lg:block hidden"> {/* Hide on smaller screens, show on lg and above */}
      <div className="sticky top-4">
        <Card className="mb-4">
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
                    setSubscriptionType("platform")
                    setShowSubscribeDialog(true)
                  }}
                >
                  $19.99/month
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Trending</CardTitle>
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

        <Card>
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
                    onClick={() => {
                      setSubscriptionType("creator")
                      setSelectedCreator(trader.id)
                      setShowSubscribeDialog(true)
                    }}
                  >
                    Subscribe
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
      />
    </aside>
  )
}

