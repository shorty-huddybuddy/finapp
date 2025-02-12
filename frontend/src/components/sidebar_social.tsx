"use client";
import Link from "next/link"
import { Home, Search, Bell, Mail, Bookmark, Users, Star, Bot, User, Building2 } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { UserButton, useUser } from "@clerk/nextjs";

export function Sidebar() {
  const {user} = useUser();
  const menuItems = [
    { icon: Home, label: "Home", href: "/social/" },
    { icon: Search, label: "Explore", href: "/social/explore" },
    { icon: Bell, label: "Notifications", href: "/social/notifications" },
    { icon: Mail, label: "Messages", href: "/social/messages" },
    { icon: Bookmark, label: "Bookmarks", href: "/social/bookmarks" },
    { icon: Users, label: "Communities", href: "/social/communities" },
    { icon: Star, label: "Premium", href: "/social/premium" },
    { icon: Building2, label: "Verified Orgs", href: "/social/verified-orgs" },
    { icon: User, label: "Profile", href: "/social/profile" },
    { icon: Bot, label: "ChatBot", href: "/social/chatbot" },
  ]

  return (
    <aside className="w-16 md:w-64 p-4 flex flex-col gap-2 h-screen bg-background overflow-y-hidden">
      <div className="mb-4">
        <h1 className="text-xl font-bold hidden md:block">Trading Social</h1>
      </div>
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-4 px-2 md:px-4 py-3 text-sm font-medium rounded-full hover:bg-accent group"
          >
            <item.icon className="w-5 h-5" />
            <span className="hidden md:block">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto flex items-center gap-3 p-4">
        <Avatar>
          <UserButton/>
        </Avatar>
        <div className="flex-1 min-w-0 hidden md:block">
          <p className="text-sm font-medium truncate">{user?.fullName}</p>
          <p className="text-sm text-muted-foreground truncate">@{user?.username}</p>
        </div>
      </div>
    </aside>
  )
}

