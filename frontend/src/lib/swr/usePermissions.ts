import useSWR from 'swr';
import { useAuth } from '@clerk/nextjs';
import { API_URL } from '@/lib/config';

// Define types for the permission data
export interface UserPermissions {
  isCreator: boolean;
  isPremium: boolean;
  creatorProfile?: {
    availableTiers: string[];
    bio: string;
    subscriberCount: number;
    totalEarnings: number;
  };
  subscriptionTier?: string;
}

// Define types for subscription data
export interface SubscriptionStatus {
  platformSubscription: PlatformSubscription | null;
  creatorSubscriptions: CreatorSubscription[];
}

export interface PlatformSubscription {
  id: string;
  status: string;
  tierID: string;
}

export interface CreatorSubscription {
  id: string;
  creatorId: string;
  status: string;
  tierID: string;
}

// In-memory cache to prevent redundant requests
let permissionsCache: { data: UserPermissions | null, timestamp: number } | null = null;
let subscriptionsCache: { data: SubscriptionStatus | null, timestamp: number } | null = null;

// Cache expiry time in milliseconds (5 minutes)
const CACHE_EXPIRY = 5 * 60 * 1000;

// Hook to get user permissions with caching
export function useUserPermissions(skip = false) {
  const { getToken } = useAuth();
  
  const { data, error, mutate } = useSWR(
    skip ? null : 'user-permissions',
    async () => {
      // Check in-memory cache first
      if (permissionsCache && Date.now() - permissionsCache.timestamp < CACHE_EXPIRY) {
        console.log('Using cached permissions data');
        return permissionsCache.data;
      }
      
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      
      console.log('Fetching permissions from API');
      const response = await fetch(`${API_URL}/api/users/permissions`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store' // Prevent browser caching
      });
      
      if (!response.ok) throw new Error('Failed to fetch permissions');
      
      const data = await response.json();
      
      // Update the cache
      permissionsCache = {
        data,
        timestamp: Date.now()
      };
      
      return data;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes cache
      refreshInterval: 600000,  // Refresh every 10 minutes
    }
  );

  return {
    permissions: data,
    isLoadingPermissions: skip ? false : !error && !data,
    isErrorPermissions: error,
    refreshPermissions: mutate,
  };
}

// Hook to get subscription status with caching
export function useSubscriptionStatus(skip = false) {
  const { getToken } = useAuth();
  
  const { data, error, mutate } = useSWR(
    skip ? null : 'subscription-status',
    async () => {
      // Check in-memory cache first
      if (subscriptionsCache && Date.now() - subscriptionsCache.timestamp < CACHE_EXPIRY) {
        console.log('Using cached subscription data');
        return subscriptionsCache.data;
      }
      
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      
      console.log('Fetching subscriptions from API');
      const response = await fetch(`${API_URL}/api/subscriptions/status`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store' // Prevent browser caching
      });
      
      if (!response.ok) throw new Error('Failed to fetch subscription status');
      
      const data = await response.json();
      
      // Update the cache
      subscriptionsCache = {
        data,
        timestamp: Date.now()
      };
      
      return data;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes
      errorRetryCount: 2,
      shouldRetryOnError: false,
      refreshInterval: 600000, // Refresh every 10 minutes
    }
  );

  return {
    subscriptions: data as SubscriptionStatus,
    isLoadingSubscriptions: skip ? false : !error && !data,
    isErrorSubscriptions: error,
    refreshSubscriptions: mutate,
  };
}

// Function to invalidate the permission cache
export function invalidatePermissionsCache() {
  permissionsCache = null;
}

// Function to invalidate the subscription cache
export function invalidateSubscriptionsCache() {
  subscriptionsCache = null;
}
