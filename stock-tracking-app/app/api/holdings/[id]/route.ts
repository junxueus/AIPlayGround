import { type NextRequest, NextResponse } from "next/server"

// Mock holdings data
let mockHoldings: any[] = []

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    mockHoldings = mockHoldings.filter((h) => h.id !== id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting holding:", error)
    return NextResponse.json({ error: "Failed to delete holding" }, { status: 500 })
  }
}
