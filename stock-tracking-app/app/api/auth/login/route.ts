import { type NextRequest, NextResponse } from "next/server"

// Mock user data (in production, use actual database)
const mockUsers: Record<string, { id: string; email: string; passwordHash: string; fullName: string }> = {
  "test@example.com": {
    id: "1",
    email: "test@example.com",
    passwordHash: "$2b$10$...", // In production, use bcrypt
    fullName: "Test User",
  },
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // In production, query the database and use bcrypt to verify password
    const user = mockUsers[email]
    if (!user || password !== "password") {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // In production, generate a proper JWT token
    const token = Buffer.from(`${email}:${Date.now()}`).toString("base64")

    return NextResponse.json({
      user: { id: user.id, email: user.email, fullName: user.fullName },
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
