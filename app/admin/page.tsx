"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { formatCurrency } from "@/lib/db"
import {
  BarChart3,
  Users,
  DollarSign,
  Wifi,
  LogOut,
  Settings,
  TrendingUp,
  Activity,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  UserX,
  Clock,
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  Download,
  Plus,
  Database,
  MessageSquare,
  ArrowUpRight,
  Zap,
  RefreshCw,
  Eye,
  UserPlus,
  CreditCard,
  Globe,
  TrendingDown,
  Server,
  Smartphone,
  Laptop,
  Tablet,
  Monitor,
  Signal,
  AlertCircle,
  PauseCircle,
  StopCircle,
} from "lucide-react"

interface DashboardStats {
  activeUsers: number
  totalVouchers: number
  activeVouchers: number
  activeSessions: number
  expiringSoon: number
  vouchersSoldToday: number
  totalDataUsed: number
  dailyEarnings: number
  monthlyEarnings: number
  systemUptime: number
  dailyEarningsChart: Array<{ date: string; earnings: number }>
}

interface User {
  id: string
  email: string
  full_name: string
  role: string
  created_at: string
  last_login: string | null
  status: string
  data_used_mb: number
  phone?: string
}

interface Voucher {
  id: string
  code: string
  plan_name: string
  user_name: string
  status: string
  data_used_mb: number
  data_limit_mb: number | null
  expires_at: string | null
  created_at: string
  price: number
}

interface Session {
  id: string
  user_name: string
  plan_name: string
  ip_address: string
  device_type: string
  device_name: string
  session_start: string
  data_consumed_mb: number
  signal_strength: number
  is_active: boolean
}

interface Transaction {
  id: string
  user_name: string
  plan_name: string
  amount: number
  payment_method: string
  status: string
  created_at: string
}

interface ActivityItem {
  id: string
  activity_type: string
  title: string
  description: string
  created_at: string
  users?: { full_name: string; email: string }
}

interface SystemAlert {
  id: string
  alert_type: string
  title: string
  message: string
  severity: string
  created_at: string
}

interface TopVoucher {
  name: string
  price: number
  sold: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    activeUsers: 0,
    totalVouchers: 0,
    activeVouchers: 0,
    activeSessions: 0,
    expiringSoon: 0,
    vouchersSoldToday: 0,
    totalDataUsed: 0,
    dailyEarnings: 0,
    monthlyEarnings: 0,
    systemUptime: 99.8,
    dailyEarningsChart: [],
  })

  const [users, setUsers] = useState<User[]>([])
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([])
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([])
  const [topVouchers, setTopVouchers] = useState<TopVoucher[]>([])
  const [peakUsage, setPeakUsage] = useState({ morning: 0, afternoon: 0, evening: 0, night: 0 })
  const [paymentBreakdown, setPaymentBreakdown] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  // Filter states
  const [userSearchTerm, setUserSearchTerm] = useState("")
  const [voucherSearchTerm, setVoucherSearchTerm] = useState("")
  const [sessionSearchTerm, setSessionSearchTerm] = useState("")
  const [userStatusFilter, setUserStatusFilter] = useState("all")
  const [voucherStatusFilter, setVoucherStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const router = useRouter()

  useEffect(() => {
    fetchDashboardData()
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [
        statsRes,
        usersRes,
        vouchersRes,
        sessionsRes,
        transactionsRes,
        activityRes,
        alertsRes,
        topVouchersRes,
        peakUsageRes,
        paymentBreakdownRes,
      ] = await Promise.all([
        fetch("/api/admin/dashboard-stats"),
        fetch("/api/admin/users"),
        fetch("/api/admin/vouchers"),
        fetch("/api/admin/sessions"),
        fetch("/api/admin/transactions"),
        fetch("/api/admin/activity-feed"),
        fetch("/api/admin/system-alerts"),
        fetch("/api/admin/top-vouchers"),
        fetch("/api/admin/peak-usage"),
        fetch("/api/admin/payment-breakdown"),
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData.users || [])
      }

      if (vouchersRes.ok) {
        const vouchersData = await vouchersRes.json()
        setVouchers(vouchersData.vouchers || [])
      }

      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json()
        setSessions(sessionsData.sessions || [])
      }

      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json()
        setTransactions(transactionsData.transactions || [])
      }

      if (activityRes.ok) {
        const activityData = await activityRes.json()
        setActivityFeed(activityData.activities || [])
      }

      if (alertsRes.ok) {
        const alertsData = await alertsRes.json()
        setSystemAlerts(alertsData.alerts || [])
      }

      if (topVouchersRes.ok) {
        const topVouchersData = await topVouchersRes.json()
        setTopVouchers(topVouchersData.vouchers || [])
      }

      if (peakUsageRes.ok) {
        const peakUsageData = await peakUsageRes.json()
        setPeakUsage(peakUsageData)
      }

      if (paymentBreakdownRes.ok) {
        const paymentData = await paymentBreakdownRes.json()
        setPaymentBreakdown(paymentData.breakdown || {})
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    window.location.href = "/login"
  }

  const handleExportUsers = async () => {
    try {
      const response = await fetch("/api/admin/export/users")
      if (response.ok) {
        const csvData = await response.text()
        const blob = new Blob([csvData], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `users-${new Date().toISOString().split("T")[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Export failed:", error)
    }
  }

  const handleExportVouchers = async () => {
    try {
      const response = await fetch("/api/admin/export/vouchers")
      if (response.ok) {
        const csvData = await response.text()
        const blob = new Blob([csvData], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `vouchers-${new Date().toISOString().split("T")[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Export failed:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any; color: string }> = {
      active: { variant: "default", icon: CheckCircle, color: "bg-green-500" },
      expired: { variant: "destructive", icon: Clock, color: "bg-red-500" },
      suspended: { variant: "secondary", icon: UserX, color: "bg-gray-500" },
      unused: { variant: "outline", icon: Clock, color: "bg-blue-500" },
      exhausted: { variant: "destructive", icon: AlertTriangle, color: "bg-orange-500" },
      completed: { variant: "default", icon: CheckCircle, color: "bg-green-500" },
    }

    const config = variants[status] || variants.active
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDataSize = (mb: number) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)} GB`
    }
    return `${mb} MB`
  }

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case "iphone":
      case "android":
        return <Smartphone className="h-4 w-4" />
      case "laptop":
      case "macbook":
        return <Laptop className="h-4 w-4" />
      case "tablet":
      case "ipad":
        return <Tablet className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  // Filter functions
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
    const matchesStatus = userStatusFilter === "all" || user.status === userStatusFilter
    return matchesSearch && matchesStatus
  })

  const filteredVouchers = vouchers.filter((voucher) => {
    const matchesSearch =
      voucher.code.toLowerCase().includes(voucherSearchTerm.toLowerCase()) ||
      voucher.user_name.toLowerCase().includes(voucherSearchTerm.toLowerCase()) ||
      voucher.plan_name.toLowerCase().includes(voucherSearchTerm.toLowerCase())
    const matchesStatus = voucherStatusFilter === "all" || voucher.status === voucherStatusFilter
    return matchesSearch && matchesStatus
  })

  const filteredSessions = sessions.filter(
    (session) =>
      session.user_name.toLowerCase().includes(sessionSearchTerm.toLowerCase()) ||
      session.ip_address.includes(sessionSearchTerm.toLowerCase()) ||
      session.device_name.toLowerCase().includes(sessionSearchTerm.toLowerCase()),
  )

  // Pagination
  const paginateData = (data: any[], page: number) => {
    const startIndex = (page - 1) * itemsPerPage
    return data.slice(startIndex, startIndex + itemsPerPage)
  }

  const getTotalPages = (dataLength: number) => Math.ceil(dataLength / itemsPerPage)

  // Chart data preparation
  const peakUsageChartData = [
    { time: "Morning (6-12)", users: peakUsage.morning },
    { time: "Afternoon (12-18)", users: peakUsage.afternoon },
    { time: "Evening (18-24)", users: peakUsage.evening },
    { time: "Night (0-6)", users: peakUsage.night },
  ]

  const paymentMethodsChartData = Object.entries(paymentBreakdown).map(([method, amount]) => ({
    method: method.charAt(0).toUpperCase() + method.slice(1),
    amount,
    color: method === "mpesa" ? "#00C851" : method === "card" ? "#007bff" : "#6c757d",
  }))

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Wifi className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse" />
            <div className="absolute inset-0 h-16 w-16 mx-auto border-4 border-muted border-t-primary rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Loading Dashboard</h2>
          <p className="text-muted-foreground">Fetching your business data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-xl mr-4">
                <Wifi className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  WiFi Business Hub
                </h1>
                <p className="text-sm text-muted-foreground">Professional WiFi Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Network Status */}
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 dark:bg-green-950 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">WiFi-Portal-5G</span>
              </div>

              {/* System Alerts */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="relative bg-transparent">
                    <Bell className="h-4 w-4" />
                    {systemAlerts.length > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                        {systemAlerts.length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-3 border-b">
                    <h3 className="font-semibold text-foreground">System Alerts</h3>
                    <p className="text-sm text-muted-foreground">Critical system notifications</p>
                  </div>
                  {systemAlerts.map((alert) => (
                    <DropdownMenuItem key={alert.id} className="flex items-start space-x-3 p-3">
                      <div className="flex-shrink-0 mt-1">
                        {alert.severity === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
                        {alert.severity === "warning" && <AlertTriangle className="h-5 w-5 text-orange-500" />}
                        {alert.severity === "info" && <Info className="h-5 w-5 text-blue-500" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-foreground">{alert.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                        <div className="flex space-x-2 mt-2">
                          <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                            Investigate
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 text-xs">
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <ThemeToggle />
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-card shadow-sm border">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="vouchers" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Vouchers
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Sessions
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Revenue
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Daily Revenue</CardTitle>
                  <DollarSign className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatCurrency(stats.dailyEarnings)}</div>
                  <div className="flex items-center text-xs opacity-80 mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +12.5% vs yesterday
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Active Sessions</CardTitle>
                  <Globe className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.activeSessions}</div>
                  <div className="flex items-center text-xs opacity-80 mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +8.2% vs yesterday
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Vouchers Sold</CardTitle>
                  <CreditCard className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.vouchersSoldToday}</div>
                  <div className="flex items-center text-xs opacity-80 mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +15.3% vs yesterday
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">System Uptime</CardTitle>
                  <Server className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.systemUptime}%</div>
                  <div className="flex items-center text-xs opacity-80 mt-1">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    -0.1% vs yesterday
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Analytics */}
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                    Revenue Overview
                  </CardTitle>
                  <CardDescription>Daily earnings trend over the last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      earnings: {
                        label: "Earnings (TZS)",
                        color: "hsl(var(--primary))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats.dailyEarningsChart}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="date" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="earnings"
                          stroke="hsl(var(--primary))"
                          strokeWidth={3}
                          dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-primary" />
                    Activity Feed
                  </CardTitle>
                  <CardDescription>Recent system activities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[300px] overflow-y-auto">
                  {activityFeed.slice(0, 8).map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-2 hover:bg-muted/50 rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {activity.activity_type === 'login' && <Users className="h-4 w-4 text-blue-500" />}
                        {activity.activity_type === 'purchase' && <CreditCard className="h-4 w-4 text-green-500" />}
                        {activity.activity_type === 'usage_alert' && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                        {activity.activity_type === 'connection' && <Wifi className="h-4 w-4 text-purple-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(activity.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Top Performing Vouchers */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                  Top Performing Vouchers
                </CardTitle>
                <CardDescription>Best selling voucher plans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topVouchers.map((voucher, index) => (
                    <div key={voucher.name} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                          <span className="text-sm font-bold text-primary">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{voucher.name}</p>
                          <p className="text-sm text-muted-foreground">{formatCurrency(voucher.price)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{voucher.sold} sold</p>
                        <p className="text-xs text-muted-foreground">this month</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Panel */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-primary" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-20 flex flex-col items-center justify-center space-y-2">
                    <Plus className="h-6 w-6" />
                    <span className="text-sm">Create Voucher</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent">
                    <Users className="h-6 w-6" />
                    <span className="text-sm">Manage Users</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent">
                    <Server className="h-6 w-6" />
                    <span className="text-sm">System Status</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent">
                    <Download className="h-6 w-6" />
                    <span className="text-sm">Generate Report</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center">
                      <Users className="h-6 w-6 mr-2 text-primary" />
                      User Management
                    </CardTitle>
                    <CardDescription>Manage registered users and their access permissions</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleExportUsers}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search users by name or email..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={userStatusFilter} onValueChange={setUserStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="font-semibold">User</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Data Used</TableHead>
                        <TableHead className="font-semibold">Last Login</TableHead>
                        <TableHead className="font-semibold">Joined</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginateData(filteredUsers, currentPage).map((user) => (
                        <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginateData(filteredUsers, currentPage).map((user) => (
                        <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold">
                                  {getInitials(user.full_name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-foreground">{user.full_name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell>
                            <span className="font-medium">{formatDataSize(user.data_used_mb)}</span>
                          </TableCell>
                          <TableCell>{user.last_login ? formatDate(user.last_login) : "Never"}</TableCell>
                          <TableCell>{formatDate(user.created_at)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Send Message
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <UserX className="h-4 w-4 mr-2" />
                                  Suspend User
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(getTotalPages(filteredUsers.length), currentPage + 1))}
                      disabled={currentPage === getTotalPages(filteredUsers.length)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vouchers">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-6 w-6 mr-2 text-primary" />
                      Voucher Management
                    </CardTitle>
                    <CardDescription>Monitor and manage all vouchers and their usage</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleExportVouchers}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Voucher
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search vouchers by code, user, or plan..."
                      value={voucherSearchTerm}
                      onChange={(e) => setVoucherSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={voucherStatusFilter} onValueChange={setVoucherStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="unused">Unused</SelectItem>
                      <SelectItem value="exhausted">Exhausted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="font-semibold">Voucher Code</TableHead>
                        <TableHead className="font-semibold">User</TableHead>
                        <TableHead className="font-semibold">Plan</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Usage</TableHead>
                        <TableHead className="font-semibold">Expires</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginateData(filteredVouchers, currentPage).map((voucher) => (
                        <TableRow key={voucher.id} className="hover:bg-muted/50 transition-colors">
                          <TableCell>
                            <code className="bg-muted px-3 py-1 rounded-md text-sm font-mono font-semibold">
                              {voucher.code}
                            </code>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                                  {getInitials(voucher.user_name)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{voucher.user_name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{voucher.plan_name}</p>
                              <p className="text-xs text-muted-foreground">{formatCurrency(voucher.price)}</p>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(voucher.status)}</TableCell>
                          <TableCell>
                            {voucher.data_limit_mb ? (
                              <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                  <span className="font-medium">{formatDataSize(voucher.data_used_mb)}</span>
                                  <span className="text-muted-foreground">{formatDataSize(voucher.data_limit_mb)}</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-300"
                                    style={{
                                      width: `${Math.min((voucher.data_used_mb / voucher.data_limit_mb) * 100, 100)}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground font-medium">Unlimited</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {voucher.expires_at ? (
                              <div className="text-sm">
                                <p className="font-medium">{formatDate(voucher.expires_at)}</p>
                                {new Date(voucher.expires_at) < new Date() ? (
                                  <p className="text-xs text-destructive">Expired</p>
                                ) : (
                                  <p className="text-xs text-green-600 dark:text-green-400">Active</p>
                                )}
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">No expiry</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Voucher
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Clock className="h-4 w-4 mr-2" />
                                  Extend Expiry
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Reset Usage
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Deactivate
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, filteredVouchers.length)} of {filteredVouchers.length}{" "}
                    vouchers
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(getTotalPages(filteredVouchers.length), currentPage + 1))}
                      disabled={currentPage === getTotalPages(filteredVouchers.length)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center">
                      <Globe className="h-6 w-6 mr-2 text-primary" />
                      Active Sessions
                    </CardTitle>
                    <CardDescription>Monitor real-time user connections and data usage</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={fetchDashboardData}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search by user name, IP address, or device..."
                      value={sessionSearchTerm}
                      onChange={(e) => setSessionSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="font-semibold">User</TableHead>
                        <TableHead className="font-semibold">Device</TableHead>
                        <TableHead className="font-semibold">IP Address</TableHead>
                        <TableHead className="font-semibold">Plan</TableHead>
                        <TableHead className="font-semibold">Session Start</TableHead>
                        <TableHead className="font-semibold">Data Used</TableHead>
                        <TableHead className="font-semibold">Signal</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSessions.map((session) => (
                        <TableRow key={session.id} className="hover:bg-muted/50 transition-colors">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs">
                                  {getInitials(session.user_name)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{session.user_name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getDeviceIcon(session.device_type)}
                              <span className="text-sm">{session.device_name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                              {session.ip_address}
                            </code>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium text-sm">{session.plan_name}</span>
                          </TableCell>
                          <TableCell>{formatDate(session.session_start)}</TableCell>
                          <TableCell>
                            <span className="font-medium">{formatDataSize(session.data_consumed_mb)}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Signal className="h-4 w-4 text-primary" />
                              <span className="font-medium">{session.signal_strength}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Send Message
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <PauseCircle className="h-4 w-4 mr-2" />
                                  Pause Session
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <StopCircle className="h-4 w-4 mr-2" />
                                  Disconnect
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center">
                      <DollarSign className="h-6 w-6 mr-2 text-primary" />
                      Revenue & Transactions
                    </CardTitle>
                    <CardDescription>Track payments and revenue analytics</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm opacity-90">Today's Revenue</p>
                          <p className="text-2xl font-bold">{formatCurrency(stats.dailyEarnings)}</p>
                        </div>
                        <DollarSign className="h-8 w-8 opacity-80" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm opacity-90">Monthly Revenue</p>
                          <p className="text-2xl font-bold">{formatCurrency(stats.monthlyEarnings)}</p>
                        </div>
                        <TrendingUp className="h-8 w-8 opacity-80" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm opacity-90">Transactions</p>
                          <p className="text-2xl font-bold">{transactions.length}</p>
                        </div>
                        <Activity className="h-8 w-8 opacity-80" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="font-semibold">Customer</TableHead>
                        <TableHead className="font-semibold">Plan</TableHead>
                        <TableHead className="font-semibold">Amount</TableHead>
                        <TableHead className="font-semibold">Payment Method</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id} className="hover:bg-muted/50 transition-colors">
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                                  {getInitials(transaction.user_name)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{transaction.user_name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{transaction.plan_name}</TableCell>
                          <TableCell className="font-bold text-green-600 dark:text-green-400">
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {transaction.payment_method}
                            </Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                          <TableCell>{formatDate(transaction.created_at)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              {/* Peak Usage Times */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                    Peak Usage Times
                  </CardTitle>
                  <CardDescription>User activity throughout the day</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      users: {
                        label: "Active Users",
                        color: "hsl(var(--primary))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={peakUsageChartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="time" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="users" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Payment Methods Breakdown */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-primary" />
                    Payment Methods Breakdown
                  </CardTitle>
                  <CardDescription>Revenue distribution by payment method</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {paymentMethodsChartData.map((method) => (
                        <div key={method.method} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: method.color }}
                            ></div>
                            <span className="font-medium">{method.method}</span>
                          </div>
                          <span className="font-bold text-primary">{formatCurrency(method.amount)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-center">
                      <ChartContainer
                        config={{}}
                        className="h-[250px] w-[250px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={paymentMethodsChartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={5}
                              dataKey="amount"
                            >
                              {paymentMethodsChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip content={<ChartTooltipContent />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bandwidth Usage */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2 text-primary" />
                    Bandwidth Usage
                  </CardTitle>
                  <CardDescription>Current system bandwidth utilization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Bandwidth Used</span>
                      <span className="text-2xl font-bold text-primary">850GB / 1000GB</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-4">
                      <div 
                        className="bg-gradient-to-r from-primary to-primary/80 h-4 rounded-full transition-all duration-300"
                        style={{ width: '85%' }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>85% utilized</span>
                      <span>150GB remaining</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
