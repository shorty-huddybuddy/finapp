'use client'

import React, { useEffect, useRef, useCallback } from "react"
import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Plus, Trash2, DollarSign, TrendingUp, TrendingDown, Edit2 } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Navbar2 } from '../../components/Navbar2'
import { Footer } from '../../components/Footer'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"
import { useUser } from '@clerk/nextjs'
import { debounce } from "lodash"
import axios from "axios"
import { Chatbot } from "../../components/Chatbot" 
import { API_URL, ML_API_URL } from '@/lib/config'

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

type SearchResult = {
  symbol: string
  description: string
}

type WatchlistData = {
  watchlist: WatchlistItem[]
  total_portfolio_value: number
  total_pnl: number
  holdings_distribution: Record<string, number>
  investment_by_type: Record<string, number>
  profit_by_asset: Record<string, {
    amount: number
    percentage_gain: number
    invested_amount: number
    current_value: number
  }>
}

type AssetType = 'stock' | 'crypto';

type AnalysisResponse = {
  asset_recommendations: Array<{
    ticker: string
    action: string
    reason: string
  }>
  risk_analysis: {
    current_risk_exposure: Record<string, string>
    adjustment_suggestions: Record<string, string>
  }
  general_trend_insights: Array<{
    sector: string
    recommendation: string
    reason: string
  }>
}

export default function Dashboard() {
  const [watchlistData, setWatchlistData] = useState<WatchlistData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newTicker, setNewTicker] = useState('')
  const [newType, setNewType] = useState<AssetType>('stock')
  const [newBuyPrice, setNewBuyPrice] = useState('')
  const [newQuantity, setNewQuantity] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<WatchlistItem | null>(null)
  const { user, isLoaded } = useUser()
  const [userId, setUserId] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null)
  const [currentPage, setCurrentPage] = useState(0);
  const [insightPage, setInsightPage] = useState(0);
  const [isTickerValid, setIsTickerValid] = useState(true);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = debounce(async (query: string) => {
    if (query.length < 1) {
      setSearchResults([])
      return
    }
    try {
      let response
      if (newType === 'stock') {
        response = await fetch(`${API_URL}/api/search?symbol=${query}&type=stock`)
      } else {
        response = await fetch(`${API_URL}/api/search?symbol=${query}&type=crypto`)
      }
      const data = await response.json()
      setSearchResults(data)
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Failed to search symbols')
    }
  }, 300)

  const fetchWatchlistData = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/api/watchlist?user_id=${userId}`)
      if (!response.ok) throw new Error('Failed to fetch watchlist data')
      const data = await response.json()
      setWatchlistData({
        watchlist: data.watchlist || [],
        total_portfolio_value: data.total_portfolio_value || 0,
        total_pnl: data.total_pnl || 0,
        holdings_distribution: data.holdings_distribution || {},
        investment_by_type: data.investment_by_type || {},
        profit_by_asset: data.profit_by_asset || {}
      })
    } catch (err) {
      console.error('Error fetching watchlist data:', err)
      toast.error('Failed to fetch watchlist data. Please try again.')
      setWatchlistData({
        watchlist: [],
        total_portfolio_value: 0,
        total_pnl: 0,
        holdings_distribution: {},
        investment_by_type: {},
        profit_by_asset: {}
      })
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (isLoaded && user) {
      setUserId(user.id)
    }
  }, [isLoaded, user])

  useEffect(() => {
    if (userId) {
      fetchWatchlistData()
    }
  }, [userId, fetchWatchlistData])

  const validateTicker = async (ticker: string, type: AssetType) => {
    try {
      const response = await fetch(`${API_URL}/api/price?ticker=${ticker}&category=${type}`);
      const data = await response.json();

      if (data.price <= 0) {
        setIsTickerValid(false);
        toast.error('Invalid ticker symbol');
        return false;
      }

      setIsTickerValid(true);
      return true;
    } catch (error) {
      setIsTickerValid(false);
      toast.error('Error validating ticker');
      return false;
    }
  };

  const addToWatchlist = async () => {
    if (!userId) return;

    const isValid = await validateTicker(newTicker, newType);
    if (!isValid) return;

    if (parseFloat(newBuyPrice) <= 0) {
      toast.error('Buy price must be greater than 0')
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/watchlist`, {
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
      const response = await fetch(`${API_URL}/api/watchlist?item_id=${editingItem.id}`, {
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
      const response = await fetch(`${API_URL}/api/watchlist?user_id=${userId}&item_id=${itemId}`, {
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

  const formatProfitData = (profitData: Record<string, {
    amount: number
    percentage_gain: number
    invested_amount: number
    current_value: number
  }>) => {
    return Object.entries(profitData).map(([ticker, data]) => ({
      name: ticker,
      value: Math.abs(data.percentage_gain),
      originalValue: data.percentage_gain,
    }));
  };

  const handleAnalyzePortfolio = async () => {
    if (!watchlistData) return
    setIsAnalyzing(true)
    try {
      const response = await axios.post(`${API_URL}/generate?type=analyzer`, watchlistData)

      const rdata = await response.data
      const jsonString = rdata.response.replace(/```json\n|\n```/g, '');

      const cleanedData = JSON.parse(jsonString);

      setAnalysisResult(cleanedData)
    } catch (error) {
      console.error('Analysis error:', error)
      toast.error('Failed to analyze portfolio. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    <div>
      <Navbar2 />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white text-blue-900 p-8">

        <br /><br />

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

            <Button
              onClick={handleAnalyzePortfolio}
              className="mb-4 bg-green-600 hover:bg-green-700 text-white"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? 'Analyzing...' : 'Get Your Portfolio Analyzed by AI'}
            </Button>

            {analysisResult && (
              <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-xl w-11/12 md:w-3/4 lg:w-4/5 h-[90vh] flex flex-col">
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-blue-800">Portfolio Analysis</h2>
                      <button onClick={() => setAnalysisResult(null)} className="p-2 hover:bg-gray-100 rounded-full">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 p-6 grid grid-cols-12 gap-8">
                    <div className="col-span-8 space-y-8">
                      <div className='bg-white rounded-lg'>
                        <h3 className="text-xl font-semibold text-blue-700 mb-4">Asset Recommendations</h3>
                        <div className="relative">
                          <div className="grid grid-cols-2 gap-4">
                            {analysisResult.asset_recommendations.slice(currentPage * 2, (currentPage * 2) + 2).map((rec, index) => (
                              <div key={index} className={`p-4 rounded-lg shadow-md h-fit ${
                                rec.action === 'BUY' ? 'bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-400' :
                                  rec.action === 'SELL' ? 'bg-gradient-to-br from-red-50 to-red-100 border-l-4 border-red-400' :
                                    'bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-4 border-yellow-400'
                                }`}>
                                <div className="flex justify-between items-center mb-3">
                                  <h4 className="text-xl font-bold">{rec.ticker}</h4>
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    rec.action === 'BUY' ? 'bg-green-200 text-green-800' :
                                      rec.action === 'SELL' ? 'bg-red-200 text-red-800' :
                                        'bg-yellow-200 text-yellow-800'
                                    }`}>{rec.action}</span>
                                </div>
                                <p className="text-sm text-gray-700">{rec.reason}</p>
                              </div>
                            ))}
                          </div>

                          {analysisResult.asset_recommendations.length > 2 && (
                            <div className="absolute inset-y-0 -left-4 -right-4 flex items-center justify-between">
                              <button
                                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                                className="transform -translate-x-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 disabled:opacity-50 z-10"
                                disabled={currentPage === 0}
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => setCurrentPage(p => p + 1)}
                                className="transform translate-x-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 disabled:opacity-50 z-10"
                                disabled={currentPage >= Math.ceil(analysisResult.asset_recommendations.length / 2) - 1}
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-center mt-4 gap-2">
                          {Array.from({ length: Math.ceil(analysisResult.asset_recommendations.length / 2) }).map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentPage(idx)}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                currentPage === idx ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="bg-indigo-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-indigo-700 mb-4">Market Insights</h3>
                        <div className="relative">
                          <div className="grid grid-cols-2 gap-4">
                            {analysisResult.general_trend_insights
                              .slice(insightPage * 2, (insightPage * 2) + 2)
                              .map((insight, index) => (
                                <div key={index} className="bg-white/60 p-3 rounded-lg">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">{insight.sector}</span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                      insight.recommendation === 'Decrease' ? 'bg-red-100 text-red-700' :
                                        insight.recommendation === 'Increase' ? 'bg-green-100 text-green-700' :
                                          'bg-yellow-100 text-yellow-700'
                                      }`}>{insight.recommendation}</span>
                                  </div>
                                  <p className="text-sm text-gray-600">{insight.reason}</p>
                                </div>
                              ))}
                          </div>

                          {analysisResult.general_trend_insights.length > 2 && (
                            <div className="absolute inset-y-0 -left-4 -right-4 flex items-center justify-between">
                              <button
                                onClick={() => setInsightPage(p => Math.max(0, p - 1))}
                                className="transform -translate-x-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 disabled:opacity-50 z-10"
                                disabled={insightPage === 0}
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => setInsightPage(p => p + 1)}
                                className="transform translate-x-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 disabled:opacity-50 z-10"
                                disabled={insightPage >= Math.ceil(analysisResult.general_trend_insights.length / 2) - 1}
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>
                          )}

                          {analysisResult.general_trend_insights.length > 2 && (
                            <div className="flex justify-center mt-4 gap-2">
                              {Array.from({ length: Math.ceil(analysisResult.general_trend_insights.length / 2) })
                                .map((_, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => setInsightPage(idx)}
                                    className={`w-2 h-2 rounded-full transition-colors ${
                                      insightPage === idx ? 'bg-indigo-600' : 'bg-gray-300'
                                      }`}
                                  />
                                ))}
                            </div>
                          )}
                        </div>
                      </div>

                    </div>

                    <div className="col-span-4 px-2 flex items-center">
                      <div className="bg-blue-50 p-6 rounded-lg w-full">
                        <h3 className="text-xl font-semibold text-blue-700 mb-6 text-center">Risk Analysis</h3>
                        <div className="space-y-6">
                          {Object.entries(analysisResult.risk_analysis.current_risk_exposure).map(([risk, value]) => (
                            <div key={risk} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="capitalize">{risk.replace('_', ' ')}</span>
                                <span>{value}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all ${
                                    risk === 'high_risk' ? 'bg-red-500' :
                                      risk === 'medium_risk' ? 'bg-yellow-500' :
                                        'bg-green-500'
                                    }`}
                                  style={{ width: value }}
                                />
                              </div>
                            </div>
                          ))}

                          {analysisResult.risk_analysis.adjustment_suggestions.decrease_risk_exposure === 'YES' && (
                            <div className="mt-4 p-3 bg-red-100 rounded-lg">
                              <p className="text-sm text-red-800">
                                {analysisResult.risk_analysis.adjustment_suggestions.reason}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
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
                      <div className="mb-6">
                        <p className="text-2xl font-bold mb-2 text-blue-900">
                          ${watchlistData.total_portfolio_value.toLocaleString()}
                        </p>
                        <p className={`text-lg ${watchlistData.total_pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {watchlistData.total_pnl >= 0 ? <TrendingUp className="inline mr-2" /> : <TrendingDown className="inline mr-2" />}
                          ${watchlistData.total_pnl.toLocaleString()}
                        </p>
                      </div>
                      <div className="border-t pt-4">
                        <h3 className="text-lg font-semibold mb-2 text-blue-800">Investment by Type</h3>
                        {Object.entries(watchlistData.investment_by_type).map(([type, amount]) => (
                          <div key={type} className="flex justify-between items-center mb-2">
                            <span className="capitalize">{type}</span>
                            <span className="font-semibold">${amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-lg text-blue-600">Add your first investment to see portfolio stats</p>
                    </div>
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
                    <div className="text-center py-4">
                      <p className="text-lg text-blue-600">Add your first investment to see portfolio stats</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white border-blue-200 shadow-md">
                <CardHeader>
                  <CardTitle className="text-blue-800">Profit Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  {watchlistData && watchlistData.profit_by_asset &&
                    Object.keys(watchlistData.profit_by_asset).length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={formatProfitData(watchlistData.profit_by_asset)}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, originalValue }) =>
                            `${name} (${originalValue >= 0 ? '+' : ''}${originalValue.toFixed(1)}%)`
                          }
                        >
                          {formatProfitData(watchlistData.profit_by_asset).map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.originalValue >= 0 ? '#22c55e' : '#ef4444'}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-lg text-blue-600">Add your first investment to see portfolio stats</p>
                    </div>
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
                        <div className="relative">
                          <Input
                            value={newTicker}
                            onChange={(e) => {
                              setNewTicker(e.target.value)
                              debouncedSearch(e.target.value)
                              setIsTickerValid(true);
                            }}
                            placeholder="Ticker (e.g., AAPL, BTC)"
                            className={`border-blue-300 focus:border-blue-500 ${
                              !isTickerValid ? 'border-red-500' : ''
                              }`}
                          />
                          {!isTickerValid && (
                            <div className="text-red-500 text-sm mt-1">
                              Invalid ticker symbol
                            </div>
                          )}
                          {searchResults.length > 0 && newTicker.length > 0 && (
                            <div
                              ref={searchResultsRef}
                              className="absolute w-full z-50 mt-1 bg-white rounded-lg border shadow-md max-h-[200px] overflow-y-auto"
                              style={{ maxHeight: '200px' }}
                            >
                              {searchResults.map((result) => (
                                <div
                                  key={`${result.symbol}-${result.description}`}
                                  onClick={() => {
                                    setNewTicker(result.symbol)
                                    setSearchResults([])
                                  }}
                                  className="p-2 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium">{result.symbol}</span>
                                    <span className="text-sm text-gray-500 truncate">
                                      {result.description}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

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
                          min="0.01"
                          step="0.01"
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
                  <div className="text-center py-10">
                    <div className="text-6xl mb-4">📈</div>
                    <h3 className="text-xl font-semibold text-blue-800 mb-2">Your Watchlist is Empty</h3>
                    <p className="text-blue-600 mb-4">Click the + button above to start tracking your investments</p>
                  </div>
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
                      onChange={(e) => setEditingItem({ ...editingItem, ticker: e.target.value })}
                      placeholder="Ticker"
                      className="border-blue-300 focus:border-blue-500"
                    />
                    <select
                      value={editingItem.type}
                      onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value as 'stock' | 'crypto' })}
                      className="bg-white text-blue-900 rounded-md p-2 border border-blue-300 focus:border-blue-500"
                    >
                      <option value="stock">Stock</option>
                      <option value="crypto">Crypto</option>
                    </select>
                    <Input
                      value={editingItem.buy_price}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value)
                        if (value <= 0) return
                        setEditingItem({ ...editingItem, buy_price: value })
                      }}
                      placeholder="Buy Price"
                      type="number"
                      min="0.01"
                      step="0.01"
                      className="border-blue-300 focus:border-blue-500"
                    />
                    <Input
                      value={editingItem.quantity}
                      onChange={(e) => setEditingItem({ ...editingItem, quantity: parseInt(e.target.value) })}
                      placeholder="Quantity"
                      type="number"
                      min="1"
                      className="border-blue-300 focus:border-blue-500"
                    />
                    <Button onClick={updateWatchlistItem} className="bg-blue-600 hover:bg-blue-700 text-white">Update Item</Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
            <Chatbot />
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}
