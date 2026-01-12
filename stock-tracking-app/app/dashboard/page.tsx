"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PortfolioOverview from "@/components/portfolio-overview"
import HoldingsList from "@/components/holdings-list"
import StockSearch from "@/components/stock-search"
import PerformanceChart from "@/components/performance-chart"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
    } else {
      setUser(JSON.parse(userData))
      setIsLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    router.push("/")
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Stock Tracker</h1>
            <p className="text-muted-foreground">Welcome back, {user?.full_name || user?.email}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="holdings">Holdings</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="add-stock">Add Stock</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <PortfolioOverview />
          </TabsContent>

          <TabsContent value="holdings" className="space-y-4">
            <HoldingsList />
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <PerformanceChart />
          </TabsContent>

          <TabsContent value="add-stock" className="space-y-4">
            <StockSearch />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
