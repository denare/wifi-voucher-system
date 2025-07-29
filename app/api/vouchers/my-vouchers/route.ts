import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { getUserVouchers } from "@/lib/server-db"

export async function GET(request: NextRequest) {
  try {
    console.log("My vouchers API called")

    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      console.log("No token provided")
      return NextResponse.json({ message: "Authentication required" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      console.log("Invalid token")
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    console.log("Fetching vouchers for user:", payload.userId)
    const vouchers = await getUserVouchers(payload.userId)
    console.log("Vouchers found:", vouchers.length)

    return NextResponse.json({
      vouchers,
    })
  } catch (error) {
    console.error("Fetch vouchers error:", error)
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
