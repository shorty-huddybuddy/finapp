import { useState, useRef, ChangeEvent } from 'react'

interface UsePostFormReturn {
  content: string
  setContent: (content: string) => void
  selectedImage: string | null
  setSelectedImage: (image: string | null) => void
  fileInputRef: React.RefObject<HTMLInputElement>
  handleImageClick: () => void
  handleImageChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleEmojiSelect: (emoji: any) => void
  resetForm: () => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

interface PostData {
  content: string
  image?: string | null
}

export const usePostForm = (): UsePostFormReturn => {
  const [content, setContent] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null!)

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEmojiSelect = (emoji: any) => {
    setContent(prev => prev + emoji.native)
  }

  const resetForm = () => {
    setContent("")
    setSelectedImage(null)
  }

  return {
    content,
    setContent,
    selectedImage,
    setSelectedImage,
    fileInputRef,
    handleImageClick,
    handleImageChange,
    handleEmojiSelect,
    resetForm,
    isLoading,
    setIsLoading
  }
}
