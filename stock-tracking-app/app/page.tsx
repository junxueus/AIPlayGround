"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem("user")
    if (user) {
      setIsAuthenticated(true)
      router.push("/dashboard")
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl text-center">Stock Tracker</CardTitle>
          <CardDescription className="text-center">
            Track your stock holdings and monitor portfolio performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Manage your investments, track real-time quotes, and analyze your portfolio in one place.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => router.push("/login")} className="w-full">
              Sign In
            </Button>
            <Button onClick={() => router.push("/signup")} className="w-full">
              Sign Up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
