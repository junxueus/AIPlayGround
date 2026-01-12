import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Mock performance data
    return NextResponse.json([])
  } catch (error) {
    console.error("Error fetching performance:", error)
    return NextResponse.json({ error: "Failed to fetch performance" }, { status: 500 })
  }
}
