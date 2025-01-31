"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import React from "react"

const data = [
  { time: "19:00", price: 5459 },
  { time: "20:00", price: 5461 },
  { time: "21:00", price: 5470 },
  { time: "22:00", price: 5460 },
  { time: "23:00", price: 5468 },
]

export default function PriceChart() {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-[#1A2332] border border-[#2A3442] p-2 rounded-lg">
                    <div className="text-sm text-white">Price: {payload[0].value}</div>
                  </div>
                )
              }
              return null
            }}
          />
          <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

