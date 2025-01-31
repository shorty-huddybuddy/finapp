"use client"
import React from "react"
import { useAuth } from "@clerk/nextjs"

export default function Example() {
    const { isLoaded, isSignedIn, userId, sessionId, getToken } = useAuth()
  
    if (!isLoaded) {
      return <div>Loading...</div>
    }
  
    if (!isSignedIn) {
      // You could also add a redirect to the sign-in page here
      return <div>Sign in to view this page</div>
    }
  
    return (
      <div>
        Hello, {userId}! Your current active session is {sessionId}.
      </div>
  )
  }
  