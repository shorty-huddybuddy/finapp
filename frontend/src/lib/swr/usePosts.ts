import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { useAuth } from '@clerk/nextjs';
import { useMemo, useState, useCallback, useRef, useEffect } from 'react';

interface Author {
  name: string;
  handle: string;
  avatar: string;
  isPremium: boolean;
}

export interface Post {
  id: string;
  author: Author;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  isPremiumPost: boolean;
  timestamp: string;
  liked: boolean;
  requiredSubscriptionTier?: string;
  minimumTierRequired?: string;
  hasAccess: boolean;
  creatorId?: string;
}

interface PostsResponse {
  posts: Post[];
  nextPageCursor?: string;
}

export function usePosts(pageSize = 10) {
  const { getToken } = useAuth();
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const nextPageRef = useRef<string | null>(null);
  
  // Define the key function for SWRInfinite
  const getKey = useCallback((pageIndex: number, previousPageData: PostsResponse | null) => {
    // First page, no cursor
    if (pageIndex === 0) return ['posts', null, pageSize, false];
    
    // If we got an explicit "no more pages" signal (no nextPageCursor)
    if (previousPageData && !previousPageData.nextPageCursor) {
      console.log("No more pages detected from API response");
      setHasReachedEnd(true);
      return null;
    }
    
    // If we have data but no posts, also end
    if (previousPageData && previousPageData.posts && previousPageData.posts.length === 0) {
      console.log("Empty page detected, ending pagination");
      setHasReachedEnd(true);
      return null;
    }
    
    // Get next cursor and continue
    const cursor = previousPageData?.nextPageCursor;
    console.log(`Getting page ${pageIndex} with cursor: ${cursor}`);
    nextPageRef.current = cursor || null;
    return ['posts', cursor, pageSize, false];
  }, [pageSize]);
  
  // Fetch function for SWRInfinite
  const fetchPosts = useCallback(async ([_, cursor, limit]: [string, string | null, number, boolean]) => {
    const token = await getToken();
    
    const url = new URL('http://localhost:8080/api/social/posts');
    if (cursor) url.searchParams.append('lastId', cursor);
    url.searchParams.append('limit', String(limit));
    
    console.log(`Fetching posts with URL: ${url.toString()}`);
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch posts');
    const data = await response.json();
    console.log(`Received ${data.posts?.length || 0} posts, nextCursor: ${data.nextPageCursor || 'none'}`);
    return data;
  }, [getToken]);
  
  // Use SWRInfinite with more aggressive settings
  const {
    data: pagesData,
    error,
    size,
    setSize,
    mutate,
    isValidating,
  } = useSWRInfinite(getKey, fetchPosts, {
    revalidateFirstPage: false,
    revalidateOnFocus: false,
    dedupingInterval: 30000, // 30 seconds
    errorRetryInterval: 5000, // 5 seconds
    persistSize: true, // Keep size state when component unmounts
  });
  
  // Prefetch next page
  const prefetchNextPage = useCallback(async () => {
    if (!nextPageRef.current || hasReachedEnd) return;
    
    try {
      // Use the cached fetcher function
      await fetchPosts(['posts', nextPageRef.current, pageSize, true]);
    } catch (err) {
      console.error('Error prefetching next page:', err);
    }
  }, [fetchPosts, pageSize, hasReachedEnd]);
  
  // Memoize the flattened posts
  const posts = useMemo(() => {
    if (!pagesData) return [];
    
    // Track seen post IDs to avoid duplicates
    const seenIds = new Set<string>();
    const allPosts: Post[] = [];
    
    pagesData.forEach(pageData => {
      if (!pageData?.posts) return;
      
    pageData.posts.forEach((post: Post) => {
      if (!seenIds.has(post.id)) {
        seenIds.add(post.id);
        allPosts.push(post);
      }
    });
    });
    
    return allPosts;
  }, [pagesData]);
  
  // Fetch next page function
  const fetchNextPage = useCallback(() => {
    if (!hasReachedEnd && !isValidating) {
      setSize(size + 1);
    }
  }, [hasReachedEnd, isValidating, setSize, size]);
  
  // Batch update post data (e.g., like status)
  const updatePost = useCallback((postId: string, data: Partial<Post>) => {
    if (!pagesData) return;
    
    // Create new pages data with updated post
    const newPagesData = pagesData.map(pageData => {
      if (!pageData?.posts) return pageData;
      
    return {
      ...pageData,
      posts: pageData.posts.map((post: Post) => 
        post.id === postId ? { ...post, ...data } : post
      )
    } as PostsResponse;
    });
    
    // Update cache without revalidation
    mutate(newPagesData, false);
  }, [pagesData, mutate]);
  
  // Improved lastItemRef to handle edge cases
  const lastItemRef = useCallback((node: HTMLElement | null) => {
    if (!node || hasReachedEnd || isValidating) return;
    
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          console.log('Last item visible, loading more posts...');
          // Small timeout to prevent too many quick requests
          setTimeout(() => {
            if (!isValidating && !hasReachedEnd) {
              setSize(prevSize => prevSize + 1);
            }
          }, 100);
        }
      },
      { 
        rootMargin: '300px', // Load earlier - 300px before reaching the end
        threshold: 0.1
      }
    );
    
    observer.observe(node);
    return () => observer.disconnect();
  }, [isValidating, hasReachedEnd, setSize]);
  
  // Log when we reach the end
  useEffect(() => {
    if (hasReachedEnd) {
      console.log("Reached end of post feed");
    }
  }, [hasReachedEnd]);
  
  // Debug logging for pages
  useEffect(() => {
    if (pagesData) {
      console.log(`Loaded ${size} pages with total ${posts.length} posts`);
    }
  }, [size, pagesData, posts]);
  
  return {
    posts,
    error,
    isLoading: !error && !pagesData,
    isLoadingMore: !error && !!pagesData && isValidating,
    hasMore: !hasReachedEnd,
    fetchNextPage: useCallback(() => {
      if (!hasReachedEnd && !isValidating) {
        setSize(prevSize => prevSize + 1);
      }
    }, [hasReachedEnd, isValidating, setSize]),
    updatePost,
    lastItemRef,
  };
}
