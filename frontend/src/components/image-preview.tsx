"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useEffect, useState, useRef, useCallback } from "react"
import { ZoomIn, ZoomOut, X, RotateCw, Download, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ImagePreviewProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  images: string[]
  initialIndex?: number
}

// Add this helper component for screen readers
const VisuallyHidden = ({ children }: { children: React.ReactNode }) => (
  <span className="sr-only">{children}</span>
);

export function ImagePreview({ open, onOpenChange, images, initialIndex = 0 }: ImagePreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLImageElement>(null)

  // Reset everything when the modal opens or image changes
  useEffect(() => {
    if (open) {
      setScale(1)
      setRotation(0)
      setPosition({ x: 0, y: 0 })
      setCurrentIndex(initialIndex)
    }
  }, [open, initialIndex])

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5))
  }

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const handleDownload = () => {
    if (images[currentIndex]) {
      const link = document.createElement('a')
      link.href = images[currentIndex]
      link.download = `image-${Date.now()}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % images.length)
    resetImagePosition()
  }

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length)
    resetImagePosition()
  }

  const resetImagePosition = () => {
    setScale(1)
    setRotation(0)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (dragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        })
      }
    },
    [dragging, dragStart]
  )

  const handleMouseUp = useCallback(() => {
    setDragging(false)
  }, [])

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    if (e.deltaY < 0) {
      setScale(prev => Math.min(prev + 0.1, 3))
    } else {
      setScale(prev => Math.max(prev - 0.1, 0.5))
    }
  }

  // Add and remove event listeners for mouse movements
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  if (!images.length) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl w-[calc(100vw-32px)] h-[calc(100vh-32px)] p-0 bg-black/90" onWheel={handleWheel}>
        <DialogTitle className="sr-only">
          Image Preview
        </DialogTitle>
        
        {/* Close button */}
        <Button 
          className="absolute top-2 right-2 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full"
          size="icon" 
          variant="ghost" 
          onClick={() => onOpenChange(false)}
        >
          <X />
        </Button>
        
        {/* Image container */}
        <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
          <img
            ref={imageRef}
            src={images[currentIndex]}
            alt="Preview"
            className={cn(
              "max-h-full max-w-full object-contain cursor-move transition-none",
              dragging ? "transition-none" : "transition-transform duration-200"
            )}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
            }}
            onMouseDown={handleMouseDown}
            draggable={false}
          />
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/50 rounded-full px-4 py-2">
          <Button size="icon" variant="ghost" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={handleRotate}>
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        {images.length > 1 && (
          <>
            <Button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70"
              size="icon"
              variant="ghost"
              onClick={handlePrev}
            >
              <ArrowLeft />
            </Button>
            <Button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70"
              size="icon"
              variant="ghost"
              onClick={handleNext}
            >
              <ArrowRight />
            </Button>
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-black/50 rounded-full px-3 py-1 text-xs">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
