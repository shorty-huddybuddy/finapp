"use client"
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
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
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
            
          </SignedIn>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}