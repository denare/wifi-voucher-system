import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, generateVoucherCode } from "@/lib/auth"
import { createVoucher, getVoucherPlans } from "@/lib/server-db"
import { processPayment } from "@/lib/payment"

export async function POST(request: NextRequest) {
  try {
    console.log("Purchase API called")

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

    const body = await request.json()
    console.log("Purchase request:", body)

    const { planId, paymentMethod, phoneNumber } = body

    // Get plan details
    const plans = await getVoucherPlans()
    const plan = plans.find((p: any) => p.id === planId)

    if (!plan) {
      console.log("Invalid plan selected")
      return NextResponse.json({ message: "Invalid plan selected" }, { status: 400 })
    }

    console.log("Processing payment for plan:", plan.name)

    // Process payment
    const paymentResult = await processPayment({
      amount: plan.price,
      phone: phoneNumber || "",
      reference: `voucher-${Date.now()}`,
      method: paymentMethod,
    })

    if (!paymentResult.success) {
      console.log("Payment failed:", paymentResult.message)
      return NextResponse.json({ message: paymentResult.message }, { status: 400 })
    }

    console.log("Payment successful, creating voucher")

    // Create voucher
    const voucherCode = generateVoucherCode()
    const voucher = await createVoucher(voucherCode, planId, payload.userId)

    console.log("Voucher created:", voucher.code)

    return NextResponse.json({
      message: "Voucher purchased successfully",
      voucher: {
        id: voucher.id,
        code: voucher.code,
        plan_name: plan.name,
      },
    })
  } catch (error) {
    console.error("Purchase error:", error)
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
