import useSWR from 'swr';
import { useAuth } from '@clerk/nextjs';

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

// Fetcher function for user permissions
const fetchUserPermissions = async (url: string, token: string) => {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!res.ok) throw new Error('Failed to fetch user permissions');
  return res.json();
};

// Fetcher function for subscription status
const fetchSubscriptionStatus = async (url: string, token: string) => {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!res.ok) throw new Error('Failed to fetch subscription status');
  return res.json();
};

// Hook to get user permissions with caching
export function useUserPermissions() {
  const { getToken } = useAuth();
  
  const { data, error, mutate } = useSWR(
    'user-permissions',
    async () => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      const response = await fetch('http://localhost:8080/api/users/permissions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch permissions');
      return response.json();
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes
      errorRetryCount: 2,
      shouldRetryOnError: false,
    }
  );

  return {
    permissions: data,
    isLoadingPermissions: !error && !data,
    isErrorPermissions: error,
    refreshPermissions: mutate,
  };
}

// Hook to get subscription status with caching
export function useSubscriptionStatus() {
  const { getToken } = useAuth();
  
  const { data, error, mutate } = useSWR(
    'subscription-status',
    async () => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      const response = await fetch('http://localhost:8080/api/subscriptions/status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch subscription status');
      return response.json();
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes
      errorRetryCount: 2,
      shouldRetryOnError: false,
    }
  );

  return {
    subscriptions: data as SubscriptionStatus,
    isLoadingSubscriptions: !error && !data,
    isErrorSubscriptions: error,
    refreshSubscriptions: mutate,
  };
}
