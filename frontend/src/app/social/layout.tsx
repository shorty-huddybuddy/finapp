"use client"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Sidebar } from "@/components/sidebar_social"
import { SearchHeader } from "@/components/search-header"
import { RightSidebar } from "@/components/right-sidebar"
import type React from "react"
import { usePathname } from 'next/navigation'
const inter = Inter({ subsets: ["latin"] })


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

   const pathname = usePathname()
  const isPostDetailPage = pathname?.startsWith('/social/post/')
  return (
    <div className="flex min-h-screen bg-background">
      <div className="fixed left-0 top-0 bottom-0">
        <Sidebar />
      </div>
      <main className="flex-1 ml-16 md:ml-64 mr-0 lg:mr-80">
        <div className="mb-4">
          {!isPostDetailPage && <SearchHeader />}
        </div>
        <div className="px-4">
          {children}
        </div>
      </main>
      <div className="fixed right-0 top-0 bottom-0">
        <RightSidebar />
      </div>
    </div>
  )
}


