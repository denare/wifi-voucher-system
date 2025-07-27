import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { getActiveSessions } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    console.log("Admin sessions API called")

    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      console.log("No token provided")
      return NextResponse.json({ message: "Authentication required" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== "admin") {
      console.log("Admin access required")
      return NextResponse.json({ message: "Admin access required" }, { status: 403 })
    }

    console.log("Fetching active sessions")
    const sessions = await getActiveSessions()
    console.log("Sessions fetched:", sessions.length)

    return NextResponse.json({
      sessions,
    })
  } catch (error) {
    console.error("Admin sessions error:", error)
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
