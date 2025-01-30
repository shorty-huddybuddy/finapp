"use client"

import React, { useState, useEffect } from "react"
import { MessageCircle, X } from "lucide-react"
interface BotpressWebChat {
  sendEvent: (event: { type: string }) => void;
}

declare global {
  interface Window {
    botpressWebChat: BotpressWebChat;
  }
}
export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const injectScript = document.createElement("script")
    injectScript.src = "https://cdn.botpress.cloud/webchat/v2.2/inject.js"
    
    const configScript = document.createElement("script")
    configScript.src = "https://files.bpcontent.cloud/2025/01/30/17/20250130173815-F4D2QRFX.js"
    
    // Wait for scripts to load
    const handleLoad = () => {
      if (window.botpressWebChat) {
        setIsLoaded(true)
      }
    }
    
    injectScript.addEventListener('load', handleLoad)
    document.body.appendChild(injectScript)
    document.body.appendChild(configScript)

    return () => {
      injectScript.removeEventListener('load', handleLoad)
      document.body.removeChild(injectScript)
      document.body.removeChild(configScript)
    }
  }, [])

  const toggleChat = () => {
    if (!isLoaded) return
    setIsOpen(!isOpen)
    if (window.botpressWebChat) {
      window.botpressWebChat.sendEvent({ type: !isOpen ? "show" : "hide" })
    }
  }

}
