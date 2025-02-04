"use client"

import { useState, useRef } from "react"
import { FileIcon, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PDFChat } from "./pdf-chat"

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [summary, setSummary] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [documentId, setDocumentId] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    setLoading(true)
    setSummary("") // Clear previous summary
    setFile(file) // Set the new file immediately to show the filename
    const formData = new FormData()
    formData.append("pdf", file)

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      setSummary(data.summary)
      setDocumentId((prevId) => prevId + 1) // Increment document ID to reset chat
    } catch (error) {
      console.error("Error summarizing PDF:", error)
      setFile(null) // Reset file if there's an error
    } finally {
      setLoading(false)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-8">
      <Card className="border-2 border-dashed bg-blue-600 text-white">
        <label className="flex flex-col items-center justify-center p-12 text-center cursor-pointer">
          <FileIcon className="w-12 h-12 mb-4" />
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                handleFileUpload(file)
              }
            }}
          />
          <div>
            {file ? (
              <div className="flex items-center space-x-2">
                <CheckCircle className="text-green-400" />
                <span className="text-sm font-medium">{file.name}</span>
              </div>
            ) : (
              <>
                <Button variant="secondary" className="mb-2" onClick={handleButtonClick}>
                  CHOOSE FILES
                </Button>
                <p>or drop files here</p>
              </>
            )}
          </div>
        </label>
      </Card>

      {loading && (
        <div className="text-center">
          <p className="text-muted-foreground">Generating summary...</p>
        </div>
      )}

      {summary && file && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{summary}</p>
          </Card>
          <PDFChat file={file} documentId={documentId} />
        </div>
      )}
    </div>
  )
}

