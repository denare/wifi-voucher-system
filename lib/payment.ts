// Mock payment integration - replace with actual payment gateway
export interface PaymentRequest {
  amount: number
  phone: string
  reference: string
  method: "mpesa" | "card"
}

export interface PaymentResponse {
  success: boolean
  transactionId?: string
  message: string
  currency?: string
}

export async function processPayment(request: PaymentRequest): Promise<PaymentResponse> {
  // Simulate payment processing
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Mock success/failure (90% success rate)
  const success = Math.random() > 0.1

  if (success) {
    return {
      success: true,
      transactionId: `TXN${Date.now()}`,
      message: "Payment processed successfully",
      currency: "TZS",
    }
  } else {
    return {
      success: false,
      message: "Payment failed. Please try again.",
      currency: "TZS",
    }
  }
}

export function validatePhoneNumber(phone: string): boolean {
  // Basic phone number validation for East African numbers
  const phoneRegex = /^(\+?254|0)[17]\d{8}$/
  return phoneRegex.test(phone)
}
