"use client"
import { Sidebar } from "@/components/sidebar_social"
import { SearchHeader } from "@/components/search-header"
import { RightSidebar } from "@/components/right-sidebar"
import { ScrollToTop } from "@/components/scroll-to-top"
import { StoreProvider } from "@/providers/StoreProvider"
import type React from "react"
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from "framer-motion"

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
    <StoreProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Left Sidebar */}
        <div className="fixed left-0 top-0 bottom-0 z-30">
          <Sidebar />
        </div>

        {/* Main Content */}
        <motion.main
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex-1 ml-16 md:ml-64 mr-0 lg:mr-80 min-h-screen"
        >
          <div className="max-w-5xl mx-auto px-4 py-6">
            {!isPostDetailPage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6 rounded-xl shadow-sm bg-white border border-gray-100"
              >
                <SearchHeader />
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {children}
            </motion.div>
          </div>
        </motion.main>

        {/* Right Sidebar */}
        <div className="fixed right-0 top-0 bottom-0 hidden lg:block border-l border-gray-200 bg-white/50 backdrop-blur-sm z-20">
          <RightSidebar />
        </div>

        {/* Scroll To Top */}
        <div className="z-40">
          <ScrollToTop />
        </div>
      </div>
    </StoreProvider>
  )
}


