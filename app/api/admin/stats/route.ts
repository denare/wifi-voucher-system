import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { getDashboardStats } from "@/lib/server-db"

export async function GET(request: NextRequest) {
  try {
    console.log("Admin stats API called")

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

    console.log("Fetching admin stats")

    // Get statistics
    const dashboardStats = await getDashboardStats()

    const stats = {
      activeUsers: dashboardStats.activeUsers,
      dailyEarnings: dashboardStats.dailyEarnings,
      monthlyEarnings: dashboardStats.monthlyEarnings,
      totalVouchers: dashboardStats.totalVouchers,
    }

    console.log("Stats fetched:", stats)

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Admin stats error:", error)
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
  