import { useUser, useAuth } from "@clerk/nextjs"
import { useState, useEffect } from "react"
import { API_URL } from '@/lib/config'

interface UserPermissions {
  isPremium: boolean
  isCreator: boolean
  subscriptionTier?: string
}

interface SubscriptionStatus {
  platformSubscription?: {
    status: string;
    type: string;
  };
  creatorSubscriptions?: Array<{
    status: string;
    creatorId: string;
  }>;
}

export function useExtendedUser() {  
  const { user } = useUser()
  const { getToken } = useAuth()
  const [permissions, setPermissions] = useState<UserPermissions>({
    isPremium: false,
    isCreator: true  // Default to true since all users are creators
  })
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({})

  useEffect(() => {
    const fetchUserPermissions = async () => {
      if (!user) return
      try {
        const token = await getToken()
        console.log(token);
        const response = await fetch(`${API_URL}/api/users/permissions`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setPermissions(data)
        }
      } catch (error) {
        console.error('Error fetching user permissions:', error)
      }
    }

    const fetchSubscriptionStatus = async () => {
      if (!user) return
      try {
        const token = await getToken()
        const response = await fetch(`${API_URL}/api/subscriptions/status`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setSubscriptionStatus(data)
        }
      } catch (error) {
        console.error('Error fetching subscription status:', error)
      }
    }

    fetchUserPermissions()
    fetchSubscriptionStatus()
  }, [user, getToken])

  return {
    user,
    isPremium: subscriptionStatus?.platformSubscription?.status === 'active',
    subscriptions: subscriptionStatus?.creatorSubscriptions || [],
    isLoaded: !!user
  }
}
