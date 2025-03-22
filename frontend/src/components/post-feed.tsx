"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Heart, MessageCircle, Share, MoreHorizontal, Star } from "lucide-react"
import Link from "next/link"
import { useState, useCallback, useMemo, useRef } from "react"
import Image from "next/image"
import { useAuth, useUser } from "@clerk/nextjs"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"  
import { useRouter } from 'next/navigation'
import { SubscriptionDialog } from "./subscription-dialog"
import { loadStripe } from "@stripe/stripe-js"
import { ImagePreview } from "@/components/image-preview"
import { useUserPermissions, useSubscriptionStatus } from "@/lib/swr/usePermissions"
import { usePosts, Post } from "@/lib/swr/usePosts"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const POSTS_PER_PAGE = 10

export function PostFeed() {
  // Use the new usePosts hook
  const { 
    posts, 
    error, 
    isLoading, 
    isLoadingMore, 
    hasMore, 
    fetchNextPage, 
    updatePost, 
    lastItemRef 
  } = usePosts(POSTS_PER_PAGE);
  
  const { getToken } = useAuth()
  const { user } = useUser()
  const router = useRouter();
  const { permissions, isLoadingPermissions } = useUserPermissions();
  const { subscriptions, isLoadingSubscriptions } = useSubscriptionStatus();
  const isPremium = permissions?.isPremium || false;
  
  // Add subscription dialog states
  const [showSubscribeDialog, setShowSubscribeDialog] = useState(false)
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null)
  const [subscriptionType, setSubscriptionType] = useState<"creator" | "platform" | null>(null)

  // Add image preview states
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false)
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("")

  const canViewPremiumContent = useCallback((post: Post) => {
    // If user has platform premium, they can see all content
    if (isPremium) return true;

    // Check if post is premium
    const isPremiumContent = post.isPremiumPost || post.author.isPremium;
    if (!isPremiumContent) return true;

    // Authors can always see their own posts
    if (user && `@${user.username || user.id}` === post.author.handle) {
      return true;
    }

    // Check if user has an active subscription to this creator
    if (subscriptions?.creatorSubscriptions && post.author.handle) {
      const creatorId = post.author.handle.replace('@', '');
      const hasCreatorSub = subscriptions.creatorSubscriptions.some(
        sub => sub.creatorId === creatorId && sub.status === 'active'
      );
      if (hasCreatorSub) return true;
    }

    // For premium content, check server-provided access flag
    return post.hasAccess === true;
  }, [user, isPremium, subscriptions]);

  const handleLike = async (e: React.MouseEvent, postId: string, currentLikes: number, isCurrentlyLiked: boolean) => {
    e.stopPropagation(); // Prevent navigation
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Please login to like posts');
        return;
      }

      // Optimistically update UI
      updatePost(postId, { 
        liked: !isCurrentlyLiked,
        likes: isCurrentlyLiked ? currentLikes - 1 : currentLikes + 1 
      });

      const response = await fetch(`http://localhost:8080/api/social/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        // Revert optimistic update if failed
        updatePost(postId, { 
          liked: isCurrentlyLiked,
          likes: currentLikes
        });
        throw new Error('Failed to update like');
      }

    } catch (error) {
      console.error('Error updating like:', error);
      toast.error('Failed to update like');
    }
  };

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

      // Remove post from display
      toast.success('Post deleted successfully');

    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
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
      
      // Add validation for creator subscriptions
      if (type === "creator" && !creatorId) {
        toast.error("Creator ID is required for creator subscriptions");
        return;
      }

      const response = await fetch('http://localhost:8080/api/subscriptions/create', {
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
      
      // Redirect to Stripe checkout
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

  const handleImageClick = (e: React.MouseEvent, imageUrl: string) => {
    e.stopPropagation()
    setCurrentImageUrl(imageUrl)
    setImagePreviewOpen(true)
  }

  // New function to handle intersection with bottom of list
  const bottomObserverRef = useRef<IntersectionObserver | null>(null);

  // Set up auto-loading when approaching bottom of feed
  const bottomRef = useCallback((node: HTMLDivElement | null) => {
    if (bottomObserverRef.current) bottomObserverRef.current.disconnect();
    
    bottomObserverRef.current = new IntersectionObserver(entries => {
      if (entries[0]?.isIntersecting && hasMore && !isLoadingMore) {
        fetchNextPage();
      }
    }, { threshold: 0.5 });

    if (node) bottomObserverRef.current.observe(node);
  }, [fetchNextPage, hasMore, isLoadingMore]);

  if (error) return <div className="p-4 text-center text-red-500">{error.message || 'Failed to load posts'}</div>
  
  // Show loading state while fetching permissions, subscriptions, or initial posts
  if (isLoading || isLoadingPermissions || isLoadingSubscriptions) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <Spinner />
      </div>
    );
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
                onClick={(e) => handlePostClick(e, post)}
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
                
                {/* ...existing CardContent... */}
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
                              // Use the handle without @ as the creatorId
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
            );

            // Use the lastItemRef for the last item to trigger prefetching
            if (index === posts.length - 1) {
              return (
                <div key={post.id} ref={lastItemRef}>
                  {postContent}
                </div>
              );
            }

            return <div key={post.id}>{postContent}</div>;
          })}
          
          {/* Auto-loading trigger element - replace the Load More button with this */}
          {hasMore && (
            <div ref={bottomRef} className="py-4 flex items-center justify-center">
              {isLoadingMore && <Spinner />}
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
        onSubscribe={handleSubscribe}
        loading={isLoadingMore}
      />
      
      {/* Add ImagePreview component */}
      <ImagePreview
        open={imagePreviewOpen}
        onOpenChange={setImagePreviewOpen}
        images={[currentImageUrl].filter(Boolean)} // Filter out empty strings
        initialIndex={0}
      />
    </div>
  )
}