"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wifi, ShoppingCart, Activity, Clock, Database, LogOut } from "lucide-react"
import { formatCurrency } from "@/lib/currency"

interface User {
  id: number
  email: string
  full_name: string
  role: string
}

interface Voucher {
  id: number
  code: string
  plan_name: string
  data_limit_mb: number | null
  time_limit_hours: number | null
  price: number
  status: string
  data_used_mb: number
  activated_at: string | null
  expires_at: string | null
  created_at: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchUserData()
    fetchVouchers()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/profile")
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error)
    }
  }

  const fetchVouchers = async () => {
    try {
      const response = await fetch("/api/vouchers/my-vouchers")
      if (response.ok) {
        const data = await response.json()
        setVouchers(data.vouchers)
      }
    } catch (error) {
      console.error("Failed to fetch vouchers:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    window.location.href = "/login"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "expired":
        return "bg-red-500"
      case "exhausted":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatDataUsage = (used: number, limit: number | null) => {
    if (!limit) return `${(used / 1024).toFixed(2)} GB used`
    const percentage = (used / limit) * 100
    return `${(used / 1024).toFixed(2)} GB / ${(limit / 1024).toFixed(2)} GB (${percentage.toFixed(1)}%)`
  }

  const getDataProgress = (used: number, limit: number | null) => {
    if (!limit) return 0
    return Math.min((used / limit) * 100, 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Wifi className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Wifi className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-xl font-semibold text-gray-900">WiFi Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.full_name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="vouchers" className="space-y-6">
          <TabsList>
            <TabsTrigger value="vouchers">My Vouchers</TabsTrigger>
            <TabsTrigger value="purchase">Purchase</TabsTrigger>
            <TabsTrigger value="usage">Usage History</TabsTrigger>
          </TabsList>

          <TabsContent value="vouchers" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Active Vouchers
                  </CardTitle>
                  <CardDescription>Your current active WiFi vouchers and usage</CardDescription>
                </CardHeader>
                <CardContent>
                  {vouchers.filter((v) => v.status === "active").length === 0 ? (
                    <div className="text-center py-8">
                      <Wifi className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No active vouchers</p>
                      <Button className="mt-4" onClick={() => router.push("/dashboard?tab=purchase")}>
                        Purchase Voucher
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {vouchers
                        .filter((v) => v.status === "active")
                        .map((voucher) => (
                          <div key={voucher.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-semibold">{voucher.plan_name}</h3>
                                <p className="text-sm text-gray-600">Code: {voucher.code}</p>
                              </div>
                              <Badge className={getStatusColor(voucher.status)}>{voucher.status.toUpperCase()}</Badge>
                            </div>

                            {voucher.data_limit_mb && (
                              <div className="mb-3">
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Data Usage</span>
                                  <span>{formatDataUsage(voucher.data_used_mb, voucher.data_limit_mb)}</span>
                                </div>
                                <Progress value={getDataProgress(voucher.data_used_mb, voucher.data_limit_mb)} />
                              </div>
                            )}

                            {voucher.expires_at && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Clock className="h-4 w-4 mr-1" />
                                Expires: {new Date(voucher.expires_at).toLocaleString()}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>All Vouchers</CardTitle>
                  <CardDescription>Complete history of your voucher purchases</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {vouchers.map((voucher) => (
                      <div key={voucher.id} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <p className="font-medium">{voucher.plan_name}</p>
                          <p className="text-sm text-gray-600">{voucher.code}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(voucher.status)}>{voucher.status}</Badge>
                          <p className="text-sm text-gray-600 mt-1">{formatCurrency(voucher.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="purchase">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Purchase Voucher
                </CardTitle>
                <CardDescription>Choose a data plan and purchase your WiFi voucher</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => router.push("/purchase")}>Go to Purchase Page</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Usage History
                </CardTitle>
                <CardDescription>Track your data consumption over time</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Usage analytics coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
