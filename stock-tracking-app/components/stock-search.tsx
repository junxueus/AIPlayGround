"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"

interface StockResult {
  symbol: string
  name: string
  price: number
}

export default function StockSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<StockResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedStock, setSelectedStock] = useState<StockResult | null>(null)
  const [quantity, setQuantity] = useState("")
  const [purchasePrice, setPurchasePrice] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const res = await fetch(`/api/search-stocks?q=${encodeURIComponent(searchQuery)}`)
      const data = await res.json()
      setResults(data)
    } catch (err) {
      console.error("Search failed:", err)
    } finally {
      setIsSearching(false)
    }
  }

  const handleAddHolding = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStock || !quantity || !purchasePrice) return

    setIsAdding(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("/api/holdings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          symbol: selectedStock.symbol,
          companyName: selectedStock.name,
          quantity: Number.parseFloat(quantity),
          purchasePrice: Number.parseFloat(purchasePrice),
          purchaseDate: new Date().toISOString(),
        }),
      })

      if (res.ok) {
        setSelectedStock(null)
        setQuantity("")
        setPurchasePrice("")
        setSearchQuery("")
        setResults([])
        alert("Stock added successfully!")
      } else {
        const data = await res.json()
        alert(data.error || "Failed to add stock")
      }
    } catch (err) {
      console.error("Failed to add holding:", err)
      alert("An error occurred")
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Search and Add Stocks</CardTitle>
          <CardDescription>Find stocks to add to your portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search by symbol or company name (e.g., AAPL, Apple)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" disabled={isSearching} size="icon">
                <Search size={20} />
              </Button>
            </div>
          </form>

          {results.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium">Results:</p>
              {results.map((stock) => (
                <div
                  key={stock.symbol}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedStock?.symbol === stock.symbol ? "bg-primary/10 border-primary" : "hover:bg-muted"
                  }`}
                  onClick={() => setSelectedStock(stock)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{stock.symbol}</p>
                      <p className="text-sm text-muted-foreground">{stock.name}</p>
                    </div>
                    <p className="text-lg font-semibold">${stock.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedStock && (
        <Card>
          <CardHeader>
            <CardTitle>Add {selectedStock.symbol} to Portfolio</CardTitle>
            <CardDescription>Enter your purchase details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddHolding} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Stock</Label>
                  <Input value={selectedStock.symbol} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Current Price</Label>
                  <Input value={`$${selectedStock.price.toFixed(2)}`} disabled />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.01"
                    placeholder="Number of shares"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">Purchase Price</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    step="0.01"
                    placeholder="Price per share"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Cost:</span>
                  <span className="font-semibold">
                    ${(Number.parseFloat(quantity || "0") * Number.parseFloat(purchasePrice || "0")).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={isAdding}>
                  {isAdding ? "Adding..." : "Add to Portfolio"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => {
                    setSelectedStock(null)
                    setQuantity("")
                    setPurchasePrice("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
