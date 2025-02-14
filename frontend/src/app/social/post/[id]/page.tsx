"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { useAuth, useUser } from "@clerk/nextjs"
import { PostDetailHeader } from "@/components/post-detail-header"
import Image from "next/image"

type Post = {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  liked: boolean;
}

type Comment = {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
}

export default function PostDetailPage() {
  const { user } = useUser()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState("")
  const { getToken } = useAuth()
  const { id } = useParams() as { id: string }

  // Fetch post details and comments on mount
  useEffect(() => {
    const fetchPostDetails = async () => {
      try {

        const token = await getToken()
        const res = await fetch(`http://localhost:8080/api/social/posts/${id}`, {
          headers: { 'Authorization': token ? `Bearer ${token}` : '' }
        })
        if (!res.ok) throw new Error("Failed to load post")
        const postData = await res.json()
        setPost(postData)

        // Assume a comments endpoint is available:
        const commentRes = await fetch(`http://localhost:8080/api/social/posts/${id}/comments`, {
          headers: { 'Authorization': token ? `Bearer ${token}` : '' }
        })
        if (commentRes.ok) {
          const commentData = await commentRes.json()
          setComments(commentData)
        }
      } catch (error) {
        toast.error("Error loading post")
      } finally {
        setLoading(false)
      }
    }
    fetchPostDetails()
    
  }, [id, getToken])

  const handleCommentSubmit = async () => {

    if(!commentText.trim() || !user) return;

    try {
      const token = await getToken()
      const res = await fetch(`http://localhost:8080/api/social/posts/${id}/comments`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          content: commentText.trim()
        })
      })

      if (!res.ok) throw new Error("Failed to submit comment")
      
      const newComment = await res.json()
      setComments(prev => [newComment, ...prev])
      setCommentText("")
      
      // Update post comment count
      if (post) {
        setPost({
          ...post,
          comments: post.comments + 1
        })
      }
      
      toast.success("Comment added")
    } catch (error) {
      toast.error("Error posting comment")
    }
  }

  if (loading) return (
    <>
      <PostDetailHeader />
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    </>
  )

  if (!post) return (
    <>
      <PostDetailHeader />
      <div className="p-8 text-center">Post not found</div>
    </>
  )

  return (
    <div className="min-h-screen bg-background">
      <PostDetailHeader />
      <div className="max-w-2xl mx-auto p-4">
        <Card className="mb-4">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback>{post.author.name.slice(0,2)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{post.author.name}</div>
                <div className="text-sm text-muted-foreground">{post.author.handle} · {post.timestamp}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm whitespace-pre-line">{post.content}</p>
            {post.image && (
              <div className="relative w-full rounded-lg overflow-hidden">
                 <img src={post.image} alt="Post image" className="mt-4 rounded-lg" />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Heart className={post.liked ? "text-red-500 fill-red-500" : ""} />
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle />
                <span>{post.comments}</span>
              </div>
              <div className="flex items-center gap-1">
                <Share />
                <span>{post.shares}</span>
              </div>
            </div>
          </CardFooter>
        </Card>

        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Comments</h2>
          
          {user && (
            <div className="flex gap-2">
              <Input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1"
              />
              <Button onClick={handleCommentSubmit}>Post</Button>
            </div>
          )}

          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">No comments yet</div>
            ) : (
              comments.map(comment => (
                <Card key={comment.id} className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.author.avatar} />
                        <AvatarFallback>{comment.author.name.slice(0,2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-sm">{comment.author.name}</div>
                        <div className="text-xs text-muted-foreground">{comment.timestamp}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{comment.content}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
