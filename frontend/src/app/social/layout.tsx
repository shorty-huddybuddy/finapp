import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Sidebar } from "@/components/sidebar_social"
import { SearchHeader } from "@/components/search-header"
import { RightSidebar } from "@/components/right-sidebar"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Social Trading App",
  description: "Connect with traders and get premium predictions",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="fixed left-0 top-0 bottom-0">
        <Sidebar />
      </div>
      <main className="flex-1 ml-16 md:ml-64 mr-0 lg:mr-80">
        <div className="mb-4">
          <SearchHeader />
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


