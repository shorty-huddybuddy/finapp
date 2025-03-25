import { create } from 'zustand'
import { Post } from '@/types/social'

interface SocialStore {
  posts: Post[]
  currentPost: Post | null
  isPremiumView: boolean
  isLoading: boolean
  error: Error | null
  hasMore: boolean
  postCache: Map<string, Post>; // Add post cache
  isTransitioning: boolean;
  setPosts: (posts: Post[]) => void
  setCurrentPost: (post: Post | null) => void
  setIsPremiumView: (isPremium: boolean) => void
  setLoading: (loading: boolean) => void
  setError: (error: Error | null) => void
  setHasMore: (hasMore: boolean) => void
  addPost: (post: Post) => void
  addPosts: (newPosts: Post[]) => void // New method to add multiple posts
  removePost: (postId: string) => void
  updatePost: (postId: string, data: Partial<Post>) => void
  updateCurrentPost: (data: Partial<Post>) => void
  addToCache: (post: Post) => void;
  getFromCache: (id: string) => Post | undefined;
  setIsTransitioning: (isTransitioning: boolean) => void;
}

export const useSocialStore = create<SocialStore>((set, get) => ({
  posts: [],
  currentPost: null,
  isPremiumView: false,
  isLoading: false,
  error: null,
  hasMore: true,
  postCache: new Map(),
  isTransitioning: false,
  setPosts: (posts) => set((state) => {
    // Create a Set of existing post IDs for quick lookup
    const existingIds = new Set(state.posts.map(p => p.id));
    
    // Filter out any new posts that already exist in our state
    const uniquePosts = posts.filter(p => !existingIds.has(p.id));
    
    // Combine existing posts with new unique posts
    return { 
      posts: [...state.posts, ...uniquePosts] 
    };
  }),
  setCurrentPost: (post) => set(state => {
    if (post) {
      // Add to cache when setting current post
      state.postCache.set(post.id, post);
    }
    return { currentPost: post };
  }),
  setIsPremiumView: (isPremium) => set({ isPremiumView: isPremium }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setHasMore: (hasMore) => set({ hasMore }),
  addPost: (post) => set((state) => {
    // Check if post already exists by ID
    const exists = state.posts.some(p => p.id === post.id);
    if (exists) {
      // If exists, return current state without changes
      return state;
    }
    // Otherwise add the new post
    return { 
      posts: [post, ...state.posts] 
    };
  }),
  // New method to add multiple posts at once (for pagination)
  addPosts: (newPosts) => set((state) => {
    // Create a Set of existing post IDs
    const existingIds = new Set(state.posts.map(p => p.id));
    
    // Filter out duplicates
    const uniquePosts = newPosts.filter(post => !existingIds.has(post.id));
    
    // Only update if we have new unique posts
    if (uniquePosts.length === 0) {
      return state;
    }
    
    return {
      posts: [...state.posts, ...uniquePosts]
    };
  }),
  removePost: (postId: string) => set((state) => {
    // Start transition
    state.setIsTransitioning(true);

    // Remove from posts array with animation delay
    setTimeout(() => {
      set((state) => {
        const newPosts = state.posts.filter(p => p.id !== postId);
        const newCache = new Map(state.postCache);
        newCache.delete(postId);
        const newCurrentPost = state.currentPost?.id === postId ? null : state.currentPost;

        // Update localStorage cache
        try {
          const cacheKey = 'posts-cache';
          const cached = localStorage.getItem(cacheKey);
          if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (data.posts) {
              data.posts = data.posts.filter((p: Post) => p.id !== postId);
              localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp }));
            }
          }
        } catch (e) {
          console.error('Error updating cache:', e);
        }

        // End transition
        state.setIsTransitioning(false);

        return {
          posts: newPosts,
          currentPost: newCurrentPost,
          postCache: newCache,
        };
      });
    }, 300); // Match this with CSS transition duration

    return state;
  }),
  updatePost: (postId, data) => set((state) => ({
    posts: state.posts.map(post => 
      post.id === postId ? { ...post, ...data } : post
    ),
    currentPost: state.currentPost?.id === postId 
      ? { ...state.currentPost, ...data }
      : state.currentPost
  })),
  updateCurrentPost: (data) => set((state) => ({
    currentPost: state.currentPost 
      ? { ...state.currentPost, ...data }
      : null
  })),
  addToCache: (post) => set((state) => {
    const newCache = new Map(state.postCache);
    newCache.set(post.id, post);
    return { postCache: newCache };
  }),
  getFromCache: (id) => get().postCache.get(id),
  setIsTransitioning: (isTransitioning) => set({ isTransitioning }),
}))
