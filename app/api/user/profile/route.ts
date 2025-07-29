import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { getAllUsers } from "@/lib/server-db"

export async function GET(request: NextRequest) {
  try {
    console.log("Profile API called")

    const token = request.cookies.get("auth-token")?.value
    console.log("Token found:", !!token)

    if (!token) {
      console.log("No token provided")
      return NextResponse.json({ message: "Authentication required" }, { status: 401 })
    }

    const payload = verifyToken(token)
    console.log("Token payload:", payload)

    if (!payload) {
      console.log("Invalid token")
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    // Get all users and find the current user
    const users = await getAllUsers()
    const user = users.find((u: any) => u.id === payload.userId)

    if (!user) {
      console.log("User not found")
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    console.log("Profile fetched for user:", user.email)

    return NextResponse.json({
      user,
    })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
