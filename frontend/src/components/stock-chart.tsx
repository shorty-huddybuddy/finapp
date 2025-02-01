"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import React from "react"


interface ChartData {
  date: string
  value: number
}

export function StockChart({
  symbol,
  name,
  data,
  onIntervalChange,
}: {
  symbol: string
  name: string
  data: ChartData[]
  onIntervalChange: (interval: string) => void
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {name} ({symbol}) Stock Price
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onIntervalChange("1D")}>
              1D
            </Button>
            <Button variant="outline" size="sm" onClick={() => onIntervalChange("1W")}>
              1W
            </Button>
            <Button variant="outline" size="sm" onClick={() => onIntervalChange("1M")}>
              1M
            </Button>
            <Button variant="outline" size="sm" onClick={() => onIntervalChange("1Y")}>
              1Y
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

