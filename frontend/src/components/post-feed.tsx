"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Heart, MessageCircle, Share, MoreHorizontal, Star } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import Image from "next/image"

type Post = {
  id: string
  author: {
    name: string
    handle: string
    avatar: string
    isPremium: boolean
  }
  content: string
  image?: string
  likes: number
  comments: number
  shares: number
  isPremiumPost: boolean
  timestamp: string
}

export function PostFeed() {
  const [posts] = useState<Post[]>([
    {
      id: "1",
      author: {
        name: "Trading Expert",
        handle: "@tradexpert",
        avatar: "/placeholder.svg",
        isPremium: true,
      },
      content:
        "Bitcoin looking bullish! Key resistance at $45k. Premium members check your inbox for detailed analysis 📈 #Bitcoin #Trading",
      image: "/placeholder.svg?height=400&width=600",
      likes: 234,
      comments: 56,
      shares: 12,
      isPremiumPost: true,
      timestamp: "2h",
    },
    {
      id: "2",
      author: {
        name: "Crypto Analyst",
        handle: "@cryptoanalyst",
        avatar: "/placeholder.svg",
        isPremium: false,
      },
      content: "Market overview: SPX showing strong momentum. Watch these levels carefully! #StockMarket",
      likes: 189,
      comments: 34,
      shares: 8,
      isPremiumPost: false,
      timestamp: "4h",
    },
    {
      id: "3",
      author: {
        name: "Tech Stocks Pro",
        handle: "@techstocks",
        avatar: "/placeholder.svg",
        isPremium: true,
      },
      content:
        "🚨 BREAKING: Apple announces new AI initiative. Stock price target updated for premium members. Check analysis in premium channel. $AAPL",
      image: "/placeholder.svg?height=400&width=600",
      likes: 567,
      comments: 89,
      shares: 145,
      isPremiumPost: true,
      timestamp: "5h",
    },
    {
      id: "4",
      author: {
        name: "Forex Master",
        handle: "@forexmaster",
        avatar: "/placeholder.svg",
        isPremium: true,
      },
      content:
        "EUR/USD technical analysis suggests potential breakout. Key levels to watch: 1.0850 and 1.0920. Premium members - detailed report posted! 📊",
      likes: 321,
      comments: 67,
      shares: 42,
      isPremiumPost: false,
      timestamp: "6h",
    },
    {
      id: "5",
      author: {
        name: "Market Wizard",
        handle: "@marketwizard",
        avatar: "/placeholder.svg",
        isPremium: true,
      },
      content:
        "🔥 Just posted my weekly market outlook for premium subscribers. Covering: \n- SPX levels\n- Gold analysis\n- Crypto opportunities\n- Top picks for next week",
      image: "/placeholder.svg?height=400&width=600",
      likes: 892,
      comments: 234,
      shares: 156,
      isPremiumPost: true,
      timestamp: "8h",
    },
    {
      id: "6",
      author: {
        name: "Options Trader",
        handle: "@optionspro",
        avatar: "/placeholder.svg",
        isPremium: false,
      },
      content:
        "Volatility is picking up! Here's a free guide on how to protect your portfolio using options strategies. Premium members - check out my advanced options course! 📚",
      likes: 445,
      comments: 78,
      shares: 92,
      isPremiumPost: false,
      timestamp: "12h",
    },
  ])

  return (
    <div className="space-y-4 p-4">
      {posts.map((post) => (
        <Card key={post.id} className="border-border">
          <CardHeader className="flex flex-row items-center space-y-0 gap-3">
            <Avatar>
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>{post.author.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Link href={`/profile/${post.author.handle}`} className="font-semibold hover:underline">
                  {post.author.name}
                </Link>
                {post.author.isPremium && (
                  <Badge variant="secondary">
                    <Star className="w-3 h-3 mr-1" />
                    PRO
                  </Badge>
                )}
                <span className="text-sm text-muted-foreground">· {post.timestamp}</span>
              </div>
              <p className="text-sm text-muted-foreground">{post.author.handle}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Copy link</DropdownMenuItem>
                <DropdownMenuItem>Report post</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm whitespace-pre-line">{post.content}</p>
            {post.image && (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image src={post.image || "/placeholder.svg"} alt="Post image" fill className="object-cover" />
              </div>
            )}
            {post.isPremiumPost && (
              <div>
                <Badge variant="secondary" className="bg-yellow-100/10">
                  <Star className="w-3 h-3 mr-1 text-yellow-500" />
                  Premium Content
                </Badge>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <div className="flex items-center gap-4 text-muted-foreground">
              <Button variant="ghost" size="icon" className="hover:text-red-500">
                <Heart className="w-4 h-4" />
                <span className="ml-2 text-xs">{post.likes}</span>
              </Button>
              <Button variant="ghost" size="icon">
                <MessageCircle className="w-4 h-4" />
                <span className="ml-2 text-xs">{post.comments}</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Share className="w-4 h-4" />
                <span className="ml-2 text-xs">{post.shares}</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

