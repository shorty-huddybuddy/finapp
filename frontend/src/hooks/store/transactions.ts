import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Transaction {
  date: string
  amount: number
  category: string
  description: string
}

interface TransactionStore {
  transactions: Transaction[]
  setTransactions: (transactions: Transaction[]) => void
  addTransaction: (transaction: Transaction) => void
  removeTransaction: (index: number) => void
  clearTransactions: () => void
}

export const useTransactionStore = create<TransactionStore>()(
  persist(  // Persists state to localStorage
    (set) => ({
      transactions: [],
      setTransactions: (transactions) => set({ transactions }),
      addTransaction: (transaction) => 
        set((state) => ({ 
          transactions: [...state.transactions, transaction] 
        })),
      removeTransaction: (index) =>
        set((state) => ({
          transactions: state.transactions.filter((_, i) => i !== index)
        })),
      clearTransactions: () => set({ transactions: [] })
    }),
    { name: 'transaction-storage' }
  )
)
