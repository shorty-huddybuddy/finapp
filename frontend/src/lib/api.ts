const API_KEY = "679542ee6b35c4.80378588"
const BASE_URL = "https://api.marketdata.app/v1"

import type { EventInput } from "@fullcalendar/core"

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
const API_URL = "http://localhost:8080/api/calender"
const PYTHON_URL = "http://localhost:8000"

// Fetch all events
export const fetchEvents = async (): Promise<EventInput[]> => {
  try {
    const response = await fetch(`${API_URL}/events`)
    if (!response.ok) throw new Error("Failed to fetch events")
    return await response.json()
  } catch (error) { 
    console.error("Error fetching events:", error)
    return []
  }
}

// Create a new event
export const createEvent = async (event: EventInput): Promise<EventInput> => {
  try {
    const response = await fetch(`${API_URL}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    })
    if (!response.ok) throw new Error("Failed to create event")
    return await response.json()
  } catch (error) {
    console.error("Error creating event:", error)
    throw error
  }
}

// Update an existing event
export const updateEvent = async (event: EventInput): Promise<EventInput> => {
  try {
    const response = await fetch(`${API_URL}/events/${event.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    })
    if (!response.ok) throw new Error("Failed to update event")
    return await response.json()
  } catch (error) {
    console.error("Error updating event:", error)
    throw error
  }
}

// Delete an event
export const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/events/${eventId}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete event")
  } catch (error) {
    console.error("Error deleting event:", error)
    throw error 
  }
}

// export const fetchNotifications = async (): Promise<string[]> => {
//   // Simulated API call
//   return ["Tax filing deadline in 2 weeks", "EMI payment due tomorrow"]
// }

// export const fetchInsights = async (): Promise<string[]> => {
//   // Simulated API call
//   return ["Consider increasing your SIP amount", "You can save ₹5000 by optimizing your bills"]
// }

// export const fetchMarketEvents = async (): Promise<string[]> => {
//   // Simulated API call
//   return ["IPO: TechCorp launching next week", "Q2 Results: Major banks reporting this month"]
// }

// export const fetchRiskAlerts = async (): Promise<string[]> => {
//   // Simulated API call
//   return ["High market volatility expected next week", "Currency Currency fluctuations may impact international investments fluctuations may impact international investments"]
// }

// export const fetchGoals = async (): Promise<{ name: string; progress: number }[]> => {
//   // Simulated API call
//   return [
//     { name: "Save ₹100,000 for emergency fund", progress: 75 },
//     { name: "Invest ₹50,000 in mutual funds", progress: 40 },
//   ]
// }

// Fetch Notifications
export const fetchNotifications = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_URL}/notifications`)
    if (!response.ok) throw new Error("Failed to fetch notifications")
    return await response.json()
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return []
  }
}

// Fetch Insights
export const fetchInsights = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_URL}/insights`)
    if (!response.ok) throw new Error("Failed to fetch insights")
    return await response.json()
  } catch (error) {
    console.error("Error fetching insights:", error)
    return []
  }
}

// Fetch Market Events
export const fetchMarketEvents = async (): Promise<string[]> => {
  try {
    const topic = "Upcoming major market events"
    const response = await fetch(`${PYTHON_URL}/news?topic=${encodeURIComponent(topic)}`)

    // console.log(response)
    if (!response.ok) throw new Error("Failed to fetch market events")
    return await response.json()
  } catch (error) {
    console.error("Error fetching market events:", error)
    return []
  }
}


// Fetch Risk Alerts
export const fetchRiskAlerts = async (): Promise<string[]> => {
  try {
    const topic = "Expected Market Risky events"
    const response = await fetch(`${PYTHON_URL}/news?topic=${encodeURIComponent(topic)}`)

    // console.log(response)
    if (!response.ok) throw new Error("Failed to fetch market events")
    return await response.json()
  } catch (error) { 
    console.error("Error fetching market events:", error)
    return []
  }

}

// Fetch Goals
export const fetchGoals = async (): Promise<{ name: string; progress: number }[]> => {
  try {
    const response = await fetch(`${API_URL}/goals`)
    if (!response.ok) throw new Error("Failed to fetch goals")
    return await response.json()
  } catch (error) {
    console.error("Error fetching goals:", error)
    return []
  }
}
