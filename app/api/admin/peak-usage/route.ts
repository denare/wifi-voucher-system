import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { getPeakUsageTimes } from "@/lib/server-db"

export async function GET(request: NextRequest) {
  try {
    console.log("Peak usage API called")

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

    console.log("Fetching peak usage times")
    const peakUsage = await getPeakUsageTimes()
    console.log("Peak usage fetched:", peakUsage)

    return NextResponse.json(peakUsage)
  } catch (error) {
    console.error("Peak usage error:", error)
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
