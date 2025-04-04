import { FileUpload } from "@/components/file-upload"
import { Features } from "@/components/features_1"
import { Navbar2 } from "@/components/Navbar2"

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Navbar2/>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10">PDF Summarizer</h1>
        <FileUpload />
        <Features />
      </div>
    </div>
  )
}

