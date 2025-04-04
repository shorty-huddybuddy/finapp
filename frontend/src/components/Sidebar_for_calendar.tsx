"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { fetchNotifications, fetchInsights, fetchMarketEvents, fetchRiskAlerts, fetchGoals } from "../lib/api"
import { motion } from "framer-motion"
import { useAuth } from "@clerk/nextjs"

export default function Sidebar() {
  const [notifications, setNotifications] = useState([])
  const [insights, setInsights] = useState([])
  const [marketEvents, setMarketEvents] = useState([])
  const [riskAlerts, setRiskAlerts] = useState([])
  const [goals, setGoals] = useState([])
  const {getToken} = useAuth()
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
      {/* <Card>
        <CardHeader>    
          <CardTitle className="text-xl font-bold text-blue-800">Financial Goals</CardTitle>
        </CardHeader>
        <CardContent> 
          {goals.map((goal, index) => (
            <motion.div
              key={index}
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between mb-1">
                <span className="font-medium text-gray-700">{goal.name}</span>
                <span className="font-bold text-blue-700">{goal.progress}%</span>
              </div>
              <Progress value={goal.progress} className="w-full h-2" indicatorColor="bg-blue-600" />
            </motion.div>
          ))}
        </CardContent>
      </Card> */}
    </div>
  )
}

function SidebarSectionpy({ title, items, isAlert = false }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-blue-600">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map((item, index) => (
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


function SidebarSection({ title, items, isAlert = false }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-blue-600">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map((item, index) => (
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

