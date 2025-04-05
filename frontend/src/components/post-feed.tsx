"use client"
import { useState, useCallback, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Heart, MessageCircle, Share, MoreHorizontal, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth, useUser } from "@clerk/nextjs"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"  
import { useRouter } from 'next/navigation'
import { SubscriptionDialog } from "./subscription-dialog"
import { loadStripe } from "@stripe/stripe-js"
import { ImagePreview } from "@/components/image-preview"
import { usePosts, clearPostsCache, invalidatePostsCache } from "@/lib/swr/usePosts" 
import { Post } from "@/types/social"
import { useSocialStore } from "@/hooks/store/social" 
import { useAuthStore } from "@/hooks/store/auth" 
import { AnimatePresence, motion } from "framer-motion";
import { API_URL } from '@/lib/config'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const POSTS_PER_PAGE = 10

export function PostFeed() {
  // State variables
  const [showSubscribeDialog, setShowSubscribeDialog] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null);
  const [subscriptionType, setSubscriptionType] = useState<"creator" | "platform" | null>(null);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");

  // Add new loading state specifically for infinite scroll
  const [isInfiniteLoading, setIsInfiniteLoading] = useState(false);

  // Get data from Zustand store directly
  const { 
    posts,
    isLoading,
    error,
    hasMore,
    updatePost,
    removePost,
    setHasMore,
    addPost,
    setLoading,
    setPosts
  } = useSocialStore();
  
  const {
    permissions,
    subscriptions
  } = useAuthStore();

  // Get API utilities
  const { getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  
  // Use SWR posts hook for fetching with infinite scroll
  const { 
    fetchNextPage,
    isLoadingMore,
    mutate
  } = usePosts(POSTS_PER_PAGE);
  
  // Clear cache and refetch on mount
  useEffect(() => {
    clearPostsCache();
    mutate();
  }, [mutate]);

  // Fetch posts on mount if needed
  useEffect(() => {
    if (posts.length === 0 && !isLoading) {
      console.log('No posts in store, triggering fetch');
      mutate();
    }
  }, [posts.length, isLoading, mutate]);

  // Set up intersection observer for infinite scroll
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Define fetchMorePosts first
  const fetchMorePosts = useCallback(async () => {
    if (!hasMore || isLoading || isInfiniteLoading) return;
    
    try {
      setIsInfiniteLoading(true);
      await fetchNextPage();
    } finally {
      setIsInfiniteLoading(false);
    }
  }, [hasMore, isLoading, isInfiniteLoading, fetchNextPage]);

  // Now we can use fetchMorePosts in lastPostRef
  const lastPostRef = useCallback((node: HTMLElement | null) => {
    if (isLoading) return;
    
    // Disconnect previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    // Create new observer
    observerRef.current = new IntersectionObserver(entries => {
      // If the last item is visible and we have more posts to load
      if (entries[0]?.isIntersecting && hasMore && !isLoading) {
        console.log('Last post is visible, loading more...');
        fetchMorePosts();
      }
    }, { 
      rootMargin: '200px',  // Start loading before the element is visible
      threshold: 0.1        // Trigger when 10% of the element is visible
    });
    
    // Observe the last element
    if (node) {
      observerRef.current.observe(node);
    }
  }, [fetchMorePosts, hasMore, isLoading]);

  // The rest of the component remains unchanged
  const isPremium = permissions?.isPremium || false;
  
  const canViewPremiumContent = useCallback((post: Post) => {
    if (isPremium) return true;

    const isPremiumContent = post.isPremiumPost || post.author.isPremium;
    if (!isPremiumContent) return true;

    if (user && `@${user.username || user.id}` === post.author.handle) {
      return true;
    }

    if (subscriptions?.creatorSubscriptions && post.author.handle) {
      const creatorId = post.author.handle.replace('@', '');
      const hasCreatorSub = subscriptions.creatorSubscriptions.some(
        sub => sub.creatorId === creatorId && sub.status === 'active'
      );
      if (hasCreatorSub) return true;
    }

    return post.hasAccess === true;
  }, [user, isPremium, subscriptions]);

  const handleLike = async (e: React.MouseEvent, postId: string, currentLikes: number, isCurrentlyLiked: boolean) => {
    e.stopPropagation();
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Please login to like posts');
        return;
      }

      updatePost(postId, { 
        liked: !isCurrentlyLiked,
        likes: isCurrentlyLiked ? currentLikes - 1 : currentLikes + 1 
      });

      const response = await fetch(`${API_URL}/api/social/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        updatePost(postId, { 
          liked: isCurrentlyLiked,
          likes: currentLikes
        });
        throw new Error('Failed to update like');
      }

    } catch (error) {
      console.error('Error updating like:', error);
      toast.error('Failed to update like');
      
      updatePost(postId, { 
        liked: isCurrentlyLiked,
        likes: currentLikes
      });
    }
  };

  const handleDeletePost = async (postId: string, authorHandle: string) => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Please login to delete posts');
        return;
      }

      const userHandle = `@${user?.username || user?.id}`;
      if (authorHandle !== userHandle) {
        toast.error('You can only delete your own posts');
        return;
      }

      // First remove from UI
      removePost(postId);

      // Then delete from backend
      const response = await fetch(`${API_URL}/api/social/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        // If deletion fails, refresh posts to restore state
        toast.error('Failed to delete post');
        clearPostsCache();
        mutate();
        return;
      }

      // On successful deletion:
      toast.success('Post deleted successfully');
      
      // Clear all caches
      clearPostsCache();
      invalidatePostsCache();
      localStorage.removeItem('posts-cache');

      // Ensure post is removed from all stores
      useSocialStore.getState().removePost(postId);
      
      // Force a fresh fetch if needed
      mutate();

    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
      mutate(); // Refresh to ensure consistent state
    }
  };

  const handleSubscribe = async (type: "creator" | "platform", creatorId?: string) => {
    if (!user) {
      toast.error("Please sign in to subscribe");
      return;
    }

    try {
      setShowSubscribeDialog(false);
      const token = await getToken();
      
      if (type === "creator" && !creatorId) {
        toast.error("Creator ID is required for creator subscriptions");
        return;
      }

      const response = await fetch(`${API_URL}/api/subscriptions/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type,
          creatorId,
          tierId: type === 'platform' ? 'premium-monthly' : 'creator-basic'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        throw error;
      }

    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to start subscription process');
    }
  };

  const handlePostClick = (e: React.MouseEvent, post: Post) => {
    const hasAccess = canViewPremiumContent(post);
    const isPremiumContent = post.isPremiumPost || post.author.isPremium;

    if (isPremiumContent && !hasAccess) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    router.push(`/social/post/${post.id}`);
  };

  const handleImageClick = (e: React.MouseEvent, imageUrl: string) => {
    e.stopPropagation();
    setCurrentImageUrl(imageUrl);
    setImagePreviewOpen(true);
  };

  // Add debug button for testing
  const refreshPosts = useCallback(() => {
    clearPostsCache();
    setLoading(true);
    setPosts([]); // Clear existing posts
    mutate()
      .then(() => {
        console.log('Refresh complete');
        setLoading(false);
      })
      .catch(error => {
        console.error('Refresh error', error);
        setLoading(false);
      });
  }, [mutate, setLoading, setPosts]);

  if (error) return <div className="p-4 text-center text-red-500">{error.message || 'Failed to load posts'}</div>;
  
  if (isLoading && posts.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {/* Debug refresh button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Posts</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshPosts} 
          disabled={isLoading}
        >
          {isLoading ? <Spinner className="h-4 w-4 mr-2" /> : null}
          Refresh Posts
        </Button>
      </div>

      <AnimatePresence mode="popLayout">
        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center text-muted-foreground"
          >
            No posts yet
          </motion.div>
        ) : (
          <div>
            {posts.map((post, index) => {
              const hasAccess = canViewPremiumContent(post);
              const isPremiumContent = post.isPremiumPost || post.author.isPremium;
              
              const postContent = (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    layout: { duration: 0.3 },
                    opacity: { duration: 0.2 }
                  }}
                >
                  <Card 
                    className="border-border hover:border-blue-500 transition-colors cursor-pointer relative" 
                    onClick={(e) => handlePostClick(e, post)}
                  >
                    <CardHeader className="flex flex-row items-center space-y-0 gap-3">
                      <Avatar>
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback>{post.author.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
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
                          <div 
                            className="relative aspect-video w-full overflow-hidden rounded-lg mt-2"
                            onClick={(e) => handleImageClick(e, post.image || "")}
                          >
                            <Image 
                              src={post.image || "/placeholder.svg"} 
                              alt="Post image" 
                              fill 
                              className="object-cover cursor-pointer hover:brightness-90 transition-all" 
                            />
                          </div>
                        )}
                      </div>

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
                                  const creatorId = post.author.handle.replace('@', '');
                                  handleSubscribe("creator", creatorId);
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
                    
                    <CardFooter onClick={(e) => e.stopPropagation()}>
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
                </motion.div>
              );

              // Fix: Use a unique key by combining post ID with index
              const uniqueKey = `${post.id}-${index}`;
              
              if (index === posts.length - 1) {
                return (
                  <div key={uniqueKey} ref={lastPostRef}>
                    {postContent}
                  </div>
                );
              }

              return <div key={uniqueKey}>{postContent}</div>;
            })}
            
            {/* Loading indicator with animation */}
            <AnimatePresence>
              {(hasMore || isInfiniteLoading) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="py-8 flex flex-col items-center justify-center gap-2"
                >
                  <Spinner className="w-8 h-8 text-blue-500" />
                  <p className="text-sm text-muted-foreground">
                    {isInfiniteLoading ? 'Loading more posts...' : 'Scroll for more'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>
      
      <SubscriptionDialog 
        open={showSubscribeDialog}
        onOpenChange={setShowSubscribeDialog}
        type={subscriptionType}
        creatorId={selectedCreator}
        onSubscribe={handleSubscribe}
        loading={isLoading}
      />
      
      <ImagePreview
        open={imagePreviewOpen}
        onOpenChange={setImagePreviewOpen}
        images={[currentImageUrl].filter(Boolean)}
        initialIndex={0}
      />
    </div>
  );
}