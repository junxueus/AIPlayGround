import { type NextRequest, NextResponse } from "next/server"

// Mock holdings data
const mockHoldings: any[] = []

export async function GET(request: NextRequest) {
  try {
    // In production, fetch from database based on user ID
    return NextResponse.json(mockHoldings)
  } catch (error) {
    console.error("Error fetching holdings:", error)
    return NextResponse.json({ error: "Failed to fetch holdings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { symbol, companyName, quantity, purchasePrice, purchaseDate } = await request.json()

    if (!symbol || !quantity || !purchasePrice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const holding = {
      id: Math.random().toString(36).substr(2, 9),
      symbol,
      companyName,
      quantity: Number.parseFloat(quantity),
      purchasePrice: Number.parseFloat(purchasePrice),
      purchaseDate,
      currentPrice: purchasePrice, // In production, fetch current price from API
    }

    mockHoldings.push(holding)
    return NextResponse.json(holding, { status: 201 })
  } catch (error) {
    console.error("Error creating holding:", error)
    return NextResponse.json({ error: "Failed to create holding" }, { status: 500 })
  }
}
