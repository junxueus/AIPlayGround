"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface PerformanceData {
  name: string
  value: number
  gain: number
}

export default function PerformanceChart() {
  const [data, setData] = useState<PerformanceData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("/api/portfolio/performance", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const perfData = await res.json()
        setData(perfData)
      } catch (err) {
        console.error("Failed to fetch performance:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPerformance()
  }, [])

  if (isLoading) {
    return <div className="text-center text-muted-foreground">Loading performance data...</div>
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No performance data yet. Add holdings to see charts.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Performance</CardTitle>
        <CardDescription>Gain/Loss by holding</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="value" fill="#3b82f6" name="Current Value" />
            <Bar dataKey="gain" fill="#10b981" name="Gain/Loss" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
