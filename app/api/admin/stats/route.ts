import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { getActiveUsers, getDailyEarnings, getMonthlyEarnings, getTotalVouchers } from "@/lib/db"

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
    const [activeUsersResult, dailyEarningsResult, monthlyEarningsResult, totalVouchers] = await Promise.all([
      getActiveUsers(),
      getDailyEarnings(),
      getMonthlyEarnings(),
      getTotalVouchers(),
    ])

    const stats = {
      activeUsers: activeUsersResult[0]?.count || 0,
      dailyEarnings: dailyEarningsResult[0]?.total || 0,
      monthlyEarnings: monthlyEarningsResult[0]?.total || 0,
      totalVouchers: totalVouchers || 0,
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
