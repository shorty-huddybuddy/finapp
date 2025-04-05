import useSWRInfinite from 'swr/infinite';
import { useAuth } from '@clerk/nextjs';
import { useCallback, useEffect } from 'react';
import { Post, PostsResponse } from '@/types/social';
import { useSocialStore } from '@/hooks/store/social';
import { API_URL } from '@/lib/config';

const CACHE_KEY = 'posts-cache';
const CACHE_EXPIRY = 2 * 60 * 1000; // 2 minutes

// Add cache helpers
const getCache = () => {
  try {
    const cache = localStorage.getItem(CACHE_KEY);
    if (!cache) return null;
    
    const { data, timestamp } = JSON.parse(cache);
    if (Date.now() - timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return data;
  } catch (e) {
    return null;
  }
};

const setCache = (data: PostsResponse) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (e) {
    console.error('Failed to set cache:', e);
  }
};

// In-memory cache for first page of posts
let postsCache: { data: PostsResponse | null, timestamp: number } | null = null;

export function usePosts(pageSize = 10, skip = false) {
  const { getToken } = useAuth();
  const { 
    setPosts, 
    setLoading, 
    setError, 
    setHasMore,
    addPosts 
  } = useSocialStore();
  
  // Define key generator for SWRInfinite
  const getKey = useCallback((pageIndex: number, previousPageData: PostsResponse | null) => {
    // If skip is true, return null to skip fetching
    if (skip) return null;
    
    // First page, no cursor
    if (pageIndex === 0) return ['posts', '', pageSize];
    
    // If we got an explicit "no more pages" signal
    if (previousPageData && !previousPageData.nextPageCursor) {
      setHasMore(false);
      return null;
    }
    
    // Get next cursor and continue
    const cursor = previousPageData?.nextPageCursor;
    return ['posts', cursor || '', pageSize];
  }, [pageSize, setHasMore, skip]);
  
  // Fetch function for SWRInfinite with caching for first page
  const fetchPosts = useCallback(async ([_, cursor, limit]: [string, string | null, number]) => {
    try {
      // Only use cache for first page and if no cursor
      if (!cursor) {
        const cachedData = getCache();
        if (cachedData) {
          console.log('Using cached post data');
          return cachedData;
        }
      }
      
      const token = await getToken();
      
      const url = new URL(`${API_URL}/api/social/posts`);
      if (cursor) url.searchParams.append('lastId', cursor);
      url.searchParams.append('limit', String(limit));
      
      console.log(`Fetching posts: ${url.toString()}`);
      
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
        cache: 'no-store' // Disable browser cache
      });
      
      if (!response.ok) throw new Error('Failed to fetch posts');
      
      const data = await response.json() as PostsResponse;
      
      // Cache only first page
      if (!cursor) {
        setCache(data);
      }
      
      return data;
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err as Error);
      throw err;
    }
  }, [getToken, setError]);
  
  // SWR Infinite hook with proper types
  const { 
    data: pagesData,
    error,
    size,
    setSize,
    mutate,
    isValidating
  } = useSWRInfinite<PostsResponse>(
    getKey,
    fetchPosts,
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
      dedupingInterval: 30000, // 30 seconds
      errorRetryInterval: 5000,
      persistSize: true,
      revalidateOnMount: !postsCache // Only revalidate on mount if no cache
    }
  );

  // Update loading state
  useEffect(() => {
    setLoading(isValidating && !pagesData?.length);
  }, [isValidating, pagesData, setLoading]);

  // Update store when data changes
  useEffect(() => {
    if (pagesData?.length) {
      console.log(`Updating store with ${pagesData.length} pages of posts`);
      
      // For initial page load, replace all posts
      if (pagesData.length === 1) {
        setPosts(pagesData[0].posts || []);
      } else {
        // For subsequent pages, append new posts
        const latestPage = pagesData[pagesData.length - 1];
        if (latestPage?.posts?.length) {
          addPosts(latestPage.posts);
        }
      }
      
      // Update has more flag based on last page
      const lastPage = pagesData[pagesData.length - 1];
      setHasMore(!!lastPage?.nextPageCursor);
    }
  }, [pagesData, setPosts, addPosts, setHasMore]);

  // Clear cache when component unmounts or on error
  useEffect(() => {
    return () => {
      localStorage.removeItem(CACHE_KEY);
    };
  }, []);

  useEffect(() => {
    if (error) {
      localStorage.removeItem(CACHE_KEY);
    }
  }, [error]);
  
  // Return a simpler API for external components
  return {
    fetchNextPage: useCallback(() => {
      if (!isValidating && !skip) {
        setSize(size + 1);
      }
    }, [isValidating, skip, setSize, size]),
    isLoadingMore: isValidating && size > 0,
    hasMore: pagesData?.length ? !!pagesData[pagesData.length - 1]?.nextPageCursor : true,
    mutate,
    lastItemRef: useCallback((node: HTMLElement | null) => {
      if (!node || skip) return;
      
      const observer = new IntersectionObserver(entries => {
        if (entries[0]?.isIntersecting && !isValidating && pagesData?.length && pagesData[pagesData.length - 1]?.nextPageCursor) {
          console.log('Last item visible, loading more...');
          setSize(size + 1);
        }
      }, { rootMargin: '200px' });
      
      observer.observe(node);
      return () => observer.disconnect();
    }, [isValidating, pagesData, setSize, size, skip])
  };
}

// Invalidate posts cache
export function invalidatePostsCache() {
  postsCache = null;
}

// Add function to manually clear cache
export function clearPostsCache() {
  localStorage.removeItem(CACHE_KEY);
}

export type { Post } from '@/types/social';

