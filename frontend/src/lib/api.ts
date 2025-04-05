
import { MARKET_DATA_API_KEY, MARKET_DATA_URL, API_URL as URL,ML_API_URL } from "./config"
const API_KEY = MARKET_DATA_API_KEY
const BASE_URL = MARKET_DATA_URL

import type { EventInput } from "@fullcalendar/core"

// Remove the getToken function since we'll use getToken from useAuth() directly in components

export async function fetchTrendingStocks() {
  const response = await fetch(`${BASE_URL}/stocks/trending?api_key=${API_KEY}`)
  return response.json()
}

export async function fetchTopGainers() {
  const response = await fetch(`${BASE_URL}/stocks/gainers?api_key=${API_KEY}`)
  return response.json()
}

export async function fetchTopLosers() {
  const response = await fetch(`${BASE_URL}/stocks/losers?api_key=${API_KEY}`)
  return response.json()
}

export async function fetchMostActive() {
  const response = await fetch(`${BASE_URL}/stocks/active?api_key=${API_KEY}`)
  return response.json()
}

export async function fetchStockDetails(symbol: string) {
  const response = await fetch(`${BASE_URL}/stocks/quote/${symbol}?api_key=${API_KEY}`)
  return response.json()
}

export async function fetchStockNews(symbol: string) {
  const response = await fetch(`${BASE_URL}/stocks/news/${symbol}?api_key=${API_KEY}`)
  return response.json()
}

export async function fetchStockChart(symbol: string, interval = "1d") {
  const response = await fetch(`${BASE_URL}/stocks/candles/${symbol}?interval=${interval}&api_key=${API_KEY}`)
  return response.json()
}

//  calender part apis 
const PYTHON_URL = ML_API_URL
const API_URL = `${URL}/api/calender`

// All API functions now accept a token parameter which will be obtained from useAuth().getToken() in components

// Fetch all events - modified to accept token parameter
export const fetchEvents = async (token?: string | null): Promise<EventInput[]> => {
  try {
    const response = await fetch(`${API_URL}/events`, {
      headers: { 'Authorization': token ? `Bearer ${token}` : '' }
    })
    console.log(response.json)
    if (!response.ok) throw new Error("Failed to fetch events")
    return await response.json()
  } catch (error) { 
    console.error("Error fetching events:", error)
    return []
  }
}

// Create a new event - modified to accept token parameter
export const createEvent = async (event: EventInput, token?: string | null): Promise<EventInput> => {
  try {
    const response = await fetch(`${API_URL}/events`, {
      method: "POST",
      headers: { 
        'Content-Type': "application/json",
        'Authorization': token ? `Bearer ${token}` : '' 
      },
      body: JSON.stringify(event),
    })
    if (!response.ok) throw new Error("Failed to create event")
    return await response.json()
  } catch (error) {
    console.error("Error creating event:", error)
    throw error
  }
}

// Update an existing event - modified to accept token parameter
export const updateEvent = async (event: EventInput, token?: string | null): Promise<EventInput> => {
  try {
    const response = await fetch(`${API_URL}/events/${event.id}`, {
      method: "PUT",
      headers: { 
        'Content-Type': "application/json",
        'Authorization': token ? `Bearer ${token}` : '' 
      },
      body: JSON.stringify(event),
    })
    if (!response.ok) throw new Error("Failed to update event")
    return await response.json()
  } catch (error) {
    console.error("Error updating event:", error)
    throw error
  }
}

// Delete an event - modified to accept token parameter
export const deleteEvent = async (eventId: string, token?: string | null): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/events/${eventId}`, {
      method: "DELETE",
      headers: { 'Authorization': token ? `Bearer ${token}` : '' }
    })
    if (!response.ok) throw new Error("Failed to delete event")
  } catch (error) {
    console.error("Error deleting event:", error)
    throw error 
  }
}

// Fetch Notifications - modified to accept token parameter
export const fetchNotifications = async (token?: string | null): Promise<string[]> => {
  try {
    const response = await fetch(`${API_URL}/notifications`, {
      headers: { 'Authorization': token ? `Bearer ${token}` : '' }
    })
    if (!response.ok) throw new Error("Failed to fetch notifications")
    return await response.json()
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return []
  }
}

// Fetch Insights - modified to accept token parameter
export const fetchInsights = async (token?: string | null): Promise<string[]> => {
  try {
    const response = await fetch(`${API_URL}/insights`, {
      headers: { 'Authorization': token ? `Bearer ${token}` : '' }
    })
    if (!response.ok) throw new Error("Failed to fetch insights")
    return await response.json()
  } catch (error) {
    console.error("Error fetching insights:", error)
    return []
  }
}

// Fetch Market Events - modified to accept token parameter
export const fetchMarketEvents = async (token?: string | null): Promise<string[]> => {
  try {
    const topic = "Upcoming major market events"
    const response = await fetch(`${PYTHON_URL}/news?topic=${encodeURIComponent(topic)}`, {
      headers: { 'Authorization': token ? `Bearer ${token}` : '' }
    })
    if (!response.ok) throw new Error("Failed to fetch market events")
    return await response.json()
  } catch (error) {
    console.error("Error fetching market events:", error)
    return []
  }
}

// Fetch Risk Alerts - modified to accept token parameter
export const fetchRiskAlerts = async (token?: string | null): Promise<string[]> => {
  try {
    const topic = "Expected Market Risky events"
    const response = await fetch(`${PYTHON_URL}/news?topic=${encodeURIComponent(topic)}`, {
      headers: { 'Authorization': token ? `Bearer ${token}` : '' }
    })
    if (!response.ok) throw new Error("Failed to fetch market events")
    return await response.json()
  } catch (error) { 
    console.error("Error fetching market events:", error)
    return []
  }
}

// Fetch Goals - modified to accept token parameter
export const fetchGoals = async (token?: string | null): Promise<{ name: string; progress: number }[]> => {
  try {
    const response = await fetch(`${API_URL}/goals`, {
      headers: { 'Authorization': token ? `Bearer ${token}` : '' }
    })
    if (!response.ok) throw new Error("Failed to fetch goals")
    return await response.json()
  } catch (error) {
    console.error("Error fetching goals:", error)
    return []
  }
}
