import { useUser, useAuth } from "@clerk/nextjs"
import { useState, useEffect } from "react"

interface UserPermissions {
  isPremium: boolean
  isCreator: boolean
  subscriptionTier?: string
}

export function useExtendedUser() {  
  const { user } = useUser()
  const { getToken } = useAuth()
  const [permissions, setPermissions] = useState<UserPermissions>({
    isPremium: false,
    isCreator: true  // Default to true since all users are creators
  })

  useEffect(() => {
    const fetchUserPermissions = async () => {
      if (!user) return
      try {
        const token = await getToken()
        console.log(token);
        const response = await fetch('http://localhost:8080/api/users/permissions', {
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

    fetchUserPermissions()
  }, [user, getToken])

  return {
    user,
    isPremium: permissions.isPremium,
    isCreator: true,  // Always true now
    subscriptionTier: permissions.subscriptionTier,
    isLoaded: !!user
  }
}
