"use client";
import { motion } from "framer-motion"
import Link from "next/link"
import { Home, Search, Bell, Mail, Bookmark, Users, Star, Bot, User, Building2, ArrowLeft } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { UserButton, useUser } from "@clerk/nextjs";

export function Sidebar() {
  const {user} = useUser();
  const menuItems = [
    { icon: ArrowLeft, label: "Back to Home", href: "/" },
    { icon: Home, label: "Social Home", href: "/social/" },
    { icon: Search, label: "Explore", href: "/social/explore" },
    // { icon: Bell, label: "Notifications", href: "/social/notifications" },
    // { icon: Mail, label: "Messages", href: "/social/messages" },
    // { icon: Bookmark, label: "Bookmarks", href: "/social/bookmarks" },
    // { icon: Users, label: "Communities", href: "/social/communities" },
    // { icon: Star, label: "Premium", href: "/social/premium" },
    // { icon: Building2, label: "Verified Orgs", href: "/social/verified-orgs" },
    // { icon: User, label: "Profile", href: "/social/profile" },
    { icon: Bot, label: "ChatBot", href: "/social/chatbot" },
  ]

  return (
    <motion.aside
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-16 md:w-64 p-4 flex flex-col gap-2 h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white overflow-y-hidden"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-4"
      >
        <h1 className="text-xl font-bold hidden md:block text-white">Trading Social</h1>
      </motion.div>
      <nav className="space-y-1">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              href={item.href}
              className="flex items-center gap-4 px-2 md:px-4 py-3 text-sm font-medium rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <item.icon className="w-5 h-5" />
              </motion.div>
              <span className="hidden md:block">{item.label}</span>
            </Link>
          </motion.div>
        ))}
      </nav>
      <div className="mt-auto p-4 border-t border-white/10">
        <Avatar>
          <UserButton 
            appearance={{
              elements: {
                rootBox: "w-10 h-10",
                userButtonAvatarBox: "w-10 h-10",
              }
            }}
          />
        </Avatar>
        <div className="flex-1 min-w-0 hidden md:block mt-2">
          <p className="text-sm font-medium truncate text-white">{user?.fullName}</p>
          <p className="text-sm text-blue-200 truncate">@{user?.username}</p>
        </div>
      </div>
    </motion.aside>
  )
}

