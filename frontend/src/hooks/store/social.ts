import { create } from 'zustand'
import { Post } from '@/types/social'

interface SocialStore {
  posts: Post[]
  currentPost: Post | null
  isPremiumView: boolean
  isLoading: boolean
  error: Error | null
  hasMore: boolean
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
}

export const useSocialStore = create<SocialStore>((set) => ({
  posts: [],
  currentPost: null,
  isPremiumView: false,
  isLoading: false,
  error: null,
  hasMore: true,
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
  setCurrentPost: (post) => set({ currentPost: post }),
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
  removePost: (postId) => set((state) => ({
    posts: state.posts.filter(p => p.id !== postId)
  })),
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
  }))
}))
