import { NextResponse } from "next/server"
import { getVoucherPlans } from "@/lib/server-db"

export async function GET() {
  try {
    console.log("Voucher plans API called")

    const plans = await getVoucherPlans()
    console.log("Plans fetched:", plans.length)

    return NextResponse.json({
      plans,
    })
  } catch (error) {
    console.error("Fetch plans error:", error)
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
