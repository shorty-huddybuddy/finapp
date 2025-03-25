'use client'

import { useEffect, useState, useRef } from 'react'
import { useUserPermissions, useSubscriptionStatus } from '@/lib/swr/usePermissions'
import { useAuthStore } from '@/hooks/store/auth'
import { useSocialStore } from '@/hooks/store/social'
import { Spinner } from '@/components/ui/spinner'
import { usePosts } from '@/lib/swr/usePosts'
import { useAuth } from '@clerk/nextjs'

interface StoreProviderProps {
  children: React.ReactNode
}

export function StoreProvider({ children }: StoreProviderProps) {
  const { isSignedIn } = useAuth();
  const [initialized, setInitialized] = useState(false);
  const dataFetchedRef = useRef(false);
  
  // Reduce API calls by skipping data fetch if not signed in
  const skipFetch = !isSignedIn;
  
  // Only fetch data if not in cache
  const skipPermissionsFetch = !isSignedIn || !!useAuthStore.getState().permissions;
  const skipSubscriptionsFetch = !isSignedIn || !!useAuthStore.getState().subscriptions;
  
  // Use skip conditions to prevent unnecessary fetches
  const { permissions, isLoadingPermissions, refreshPermissions } = useUserPermissions(skipPermissionsFetch);
  const { subscriptions, isLoadingSubscriptions, refreshSubscriptions } = useSubscriptionStatus(skipSubscriptionsFetch);

  // Skip posts fetch on post detail pages
  const isPostDetail = window.location.pathname.includes('/social/post/');
  const { mutate } = usePosts(10, isPostDetail);
  
  // Get setter functions from stores
  const { setPermissions } = useAuthStore();
  const { setSubscriptions } = useAuthStore();
  
  // Sync SWR data to Zustand stores - only when data changes
  useEffect(() => {
    if (permissions) {
      setPermissions(permissions);
    }
  }, [permissions, setPermissions]);
  
  useEffect(() => {
    if (subscriptions) {
      setSubscriptions(subscriptions);
    }
  }, [subscriptions, setSubscriptions]);
  
  // Initial data loading - do it once
  useEffect(() => {
    if (isSignedIn && !dataFetchedRef.current) {
      console.log('Starting coordinated data fetch');
      dataFetchedRef.current = true;
      
      // Fetch in parallel with Promise.all
      Promise.all([
        refreshPermissions(),
        refreshSubscriptions(),
        mutate()
      ]).then(() => {
        console.log('All initial data loaded');
        setInitialized(true);
      }).catch(error => {
        console.error('Error loading initial data:', error);
        setInitialized(true); // Continue anyway
      });
    } else if (!isSignedIn && !initialized) {
      // No auth, so just mark as initialized
      setInitialized(true);
    }
  }, [isSignedIn, refreshPermissions, refreshSubscriptions, mutate, initialized]);
  
  // Ensure we mark as initialized after a timeout as fallback
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!initialized) {
        console.log('Forcing initialization after timeout');
        setInitialized(true);
      }
    }, 2000); // Reduced timeout to 2 seconds
    
    return () => clearTimeout(timer);
  }, [initialized]);

  // Add cache cleanup on signout
  useEffect(() => {
    if (!isSignedIn) {
      localStorage.removeItem('posts-cache');
    }
  }, [isSignedIn]);
  
  // Show loading state during initialization
  if (!initialized) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center">
        <Spinner className="mb-4" />
        <p className="text-gray-500">Loading application...</p>
      </div>
    );
  }
  
  return <>{children}</>;
}
