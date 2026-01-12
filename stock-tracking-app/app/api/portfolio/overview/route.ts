import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Mock portfolio data
    return NextResponse.json({
      totalValue: 0,
      totalInvested: 0,
      totalGain: 0,
      gainPercentage: 0,
      holdingCount: 0,
    })
  } catch (error) {
    console.error("Error fetching portfolio overview:", error)
    return NextResponse.json({ error: "Failed to fetch portfolio overview" }, { status: 500 })
  }
}
