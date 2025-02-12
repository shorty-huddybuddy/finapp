import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export default function ExplorePage() {
  const newsItems = [
    {
      title: "Major Market Movement",
      description: "Bitcoin surges past $50k as institutional investors...",
      category: "Crypto",
      time: "2 hours ago",
      posts: "167K posts",
      image: "/placeholder.svg",
    },
    {
      title: "Trading Update",
      description: "S&P 500 reaches new all-time high amid strong earnings...",
      category: "Markets",
      time: "4 hours ago",
      posts: "183K posts",
      image: "/placeholder.svg",
    },
    {
      title: "Economic News",
      description: "Federal Reserve announces new policy measures...",
      category: "Finance",
      time: "6 hours ago",
      posts: "76K posts",
      image: "/placeholder.svg",
    },
  ]

  return (
    <div className="container max-w-4xl mx-auto">
      <Tabs defaultValue="for-you" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger
            value="for-you"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-8 py-3"
          >
            For You
          </TabsTrigger>
          <TabsTrigger
            value="trending"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-8 py-3"
          >
            Trending
          </TabsTrigger>
          <TabsTrigger
            value="news"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-8 py-3"
          >
            News
          </TabsTrigger>
          <TabsTrigger
            value="sports"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-8 py-3"
          >
            Sports
          </TabsTrigger>
          <TabsTrigger
            value="entertainment"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-8 py-3"
          >
            Entertainment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="for-you" className="mt-6">
          <div className="space-y-4">
            {newsItems.map((item, i) => (
              <Card key={i} className="flex p-4 hover:bg-accent/50 cursor-pointer">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{item.category}</span>
                    <span>·</span>
                    <span>{item.time}</span>
                  </div>
                  <h3 className="font-semibold mt-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  <div className="text-sm text-muted-foreground mt-2">{item.posts}</div>
                </div>
                <div className="ml-4">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                  />
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Other tab contents would be similar */}
        <TabsContent value="trending">Trending content</TabsContent>
        <TabsContent value="news">News content</TabsContent>
        <TabsContent value="sports">Sports content</TabsContent>
        <TabsContent value="entertainment">Entertainment content</TabsContent>
      </Tabs>
    </div>
  )
}

