"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface Holding {
  id: string
  symbol: string
  companyName: string
  quantity: number
  purchasePrice: number
  currentPrice: number
  totalCost: number
  currentValue: number
  gain: number
  gainPercentage: number
}

export default function HoldingsList() {
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("/api/holdings", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setHoldings(data)
      } catch (err) {
        console.error("Failed to fetch holdings:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHoldings()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("token")
      await fetch(`/api/holdings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      setHoldings(holdings.filter((h) => h.id !== id))
    } catch (err) {
      console.error("Failed to delete holding:", err)
    }
  }

  if (isLoading) {
    return <div className="text-center text-muted-foreground">Loading holdings...</div>
  }

  if (holdings.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No holdings yet. Add your first stock!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Symbol</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Company</th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground">Quantity</th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground">Avg. Cost</th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground">Current Price</th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground">Current Value</th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground">Gain/Loss</th>
              <th className="text-center py-3 px-4 font-medium text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding) => (
              <tr key={holding.id} className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-semibold">{holding.symbol}</td>
                <td className="py-3 px-4">{holding.companyName}</td>
                <td className="py-3 px-4 text-right">{holding.quantity}</td>
                <td className="py-3 px-4 text-right">${holding.purchasePrice.toFixed(2)}</td>
                <td className="py-3 px-4 text-right">${holding.currentPrice.toFixed(2)}</td>
                <td className="py-3 px-4 text-right font-semibold">${holding.currentValue.toFixed(2)}</td>
                <td
                  className={`py-3 px-4 text-right font-semibold ${holding.gain >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  ${Math.abs(holding.gain).toFixed(2)} ({holding.gainPercentage.toFixed(2)}%)
                </td>
                <td className="py-3 px-4 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(holding.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
