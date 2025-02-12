"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function RightSidebar() {
  const trendingTopics = [
    { title: "Bitcoin", posts: "125K" },
    { title: "Trading", posts: "89K" },
    { title: "Crypto", posts: "65K" },
  ]

  const suggestedTraders = [
    { name: "Sarah Crypto", handle: "@sarahcrypto", rating: "4.9" },
    { name: "Trading Pro", handle: "@tradingpro", rating: "4.8" },
  ]

  return (
    <aside className="w-[280px] p-4 lg:block hidden"> {/* Hide on smaller screens, show on lg and above */}
      <div className="sticky top-4">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Subscribe to Premium</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Get exclusive trading insights and premium predictions</p>
            <Button className="w-full">Subscribe Now</Button>
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
            <CardTitle>Top Traders</CardTitle>
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
                  <Badge variant="secondary">⭐ {trader.rating}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  )
}

