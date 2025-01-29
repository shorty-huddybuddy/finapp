'use client'

import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Plus, Trash2, DollarSign, TrendingUp, TrendingDown, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useUser } from '@clerk/nextjs'

type WatchlistItem = {
  user_id: string
  ticker: string
  type: 'stock' | 'crypto'
  buy_price: number
  quantity: number
  timestamp: string
  id: string
  current_price: number
  pnl: number
}


type WatchlistData = {
  watchlist: WatchlistItem[]
  total_portfolio_value: number
  total_pnl: number
  holdings_distribution: Record<string, number>
}


export default function Dashboard() {
  const [watchlistData, setWatchlistData] = useState<WatchlistData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newTicker, setNewTicker] = useState('')
  const [newType, setNewType] = useState<'stock' | 'crypto'>('stock')
  const [newBuyPrice, setNewBuyPrice] = useState('')
  const [newQuantity, setNewQuantity] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<WatchlistItem | null>(null)
  const { user, isLoaded } = useUser()
  const [userId, setUserId] = useState<string | null>(null)

  const EmptyStateMessage = () => (
    <div className="text-center py-10">
      <div className="text-6xl mb-4">📈</div>
      <h3 className="text-xl font-semibold text-blue-800 mb-2">Your Watchlist is Empty</h3>
      <p className="text-blue-600 mb-4">Click the + button above to start tracking your investments</p>
    </div>
  )

  const EmptyPortfolioCard = () => (
    <div className="text-center py-4">
      <p className="text-lg text-blue-600">Add your first investment to see portfolio stats</p>
    </div>
  )

  // Handle user authentication state
  useEffect(() => {
    if (isLoaded && user) {
      setUserId(user.id)
    }
  }, [isLoaded, user])

  // Only fetch data when userId is available
  useEffect(() => {
    if (userId) {
      fetchWatchlistData()
    }
  }, [userId])

  const fetchWatchlistData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`http://127.0.0.1:8080/api/watchlist?user_id=${userId}`)
      if (!response.ok) throw new Error('Failed to fetch watchlist data')
      const data = await response.json()
      setWatchlistData({
        watchlist: data.watchlist || [],
        total_portfolio_value: data.total_portfolio_value || 0,
        total_pnl: data.total_pnl || 0,
        holdings_distribution: data.holdings_distribution || {}
      })
    } catch (error) {
      console.error('Error fetching watchlist data:', error)
      toast.error('Failed to fetch watchlist data. Please try again.')
      setWatchlistData({
        watchlist: [],
        total_portfolio_value: 0,
        total_pnl: 0,
        holdings_distribution: {}
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addToWatchlist = async () => {
    if (!userId) return
    try {
      const response = await fetch('http://127.0.0.1:8080/api/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          ticker: newTicker,
          type: newType,
          buy_price: parseFloat(newBuyPrice),
          quantity: parseInt(newQuantity),
        }),
      })
      if (!response.ok) throw new Error('Failed to add item to watchlist')
      const data = await response.json()
      toast.success(data.message)
      await fetchWatchlistData()
      setIsAddDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error adding to watchlist:', error)
      toast.error('Failed to add item to watchlist. Please try again.')
    }
  }

  const updateWatchlistItem = async () => {
    if (!editingItem || !userId) return
    try {
      const response = await fetch(`http://127.0.0.1:8080/api/watchlist?item_id=${editingItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          ticker: editingItem.ticker,
          type: editingItem.type,
          buy_price: editingItem.buy_price,
          quantity: editingItem.quantity,
        }),
      })
      if (!response.ok) throw new Error('Failed to update watchlist item')
      const data = await response.json()
      toast.success(data.message)
      await fetchWatchlistData()
      setIsEditDialogOpen(false)
      setEditingItem(null)
    } catch (error) {
      console.error('Error updating watchlist item:', error)
      toast.error('Failed to update watchlist item. Please try again.')
    }
  }

  const removeFromWatchlist = async (itemId: string) => {
    if (!userId) return
    try {
      const response = await fetch(`http://127.0.0.1:8080/api/watchlist?user_id=${userId}&item_id=${itemId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to remove item from watchlist')
      const data = await response.json()
      toast.success(data.message)
      await fetchWatchlistData()
    } catch (error) {
      console.error('Error removing from watchlist:', error)
      toast.error('Failed to remove item from watchlist. Please try again.')
    }
  }

  const resetForm = () => {
    setNewTicker('')
    setNewType('stock')
    setNewBuyPrice('')
    setNewQuantity('')
  }

  const COLORS = ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE']

  // Handle loading and authentication states
  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Please Sign In</h2>
        <p className="text-blue-600">You need to be authenticated to view this page.</p>
      </div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white text-blue-900 p-8">
      <Toaster position="top-right" />
      {!isLoaded ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : !user ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Please Sign In</h2>
            <p className="text-blue-600">You need to be authenticated to view this page.</p>
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">🚀 Crypto & Stock Watchlist</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card className="bg-white border-blue-200 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-800">
                  <DollarSign className="mr-2" />
                  Portfolio Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {watchlistData && watchlistData.watchlist && watchlistData.watchlist.length > 0 ? (
                  <>
                    <p className="text-2xl font-bold mb-2 text-blue-900">
                      ${watchlistData.total_portfolio_value.toLocaleString()}
                    </p>
                    <p className={`text-lg ${watchlistData.total_pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {watchlistData.total_pnl >= 0 ? <TrendingUp className="inline mr-2" /> : <TrendingDown className="inline mr-2" />}
                      ${watchlistData.total_pnl.toLocaleString()}
                    </p>
                  </>
                ) : (
                  <EmptyPortfolioCard />
                )}
              </CardContent>
            </Card>

            <Card className="bg-white border-blue-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-blue-800">Holdings Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                {watchlistData && watchlistData.holdings_distribution && 
                Object.keys(watchlistData.holdings_distribution).length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(watchlistData.holdings_distribution).map(([name, value]) => ({ name, value }))}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {Object.entries(watchlistData.holdings_distribution).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyPortfolioCard />
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white border-blue-200 shadow-md mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-blue-800">
                <span>Your Watchlist</span>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="text-blue-600 border-blue-300 hover:bg-blue-50">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white text-blue-900">
                    <DialogHeader>
                      <DialogTitle className="text-blue-800">Add to Watchlist</DialogTitle>
                      <DialogDescription className="text-blue-600">
                        Enter the details of the stock or cryptocurrency you want to add to your watchlist.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Input
                        value={newTicker}
                        onChange={(e) => setNewTicker(e.target.value)}
                        placeholder="Ticker (e.g., AAPL, BTC)"
                        className="border-blue-300 focus:border-blue-500"
                      />
                      <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value as 'stock' | 'crypto')}
                        className="bg-white text-blue-900 rounded-md p-2 border border-blue-300 focus:border-blue-500"
                      >
                        <option value="stock">Stock</option>
                        <option value="crypto">Crypto</option>
                      </select>
                      <Input
                        value={newBuyPrice}
                        onChange={(e) => setNewBuyPrice(e.target.value)}
                        placeholder="Buy Price"
                        type="number"
                        className="border-blue-300 focus:border-blue-500"
                      />
                      <Input
                        value={newQuantity}
                        onChange={(e) => setNewQuantity(e.target.value)}
                        placeholder="Quantity"
                        type="number"
                        className="border-blue-300 focus:border-blue-500"
                      />
                      <Button onClick={addToWatchlist} className="bg-blue-600 hover:bg-blue-700 text-white">Add to Watchlist</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {watchlistData && watchlistData.watchlist && watchlistData.watchlist.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-blue-200">
                        <th className="text-left p-2 text-blue-700">Ticker</th>
                        <th className="text-left p-2 text-blue-700">Type</th>
                        <th className="text-right p-2 text-blue-700">Buy Price</th>
                        <th className="text-right p-2 text-blue-700">Current Price</th>
                        <th className="text-right p-2 text-blue-700">Quantity</th>
                        <th className="text-right p-2 text-blue-700">P&L</th>
                        <th className="text-center p-2 text-blue-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {watchlistData?.watchlist.map((item) => (
                          <motion.tr
                            key={item.id}
                            className="border-b border-blue-100"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <td className="p-2 text-blue-800">{item.ticker}</td>
                            <td className="p-2 text-blue-800">{item.type === 'stock' ? '📈' : '💰'} {item.type}</td>
                            <td className="text-right p-2 text-blue-800">${item.buy_price.toFixed(2)}</td>
                            <td className="text-right p-2 text-blue-800">${item.current_price.toFixed(2)}</td>
                            <td className="text-right p-2 text-blue-800">{item.quantity}</td>
                            <td className={`text-right p-2 ${item.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              ${item.pnl.toFixed(2)}
                            </td>
                            <td className="text-center p-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingItem(item)
                                  setIsEditDialogOpen(true)
                                }}
                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 mr-2"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFromWatchlist(item.id)}
                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyStateMessage />
              )}
            </CardContent>
          </Card>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="bg-white text-blue-900">
              <DialogHeader>
                <DialogTitle className="text-blue-800">Edit Watchlist Item</DialogTitle>
                <DialogDescription className="text-blue-600">
                  Update the details of your watchlist item.
                </DialogDescription>
              </DialogHeader>
              {editingItem && (
                <div className="grid gap-4 py-4">
                  <Input
                    value={editingItem.ticker}
                    onChange={(e) => setEditingItem({...editingItem, ticker: e.target.value})}
                    placeholder="Ticker"
                    className="border-blue-300 focus:border-blue-500"
                  />
                  <select
                    value={editingItem.type}
                    onChange={(e) => setEditingItem({...editingItem, type: e.target.value as 'stock' | 'crypto'})}
                    className="bg-white text-blue-900 rounded-md p-2 border border-blue-300 focus:border-blue-500"
                  />
                  <Input
                    value={editingItem.buy_price}
                    onChange={(e) => setEditingItem({...editingItem, buy_price: parseFloat(e.target.value)})}
                    placeholder="Buy Price"
                    type="number"
                    className="border-blue-300 focus:border-blue-500"
                  />
                  <Input
                    value={editingItem.quantity}
                    onChange={(e) => setEditingItem({...editingItem, quantity: parseInt(e.target.value)})}
                    placeholder="Quantity"
                    type="number"
                    className="border-blue-300 focus:border-blue-500"
                  />
                  <Button onClick={updateWatchlistItem} className="bg-blue-600 hover:bg-blue-700 text-white">Update Item</Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}