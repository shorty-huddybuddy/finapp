"use client"
import { Search, Image, Smile, X } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { usePostForm } from "@/hooks/usePostForm"
import { useUser, useAuth } from "@clerk/nextjs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useExtendedUser } from "@/hooks/useExtendedUser"

interface ErrorResponse {
  error: string;
}

export function SearchHeader() {
  const {user } = useUser()
  const { isPremium } = useExtendedUser()
  const { getToken } = useAuth()

  const {
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
  } = usePostForm()

  const [isPremiumPost, setIsPremiumPost] = useState(false)
  const [requiredTier, setRequiredTier] = useState("basic")

  const handlePost = async () => {
    if (!content.trim() || isLoading || !user) {
      return;
    }

    try {
      setIsLoading(true);
      
      const token = await getToken();
      console.log(token)
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      const postData = {
        author: {
          name: user.fullName || "",
          handle: `@${user.username || user.id}`,
          avatar: user.imageUrl || "",
          isPremium: false
        },
        content: content.trim(),
        image: selectedImage || "",
        isPremiumPost: isPremiumPost,
        requiredSubscriptionTier: isPremiumPost ? requiredTier : undefined
      };

      console.log("Sending post data:", postData); 
      const response = await fetch('http://localhost:8080/api/social/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  
        },
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        const errorData = await response.json() as ErrorResponse;
        throw new Error(errorData.error || 'Failed to create post');
      }

      const result = await response.json();
      console.log('Post created:', result);
      toast.success('Post created successfully!');
      resetForm();
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast.error(error?.message || 'Failed to create post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-background/80 backdrop-blur-sm border-b border-border ">
      <div className="flex flex-col gap-4 max-w-2xl mx-auto">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder="Search users or posts..." className="pl-10 w-full bg-muted" />
        </div>

        {/* Post Creation Form */}
        <div className="w-full">
          <div className="flex flex-col gap-4 border rounded-lg p-2 sm:p-4">
            <Textarea 
              placeholder="What's on your mind?" 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[60px] sm:min-h-[100px] resize-y max-h-[300px]"
            />

            {/* Premium Post Options - available to all users now */}
            {user && (
              <div className="flex flex-col gap-2 p-2 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label htmlFor="premium-toggle" className="font-medium">
                    Make this a premium post
                  </Label>
                  <Switch
                    id="premium-toggle"
                    checked={isPremiumPost}
                    onCheckedChange={setIsPremiumPost}
                  />
                </div>

                {isPremiumPost && (
                  <Select value={requiredTier} onValueChange={setRequiredTier}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select required tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic Tier ($4.99)</SelectItem>
                      <SelectItem value="pro">Pro Tier ($9.99)</SelectItem>
                      <SelectItem value="vip">VIP Tier ($19.99)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}

            {/* Image Preview */}
            {selectedImage && (
              <div className="relative">
                <img 
                  src={selectedImage} 
                  alt="Selected" 
                  className="max-h-[150px] sm:max-h-[200px] rounded-lg object-cover w-full" 
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}


            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1 sm:gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-blue-500 hover:text-blue-600"
                  onClick={handleImageClick}
                >
                  <Image className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600">
                      <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 border-none">
                    <Picker 
                      data={data} 
                      onEmojiSelect={handleEmojiSelect}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="ml-auto">
                <Button 
                  onClick={handlePost}
                  disabled={!content.trim() || isLoading}
                  size="sm"
                  className="sm:text-base"
                >
                  {isLoading ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

