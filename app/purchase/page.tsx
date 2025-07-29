"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CreditCard, Smartphone, Wifi, Clock, Database } from "lucide-react"
import { formatCurrency } from "@/lib/currency"

interface VoucherPlan {
  id: number
  name: string
  data_limit_mb: number | null
  time_limit_hours: number | null
  price: number
  description: string
}

export default function PurchasePage() {
  const [plans, setPlans] = useState<VoucherPlan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<string>("mpesa")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/vouchers/plans")
      if (response.ok) {
        const data = await response.json()
        setPlans(data.plans)
      }
    } catch (error) {
      console.error("Failed to fetch plans:", error)
    }
  }

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    if (!selectedPlan) {
      setError("Please select a voucher plan")
      setLoading(false)
      return
    }

    if (paymentMethod === "mpesa" && !phoneNumber) {
      setError("Please enter your phone number")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/vouchers/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan,
          paymentMethod,
          phoneNumber: paymentMethod === "mpesa" ? phoneNumber : undefined,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(`Voucher purchased successfully! Your voucher code is: ${data.voucher.code}`)
        setTimeout(() => {
          router.push("/dashboard")
        }, 3000)
      } else {
        setError(data.message || "Purchase failed")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const formatDataLimit = (mb: number | null) => {
    if (!mb) return "Unlimited"
    return mb >= 1024 ? `${(mb / 1024).toFixed(0)}GB` : `${mb}MB`
  }

  const formatTimeLimit = (hours: number | null) => {
    if (!hours) return "No time limit"
    if (hours >= 24) return `${(hours / 24).toFixed(0)} day${hours > 24 ? "s" : ""}`
    return `${hours} hour${hours > 1 ? "s" : ""}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button variant="ghost" onClick={() => router.back()} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center">
              <Wifi className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-xl font-semibold text-gray-900">Purchase Voucher</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Plans Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Plan</CardTitle>
              <CardDescription>Select a data plan that suits your needs</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                <div className="space-y-4">
                  {plans.map((plan) => (
                    <div key={plan.id} className="flex items-center space-x-3">
                      <RadioGroupItem value={plan.id.toString()} id={`plan-${plan.id}`} />
                      <Label htmlFor={`plan-${plan.id}`} className="flex-1 cursor-pointer">
                        <div className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{plan.name}</h3>
                            <Badge variant="secondary">{formatCurrency(plan.price)}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                          <div className="flex space-x-4 text-sm">
                            <div className="flex items-center">
                              <Database className="h-4 w-4 mr-1 text-blue-600" />
                              {formatDataLimit(plan.data_limit_mb)}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-green-600" />
                              {formatTimeLimit(plan.time_limit_hours)}
                            </div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>Choose your payment method and complete the purchase</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePurchase} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <Label>Payment Method</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mpesa" id="mpesa" />
                      <Label htmlFor="mpesa" className="flex items-center cursor-pointer">
                        <Smartphone className="h-4 w-4 mr-2 text-green-600" />
                        M-Pesa Mobile Money
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center cursor-pointer">
                        <CreditCard className="h-4 w-4 mr-2 text-blue-600" />
                        Credit/Debit Card
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {paymentMethod === "mpesa" && (
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="e.g., +254700000000"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                    <p className="text-sm text-gray-600">You will receive an M-Pesa prompt on this number</p>
                  </div>
                )}

                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" required />
                      </div>
                    </div>
                  </div>
                )}

                {selectedPlan && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Order Summary</h4>
                    {(() => {
                      const plan = plans.find((p) => p.id.toString() === selectedPlan)
                      return plan ? (
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Plan:</span>
                            <span>{plan.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Data:</span>
                            <span>{formatDataLimit(plan.data_limit_mb)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Validity:</span>
                            <span>{formatTimeLimit(plan.time_limit_hours)}</span>
                          </div>
                          <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                            <span>Total:</span>
                            <span>{formatCurrency(plan.price)}</span>
                          </div>
                        </div>
                      ) : null
                    })()}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading || !selectedPlan}>
                  {loading ? "Processing..." : "Purchase Voucher"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
