"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Heart, MessageCircle, Share, MoreHorizontal, Star } from "lucide-react"
import Link from "next/link"
import { useEffect, useState, useRef, useCallback } from "react"
import Image from "next/image"
import { useAuth } from "@clerk/nextjs"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"  

type Post = {
  id: string
  author: {
    name: string
    handle: string
    avatar: string
    isPremium: boolean
  }
  content: string
  image?: string
  likes: number
  comments: number
  shares: number
  isPremiumPost: boolean
  timestamp: string
  liked: boolean
}

const POSTS_PER_PAGE = 10  // Number of posts to load each timeconst POSTS_PER_PAGE = 10  // Number of posts to load each time

export function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [lastPostId, setLastPostId] = useState<string | null>(null)
  const { getToken } = useAuth()

  const observer = useRef<IntersectionObserver | null>(null);
  
  // Move fetchPosts before it's used
  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true)
      const token = await getToken()
      
      const url = new URL('http://localhost:8080/api/social/posts')
      if (lastPostId) {
        url.searchParams.append('lastId', lastPostId)
      }
      url.searchParams.append('limit', POSTS_PER_PAGE.toString())

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }

      const fetchedPosts = await response.json()
      
      // Fetch like status for each post
      const postsWithLikeStatus = await Promise.all(
        fetchedPosts.map(async (post: Post) => {
          try {
            const likeResponse = await fetch(
              `http://localhost:8080/api/social/posts/${post.id}/like/status`,
              {
                headers: {
                  'Authorization': token ? `Bearer ${token}` : '',
                }
              }
            );
            if (likeResponse.ok) {
              const { liked } = await likeResponse.json();
              return { ...post, liked };
            }
          } catch (error) {
            console.error('Error fetching like status:', error);
          }
          return post;
        })
      );
      
      if (postsWithLikeStatus.length < POSTS_PER_PAGE) {
        setHasMore(false)
      }
      
      if (postsWithLikeStatus.length > 0) {
        setLastPostId(postsWithLikeStatus[postsWithLikeStatus.length - 1].id)
        setPosts(prev => [...prev, ...postsWithLikeStatus])
      }

    } catch (err) {
      console.error('Error fetching posts:', err)
      setError('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, lastPostId, getToken]) // Add dependencies

  const lastPostElementRef = useCallback((node: HTMLElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchPosts();
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore, fetchPosts]);

  // Add a function to generate unique keys
  const getUniqueKey = (post: Post, index: number) => {
    // Use both post.id and index to ensure uniqueness
    return `${post.id}-${index}`;
  };

  const handleLike = async (postId: string, currentLikes: number, isCurrentlyLiked: boolean) => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Please login to like posts');
        return;
      }

      // Optimistically update UI
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 } 
          : post
      ));

      const response = await fetch(`http://localhost:8080/api/social/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        // Revert optimistic update if failed
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, likes: currentLikes } 
            : post
        ));
        throw new Error('Failed to toggle like');
      }

      const data = await response.json();
      // Update posts with actual server response if needed
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes: data.liked ? currentLikes + 1 : currentLikes - 1 } 
          : post
      ));

      const data = await response.json();
      console.log(`Post ${postId} ${data.liked ? 'liked' : 'unliked'} successfully`);

    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to toggle like');
    }
  };

  // Add this effect to fetch initial like status for posts
  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!posts.length) return;
      
      const token = await getToken();
      if (!token) return;

      try {
        const updatedPosts = await Promise.all(
          posts.map(async (post) => {
            const response = await fetch(`http://localhost:8080/api/social/posts/${post.id}/like`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              }
            });
            
            if (response.ok) {
              const { liked } = await response.json();
              return { ...post, liked };
            }
            return post;
          })
        );

        setPosts(updatedPosts);
      } catch (error) {
        console.error('Error fetching like status:', error);
      }
    };

    fetchLikeStatus();
  }, [posts.length, getToken]);

  // Initial load
  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  if (error) return <div className="p-4 text-center text-red-500">{error}</div>
  
  // Show centered spinner for initial loading
  if (loading && posts.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4">
      {posts.length === 0 ? (
        <div className="text-center text-muted-foreground">No posts yet</div>
      ) : (
        <>
          {posts.map((post, index) => (
            <div
              // Use the unique key function here
              key={getUniqueKey(post, index)}
              ref={index === posts.length - 1 ? lastPostElementRef : undefined}
            >
              <Card className="border-border">
                <CardHeader className="flex flex-row items-center space-y-0 gap-3">
                  <Avatar>
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback>{post.author.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Link href={`/profile/${post.author.handle}`} className="font-semibold hover:underline">
                        {post.author.name}
                      </Link>
                      {post.author.isPremium && (
                        <Badge variant="secondary">
                          <Star className="w-3 h-3 mr-1" />
                          PRO
                        </Badge>
                      )}
                      <span className="text-sm text-muted-foreground">· {post.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{post.author.handle}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Copy link</DropdownMenuItem>
                      <DropdownMenuItem>Report post</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm whitespace-pre-line">{post.content}</p>
                  {post.image && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                      <Image src={post.image || "/placeholder.svg"} alt="Post image" fill className="object-cover" />
                    </div>
                  )}
                  {post.isPremiumPost && (
                    <div>
                      <Badge variant="secondary" className="bg-yellow-100/10">
                        <Star className="w-3 h-3 mr-1 text-yellow-500" />
                        Premium Content
                      </Badge>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`hover:text-red-500 ${post.liked ? 'text-red-500' : ''}`}
                      onClick={() => handleLike(post.id, post.likes, post.liked)}
                    >
                      <Heart 
                        className={post.liked ? "w-4 h-4 fill-red-500 text-red-500" : "w-4 h-4"} 
                      />
                      <span className="ml-2 text-xs">{post.likes}</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MessageCircle className="w-4 h-4" />
                      <span className="ml-2 text-xs">{post.comments}</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share className="w-4 h-4" />
                      <span className="ml-2 text-xs">{post.shares}</span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          ))}
          
          {/* Bottom loading spinner */}
          {loading && (
            <div className="py-4 flex items-center justify-center">
              <Spinner />
            </div>
          )}
        </>
      )}
    </div>
  )
}

