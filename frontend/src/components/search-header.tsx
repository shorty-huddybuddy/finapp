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
import { API_URL } from '@/lib/config'

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
      const response = await fetch(`${API_URL}/api/social/posts`, {
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
    <div className="bg-white rounded-xl">
      <div className="flex flex-col gap-6 p-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input 
            placeholder="Search users or posts..." 
            className="pl-10 w-full bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 h-11 rounded-lg"
          />
        </div>

        {/* Post Creation Form */}
        <div className="space-y-4">
          <Textarea 
            placeholder="Share your trading insights..." 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] resize-none bg-gray-50 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base p-4"
          />

          {/* Premium Post Options */}
          {user && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
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
            <div className="relative rounded-lg overflow-hidden bg-gray-50 p-2">
              <img 
                src={selectedImage} 
                alt="Selected" 
                className="max-h-[200px] rounded-lg object-cover w-full" 
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                onClick={handleImageClick}
              >
                <Image className="w-5 h-5 mr-2" />
                Add Image
              </Button>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <Smile className="w-5 h-5 mr-2" />
                    Add Emoji
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 border-none shadow-xl">
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                {isLoading ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

