"use client"
import {
  ClerkProvider,

} from '@clerk/nextjs'
import './globals.css'
import React from "react"
import { Toaster } from "sonner"


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
 

  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Toaster position="top-center" />
       
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}