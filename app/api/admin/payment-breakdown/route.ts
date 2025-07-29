import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { getPaymentMethodsBreakdown } from "@/lib/server-db"

export async function GET(request: NextRequest) {
  try {
    console.log("Payment breakdown API called")

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

    console.log("Fetching payment methods breakdown")
    const breakdown = await getPaymentMethodsBreakdown()
    console.log("Payment breakdown fetched:", breakdown)

    return NextResponse.json({
      breakdown,
    })
  } catch (error) {
    console.error("Payment breakdown error:", error)
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
