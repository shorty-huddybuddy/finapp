"use client"

import { useState, useEffect } from "react"
import { SendIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface PDFChatProps {
  file: File | null
  documentId: number
}

interface ChatMessage {
  question: string
  answer: string
}

export function PDFChat({ file, documentId }: PDFChatProps) {
  const [question, setQuestion] = useState("")
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)

  // Reset chat history when documentId changes
  useEffect(() => {
    setChatHistory([])
    setQuestion("")
  }, [documentId])

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim() || !file) return

    setLoading(true)
    const formData = new FormData()
    formData.append("pdf", file)
    formData.append("question", question)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      setChatHistory((prev) => [...prev, { question, answer: data.answer }])
      setQuestion("")
    } catch (error) {
      console.error("Error getting answer:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatAnswer = (answer: string) => {
    // Split the answer into bullet points if it contains multiple sentences
    const sentences = answer.split(/(?<=[.!?])\s+/)
    if (sentences.length > 1) {
      return (
        <ul className="list-disc pl-5 space-y-2">
          {sentences.map((sentence, index) => (
            <li key={index}>{sentence}</li>
          ))}
        </ul>
      )
    }
    return <p>{answer}</p>
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Ask Questions About the PDF</h2>
      <div className="space-y-4">
        {chatHistory.map((chat, index) => (
          <div key={index} className="space-y-2">
            <p className="font-semibold">Q: {chat.question}</p>
            <div className="p-4 bg-muted rounded-lg">{formatAnswer(chat.answer)}</div>
          </div>
        ))}
      </div>
      <form onSubmit={handleAskQuestion} className="mt-4 space-y-4">
        <div className="flex gap-2">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about the document..."
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            <SendIcon className="w-4 h-4" />
          </Button>
        </div>
        {loading && <p className="text-muted-foreground">Thinking...</p>}
      </form>
    </Card>
  )
}

