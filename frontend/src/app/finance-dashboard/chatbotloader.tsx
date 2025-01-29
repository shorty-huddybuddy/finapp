'use client'
import { useEffect } from 'react'

const ChatbotLoader = () => {
  useEffect(() => {
    const loadChatbot = () => {
      const script = document.createElement("script")
      script.src = "https://www.chatbase.co/embed.min.js"
      script.id = "Q2rjth501r8z8EHph4FsZ" 
      script.setAttribute("data-domain", "www.chatbase.co")
      script.defer = true
      document.body.appendChild(script)
    }

    loadChatbot()

    return () => {
      const script = document.getElementById("Q2rjth501r8z8EHph4FsZ")
      if (script) script.remove()
    }
  }, [])

  return null
}

export default ChatbotLoader