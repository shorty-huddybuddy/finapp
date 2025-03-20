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
import { useAuth, useUser } from "@clerk/nextjs"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"  
import { useRouter } from 'next/navigation'
import { SubscriptionDialog } from "./subscription-dialog"

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
  requiredSubscriptionTier?: string
  minimumTierRequired?: string
  hasAccess: boolean
  creatorId?: string
}

const POSTS_PER_PAGE = 10  // Number of posts to load each timeconst POSTS_PER_PAGE = 10  // Number of posts to load each time

export function PostFeed() {
  // Add a cache key that changes on each mount
  const cacheKey = useRef(Date.now())
  const seenPostIds = useRef(new Set<string>())
  
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [lastPostId, setLastPostId] = useState<string | null>(null)
  const { getToken } = useAuth()
  const { user } = useUser()
  const observer = useRef<IntersectionObserver | null>(null);
  const router  = useRouter();
  
  // Add subscription dialog states
  const [showSubscribeDialog, setShowSubscribeDialog] = useState(false)
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null)
  const [subscriptionType, setSubscriptionType] = useState<"creator" | "platform" | null>(null)

  // Add a cleanup effect
  useEffect(() => {
    return () => {
      setPosts([])
      setLastPostId(null)
      setHasMore(true)
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [])

  const canViewPremiumContent = (post: Post) => {
    // Check if post is premium
    const isPremiumContent = post.isPremiumPost || post.author.isPremium;
    if (!isPremiumContent) return true;

    // Authors can always see their own posts
    if (user && `@${user.username || user.id}` === post.author.handle) {
      return true;
    }

    // For premium content, check server-provided access flag
    return post.hasAccess === true;
  };

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
      
      // Filter out any posts we've already seen
      const uniquePosts = fetchedPosts.filter((post: Post) => {
        if (seenPostIds.current.has(post.id)) {
          return false
        }
        seenPostIds.current.add(post.id)
        return true
      })

      if (uniquePosts.length === 0) {
        setHasMore(false)
        return
      }

      // Fetch like status for unique posts
      const postsWithLikeStatus = await Promise.all(
        uniquePosts.map(async (post: Post) => {
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
  }, [loading, hasMore, lastPostId, getToken]) // Removed posts dependency

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

  const handleLike = async (e: React.MouseEvent, postId: string, currentLikes: number, isCurrentlyLiked: boolean) => {
    e.stopPropagation(); // Add this to prevent navigation
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Please login to like posts');
        return;
      }

      // Optimistically update UI
      setPosts(posts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              liked: !isCurrentlyLiked,
              likes: isCurrentlyLiked ? post.likes - 1 : post.likes + 1 
            } 
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
            ? { 
                ...post, 
                liked: isCurrentlyLiked,
                likes: currentLikes 
              } 
            : post
        ));
        throw new Error('Failed to update like');
      }

      const data = await response.json();
      console.log(`Post ${postId} ${data.liked ? 'liked' : 'unliked'} successfully`);

    } catch (error) {
      console.error('Error updating like:', error);
      toast.error('Failed to update like');
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
            const response = await fetch(`http://localhost:8080/api/social/posts/${post.id}/like/status`, {
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

  // Add delete handler
  const handleDeletePost = async (postId: string, authorHandle: string) => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Please login to delete posts');
        return;
      }

      // Check if user is the author
      const userHandle = `@${user?.username || user?.id}`
      if (authorHandle !== userHandle) {
        toast.error('You can only delete your own posts');
        return;
      }

      const response = await fetch(`http://localhost:8080/api/social/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      // Remove post from state
      setPosts(posts.filter(post => post.id !== postId));
      toast.success('Post deleted successfully');

    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  // Initial load
  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handlePostClick = (e: React.MouseEvent, post: Post) => {
    // Prevent navigation if premium content and no access
    const hasAccess = canViewPremiumContent(post);
    const isPremiumContent = post.isPremiumPost || post.author.isPremium;

    if (isPremiumContent && !hasAccess) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    router.push(`/social/post/${post.id}`);
  };

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
          {posts.map((post, index) => {
            const hasAccess = canViewPremiumContent(post);
            const isPremiumContent = post.isPremiumPost || post.author.isPremium;
            
            const postContent = (
              <Card 
                className="border-border hover:border-blue-500 transition-colors cursor-pointer relative" 
                onClick={(e) => handlePostClick(e, post)}  // Replace the direct router.push with handlePostClick
              >
                <CardHeader className="flex flex-row items-center space-y-0 gap-3">
                  <Avatar>
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback>{post.author.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {/* Stop propagation to prevent triggering the card click */}
                      <div onClick={(e) => e.stopPropagation()}>
                        <Link href={`/profile/${post.author.handle}`} className="font-semibold hover:underline">
                          {post.author.name}
                        </Link>
                      </div>
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
                  {/* Stop propagation for dropdown menu */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(`/posts/${post.id}`)}>
                          Copy link
                        </DropdownMenuItem>
                        {/* Add delete option if user is author */}
                        {user && `@${user.username || user.id}` === post.author.handle && (
                          <DropdownMenuItem
                            onClick={() => handleDeletePost(post.id, post.author.handle)}
                            className="text-red-600 focus:text-red-600"
                          >
                            Delete post
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>Report post</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className={`${!hasAccess && isPremiumContent ? 'blur-md select-none' : ''}`}>
                    <p className="text-sm whitespace-pre-line">{post.content}</p>
                    {post.image && (
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg mt-2">
                        <Image src={post.image || "/placeholder.svg"} alt="Post image" fill className="object-cover" />
                      </div>
                    )}
                  </div>

                  {/* Premium Content Overlay */}
                  {isPremiumContent && !hasAccess && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                      <div className="text-center p-6">
                        <div className="mb-4">
                          <Badge className="mb-2">
                            <Star className="w-3 h-3 mr-1 text-yellow-500" />
                            Premium Content
                          </Badge>
                          <h3 className="text-lg font-semibold text-yellow-900">
                            Subscribe to {post.author.name}
                          </h3>
                          <p className="text-sm text-yellow-700 mt-1">
                            Get access to all premium content
                          </p>
                        </div>
                        
                        <div className="flex gap-2 justify-center">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCreator(post.creatorId || null);
                              setShowSubscribeDialog(true);
                            }}
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                          >
                            Subscribe Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter onClick={(e) => e.stopPropagation()}> {/* Stop propagation for all footer actions */}
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`hover:text-red-500 ${post.liked ? 'text-red-500' : ''}`}
                      onClick={(e) => handleLike(e, post.id, post.likes, post.liked)}
                    >
                      <Heart 
                        className={post.liked ? "w-4 h-4 fill-red-500 text-red-500" : "w-4 h-4"} 
                      />
                      <span className="ml-2 text-xs">{post.likes}</span>
                    </Button>
                    {/* Stop propagation for other buttons too */}
                    <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                      <MessageCircle className="w-4 h-4" />
                      <span className="ml-2 text-xs">{post.comments}</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                      <Share className="w-4 h-4" />
                      <span className="ml-2 text-xs">{post.shares}</span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );

            return (
              <div
                key={getUniqueKey(post, index)}
                ref={index === posts.length - 1 ? lastPostElementRef : undefined}
              >
                {postContent}
              </div>
            );
          })}
          
          {/* Bottom loading spinner */}
          {loading && (
            <div className="py-4 flex items-center justify-center">
              <Spinner />
            </div>
          )}
        </>
      )}
      {/* Add SubscriptionDialog at the bottom of the component */}
      <SubscriptionDialog
        open={showSubscribeDialog}
        onOpenChange={setShowSubscribeDialog}
        type={subscriptionType}
        creatorId={selectedCreator}
      />
    </div>
  )
}