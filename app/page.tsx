import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wifi, Shield, BarChart3, CreditCard } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Wifi className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">WiFi Access System</h1>
            </div>
            <div className="space-x-4">
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Secure WiFi Access with Voucher-Based Control</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Purchase data vouchers, track your usage in real-time, and enjoy secure internet access. Perfect for
            businesses, cafes, and public spaces.
          </p>
          <div className="space-x-4">
            <Button size="lg" asChild>
              <Link href="/register">Start Using WiFi</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/admin">Admin Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Our WiFi System?</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <CreditCard className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Easy Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Pay with mobile money (M-Pesa) or card. Quick and secure transactions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle>Usage Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Monitor your data consumption in real-time and get alerts before limits.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle>Secure Access</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Encrypted connections and secure authentication for all users.</CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Wifi className="h-10 w-10 text-orange-600 mb-2" />
                <CardTitle>Flexible Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Choose from various data and time-based plans that suit your needs.</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Wifi className="h-6 w-6 mr-2" />
                <span className="text-lg font-semibold">WiFi Access System</span>
              </div>
              <p className="text-gray-400">
                Providing secure and monitored WiFi access solutions for businesses and public spaces.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/login" className="hover:text-white">
                    User Login
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white">
                    Register
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-white">
                    Admin Panel
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: support@wifisystem.com</li>
                <li>Phone: +254 700 000 000</li>
                <li>Hours: 24/7 Support</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 WiFi Access System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
