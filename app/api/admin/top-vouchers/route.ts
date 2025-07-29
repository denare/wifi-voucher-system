import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { getTopPerformingVouchers } from "@/lib/server-db"

export async function GET(request: NextRequest) {
  try {
    console.log("Top vouchers API called")

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

    console.log("Fetching top performing vouchers")
    const vouchers = await getTopPerformingVouchers()
    console.log("Top vouchers fetched:", vouchers.length)

    return NextResponse.json({
      vouchers,
    })
  } catch (error) {
    console.error("Top vouchers error:", error)
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
