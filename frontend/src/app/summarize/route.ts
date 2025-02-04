import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI("AIzaSyA5f_u8sfMmks_k9Ztka9swKVqQMWLlUB4")

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const pdfFile = formData.get("pdf") as File

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

    const fileBuffer = await pdfFile.arrayBuffer()
    const uint8Array = new Uint8Array(fileBuffer)

    const result = await model.generateContent([
      "Please provide a concise summary of this PDF:",
      {
        inlineData: {
          mimeType: "application/pdf",
          data: Buffer.from(uint8Array).toString("base64"),
        },
      },
    ])

    const response = await result.response
    const text = response.text()

    return Response.json({ summary: text })
  } catch (error) {
    console.error("Error in /api/summarize:", error)
    return Response.json({ error: "Failed to summarize PDF" }, { status: 500 })
  }
}

