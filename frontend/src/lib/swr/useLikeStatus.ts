import useSWR from 'swr';
import { useAuth } from '@clerk/nextjs';
import { API_URL } from '@/lib/config';

// Define types
interface LikeStatusResponse {
  postId: string;
  liked: boolean;
}

// Function to batch fetch like statuses for multiple posts
export function useLikeStatuses(postIds: string[]) {
  const { getToken } = useAuth();
  
  // Create a stable key based on sorted postIds
  const key = postIds.length > 0 
    ? ['likeStatuses', [...postIds].sort().join(',')]
    : null;
  
  const { data, error, mutate } = useSWR(
    key,
    async ([_, postIdsString]) => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      
      // Use the batch endpoint instead of individual requests
      const response = await fetch(
        `${API_URL}/api/social/posts/batch/like-status`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postIdsString.split(','))
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch like statuses');
      }
      
      const { results } = await response.json();
      return results;
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute cache
    }
  );
  
  const updateLikeStatus = (postId: string, liked: boolean) => {
    // Optimistically update cache
    if (data) {
      mutate(
        {
          ...data,
          [postId]: liked,
        },
        false // Don't revalidate immediately
      );
    }
  };
  
  return {
    likeStatuses: data || {},
    isLoadingLikeStatus: !error && !data,
    isErrorLikeStatus: error,
    updateLikeStatus,
    refreshLikeStatuses: mutate,
  };
}
