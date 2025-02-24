import { create } from "zustand"

interface Transaction {
  date: string
  amount: number
  category: string
  description: string
}

interface TransactionStore {
  transactions: Transaction[]
  setTransactions: (transactions: Transaction[]) => void
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  setTransactions: (transactions) => set({ transactions }),
}))

