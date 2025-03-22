import { create } from 'zustand'
import type { UserPermissions, SubscriptionStatus } from '@/lib/swr/usePermissions'

interface AuthStore {
  permissions: UserPermissions | null
  subscriptions: SubscriptionStatus | null
  setPermissions: (permissions: UserPermissions | null) => void
  setSubscriptions: (subscriptions: SubscriptionStatus | null) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  permissions: null,
  subscriptions: null,
  setPermissions: (permissions) => set({ permissions }),
  setSubscriptions: (subscriptions) => set({ subscriptions }),
  clearAuth: () => set({ permissions: null, subscriptions: null }),
}))
