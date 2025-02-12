import Link from "next/link"
import { Home, Search, Bell, Mail, Bookmark, Users, Star, Bot, User, Building2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Sidebar() {
  const menuItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Search, label: "Explore", href: "/explore" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: Mail, label: "Messages", href: "/messages" },
    { icon: Bookmark, label: "Bookmarks", href: "/bookmarks" },
    { icon: Users, label: "Communities", href: "/communities" },
    { icon: Star, label: "Premium", href: "/premium" },
    { icon: Building2, label: "Verified Orgs", href: "/verified-orgs" },
    { icon: User, label: "Profile", href: "/profile" },
    { icon: Bot, label: "ChatBot", href: "/chatbot" },
  ]

  return (
    <aside className="w-64 p-4 flex flex-col gap-2 h-screen bg-background overflow-y-hidden">
      <div className="mb-4">
        <h1 className="text-xl font-bold">Trading Social</h1>
      </div>
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-full hover:bg-accent"
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto flex items-center gap-3 p-4">
        <Avatar>
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">Username</p>
          <p className="text-sm text-muted-foreground truncate">@username</p>
        </div>
      </div>
    </aside>
  )
}

