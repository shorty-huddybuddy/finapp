"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { fetchNotifications, fetchInsights, fetchMarketEvents, fetchRiskAlerts, fetchGoals } from "../lib/api"
import { motion } from "framer-motion"
import { useAuth } from "@clerk/nextjs"

export function Sidebar_for_calendar() {
  const [notifications, setNotifications] = useState<string[]>([])
  const [insights, setInsights] = useState<string[]>([])
  const [marketEvents, setMarketEvents] = useState<string[]>([])
  const [riskAlerts, setRiskAlerts] = useState<string[]>([])
  const { getToken } = useAuth()

  useEffect(() => {
    const loadSidebarData = async () => {
      const token = await getToken()
      setNotifications(await fetchNotifications(token))
      setInsights(await fetchInsights(token))
      setMarketEvents(await fetchMarketEvents(token))
      setRiskAlerts(await fetchRiskAlerts(token))
    }
    loadSidebarData()
  }, [])

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <SidebarSection title="Notifications" items={notifications} />
      <SidebarSectionpy title="Market Events" items={marketEvents} />
      <SidebarSectionpy title="Risk Alerts" items={riskAlerts} isAlert />
    </div>
  )
}

export function SidebarSectionpy({ title, items, isAlert = false }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-blue-600">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map((item: any, index: any) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {isAlert ? (
                <div className="border-2 bg-red-200 rounded text-sm py-auto px-auto">
                  <a href={item.url}>{item.title}</a>
                </div>  
              ) : (
                <div className="text-sm text-gray-700"><a href={item.url} >{item.title}</a> </div>
              )}
            </motion.li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}


export function SidebarSection({ title, items, isAlert = false }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-blue-600">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map((item: any, index: any) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {isAlert ? (
                <div className="border-2 bg-red-200 rounded text-sm py-auto px-auto">
                  {item}
                </div>  
              ) : (
                <div className="text-sm text-gray-700">{item}</div>
              )}
            </motion.li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

