const API_KEY = "679542ee6b35c4.80378588"
const BASE_URL = "https://api.marketdata.app/v1"

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

