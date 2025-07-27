import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { getAllVouchers } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    console.log("Admin vouchers API called")

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

    console.log("Fetching all vouchers")
    const vouchers = await getAllVouchers()
    console.log("Vouchers fetched:", vouchers.length)

    return NextResponse.json({
      vouchers,
    })
  } catch (error) {
    console.error("Admin vouchers error:", error)
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
