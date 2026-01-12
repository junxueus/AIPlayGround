"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface Portfolio {
  totalValue: number
  totalInvested: number
  totalGain: number
  gainPercentage: number
  holdingCount: number
}

export default function PortfolioOverview() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("/api/portfolio/overview", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setPortfolio(data)
      } catch (err) {
        console.error("Failed to fetch portfolio:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPortfolio()
  }, [])

  if (isLoading) {
    return <div className="text-center text-muted-foreground">Loading portfolio...</div>
  }

  if (!portfolio) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No holdings yet. Add your first stock!</p>
        </CardContent>
      </Card>
    )
  }

  const isPositive = portfolio.totalGain >= 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Portfolio Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${portfolio.totalValue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">Current market value</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Invested</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${portfolio.totalInvested.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">Amount invested</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Gain/Loss</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold flex items-center gap-2 ${isPositive ? "text-green-600" : "text-red-600"}`}
          >
            {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}$
            {Math.abs(portfolio.totalGain).toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{portfolio.gainPercentage.toFixed(2)}%</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{portfolio.holdingCount}</div>
          <p className="text-xs text-muted-foreground mt-1">Stocks owned</p>
        </CardContent>
      </Card>
    </div>
  )
}
