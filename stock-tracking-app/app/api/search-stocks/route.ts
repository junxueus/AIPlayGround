import { type NextRequest, NextResponse } from "next/server"

// Mock stock data
const mockStocks = [
  { symbol: "AAPL", name: "Apple Inc.", price: 150.25 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 140.5 },
  { symbol: "MSFT", name: "Microsoft Corporation", price: 420.75 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 250.3 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 180.2 },
]

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get("q")?.toLowerCase() || ""

    if (!q) {
      return NextResponse.json([])
    }

    const results = mockStocks.filter(
      (stock) => stock.symbol.toLowerCase().includes(q) || stock.name.toLowerCase().includes(q),
    )

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error searching stocks:", error)
    return NextResponse.json({ error: "Failed to search stocks" }, { status: 500 })
  }
}
