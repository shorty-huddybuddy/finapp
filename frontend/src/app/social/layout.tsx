"use client"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Sidebar } from "@/components/sidebar_social"
import { SearchHeader } from "@/components/search-header"
import { RightSidebar } from "@/components/right-sidebar"
import { ScrollToTop } from "@/components/scroll-to-top"
import type React from "react"
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from "framer-motion"
const inter = Inter({ subsets: ["latin"] })


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const isPostDetailPage = pathname?.startsWith('/social/post/')

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render until client-side hydration is complete
  if (!mounted) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-900/5 to-blue-800/5 border-l border-gray-200">
      <div className="fixed left-0 top-0 bottom-0">
        <Sidebar />
      </div>
      <motion.main
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex-1 ml-16 md:ml-64 mr-0 lg:mr-80 p-6"
      >
        <div className="max-w-4xl mx-auto">
          {!isPostDetailPage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <SearchHeader />
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            {children}
          </motion.div>
        </div>
      </motion.main>
      <div className="fixed right-0 top-0 bottom-0 hidden lg:block ">
        <RightSidebar />
      </div>
      <ScrollToTop />
    </div>
  )
}


