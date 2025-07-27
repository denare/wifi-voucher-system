import { supabaseAdmin } from "./supabase"

// Currency formatter for Tanzanian Shillings
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("sw-TZ", {
    style: "currency",
    currency: "TZS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// User management functions
export async function getUser(email: string) {
  try {
    const { data, error } = await supabaseAdmin.from("users").select("*").eq("email", email).single()

    if (error && error.code !== "PGRST116") {
      console.error("Database error:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export async function createUser(email: string, passwordHash: string, fullName: string, phone?: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .insert({
        email,
        password_hash: passwordHash,
        full_name: fullName,
        phone: phone || null,
        role: "user",
        status: "active",
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export async function getAllUsers() {
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("id, email, full_name, role, created_at, last_login, status, data_used_mb, phone")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

// Voucher management functions
export async function getVoucherPlans() {
  try {
    const { data, error } = await supabaseAdmin
      .from("voucher_plans")
      .select("*")
      .eq("is_active", true)
      .order("price", { ascending: true })

    if (error) {
      console.error("Database error:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching voucher plans:", error)
    return []
  }
}

export async function createVoucher(code: string, planId: string, userId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("vouchers")
      .insert({
        code,
        plan_id: planId,
        user_id: userId,
        status: "unused",
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Error creating voucher:", error)
    throw error
  }
}

export async function getAllVouchers() {
  try {
    const { data, error } = await supabaseAdmin
      .from("vouchers")
      .select(`
        *,
        voucher_plans!inner(name, data_limit_mb, time_limit_hours, price),
        users!inner(full_name)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return []
    }

    return (
      data?.map((voucher) => ({
        ...voucher,
        plan_name: voucher.voucher_plans.name,
        data_limit_mb: voucher.voucher_plans.data_limit_mb,
        time_limit_hours: voucher.voucher_plans.time_limit_hours,
        price: voucher.voucher_plans.price,
        user_name: voucher.users.full_name,
      })) || []
    )
  } catch (error) {
    console.error("Error fetching vouchers:", error)
    return []
  }
}

export async function getUserVouchers(userId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("vouchers")
      .select(`
        *,
        voucher_plans!inner(name, data_limit_mb, time_limit_hours, price)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return []
    }

    return (
      data?.map((voucher) => ({
        ...voucher,
        plan_name: voucher.voucher_plans.name,
        data_limit_mb: voucher.voucher_plans.data_limit_mb,
        time_limit_hours: voucher.voucher_plans.time_limit_hours,
        price: voucher.voucher_plans.price,
      })) || []
    )
  } catch (error) {
    console.error("Error fetching user vouchers:", error)
    return []
  }
}

// Session management functions
export async function getActiveSessions() {
  try {
    const { data, error } = await supabaseAdmin
      .from("user_sessions")
      .select(`
        *,
        users!inner(full_name),
        vouchers!inner(
          voucher_plans!inner(name)
        )
      `)
      .eq("is_active", true)
      .order("session_start", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return []
    }

    return (
      data?.map((session) => ({
        ...session,
        user_name: session.users.full_name,
        plan_name: session.vouchers.voucher_plans.name,
      })) || []
    )
  } catch (error) {
    console.error("Error fetching active sessions:", error)
    return []
  }
}

// Transaction functions
export async function getRecentTransactions() {
  try {
    const { data, error } = await supabaseAdmin
      .from("payments")
      .select(`
        *,
        users!inner(full_name),
        vouchers!inner(
          voucher_plans!inner(name)
        )
      `)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(20)

    if (error) {
      console.error("Database error:", error)
      return []
    }

    return (
      data?.map((payment) => ({
        ...payment,
        user_name: payment.users.full_name,
        plan_name: payment.vouchers.voucher_plans.name,
      })) || []
    )
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return []
  }
}

// Analytics functions
export async function getDashboardStats() {
  try {
    // Get active users count
    const { count: activeUsers } = await supabaseAdmin
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")

    // Get total vouchers count
    const { count: totalVouchers } = await supabaseAdmin.from("vouchers").select("*", { count: "exact", head: true })

    // Get active vouchers count
    const { count: activeVouchers } = await supabaseAdmin
      .from("vouchers")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")

    // Get active sessions count
    const { count: activeSessions } = await supabaseAdmin
      .from("user_sessions")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)

    // Get today's earnings
    const today = new Date().toISOString().split("T")[0]
    const { data: dailyPayments } = await supabaseAdmin
      .from("payments")
      .select("amount")
      .eq("status", "completed")
      .gte("created_at", today)

    const dailyEarnings = dailyPayments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0

    // Get monthly earnings
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
    const { data: monthlyPayments } = await supabaseAdmin
      .from("payments")
      .select("amount")
      .eq("status", "completed")
      .gte("created_at", monthStart)

    const monthlyEarnings = monthlyPayments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0

    // Get vouchers sold today
    const { count: vouchersSoldToday } = await supabaseAdmin
      .from("vouchers")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today)

    // Get expiring vouchers (next 24 hours)
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    const { count: expiringSoon } = await supabaseAdmin
      .from("vouchers")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")
      .lte("expires_at", tomorrow)

    // Get total data used
    const { data: usersData } = await supabaseAdmin.from("users").select("data_used_mb")

    const totalDataUsed = usersData?.reduce((sum, user) => sum + (user.data_used_mb || 0), 0) || 0

    // Generate daily earnings chart data (last 7 days)
    const dailyEarningsChart = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split("T")[0]

      const { data: dayPayments } = await supabaseAdmin
        .from("payments")
        .select("amount")
        .eq("status", "completed")
        .gte("created_at", dateStr)
        .lt("created_at", new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0])

      const earnings = dayPayments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0

      dailyEarningsChart.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        earnings: earnings,
      })
    }

    return {
      activeUsers: activeUsers || 0,
      totalVouchers: totalVouchers || 0,
      activeVouchers: activeVouchers || 0,
      activeSessions: activeSessions || 0,
      expiringSoon: expiringSoon || 0,
      vouchersSoldToday: vouchersSoldToday || 0,
      totalDataUsed,
      dailyEarnings,
      monthlyEarnings,
      dailyEarningsChart,
      systemUptime: 99.8, // Mock value
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      activeUsers: 0,
      totalVouchers: 0,
      activeVouchers: 0,
      activeSessions: 0,
      expiringSoon: 0,
      vouchersSoldToday: 0,
      totalDataUsed: 0,
      dailyEarnings: 0,
      monthlyEarnings: 0,
      dailyEarningsChart: [],
      systemUptime: 99.8,
    }
  }
}

// Activity feed functions
export async function getActivityFeed() {
  try {
    const { data, error } = await supabaseAdmin
      .from("activity_feed")
      .select(`
        *,
        users(full_name, email)
      `)
      .order("created_at", { ascending: false })
      .limit(20)

    if (error) {
      console.error("Database error:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching activity feed:", error)
    return []
  }
}

// System alerts functions
export async function getSystemAlerts() {
  try {
    const { data, error } = await supabaseAdmin
      .from("system_alerts")
      .select("*")
      .eq("is_dismissed", false)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching system alerts:", error)
    return []
  }
}

// Top performing vouchers
export async function getTopPerformingVouchers() {
  try {
    const { data, error } = await supabaseAdmin
      .from("vouchers")
      .select(`
        voucher_plans!inner(name, price),
        count:id
      `)
      .eq("status", "active")

    if (error) {
      console.error("Database error:", error)
      return []
    }

    // Group by plan and count
    const planCounts = data?.reduce((acc: any, voucher: any) => {
      const planName = voucher.voucher_plans.name
      const price = voucher.voucher_plans.price

      if (!acc[planName]) {
        acc[planName] = { name: planName, price, sold: 0 }
      }
      acc[planName].sold += 1

      return acc
    }, {})

    return Object.values(planCounts || {})
      .sort((a: any, b: any) => b.sold - a.sold)
      .slice(0, 5)
  } catch (error) {
    console.error("Error fetching top performing vouchers:", error)
    return []
  }
}

// Peak usage times
export async function getPeakUsageTimes() {
  try {
    const { data, error } = await supabaseAdmin.from("user_sessions").select("session_start").eq("is_active", true)

    if (error) {
      console.error("Database error:", error)
      return {
        morning: 0,
        afternoon: 0,
        evening: 0,
        night: 0,
      }
    }

    const timeSlots = {
      morning: 0, // 6-12
      afternoon: 0, // 12-18
      evening: 0, // 18-24
      night: 0, // 0-6
    }

    data?.forEach((session) => {
      const hour = new Date(session.session_start).getHours()
      if (hour >= 6 && hour < 12) timeSlots.morning++
      else if (hour >= 12 && hour < 18) timeSlots.afternoon++
      else if (hour >= 18 && hour < 24) timeSlots.evening++
      else timeSlots.night++
    })

    return timeSlots
  } catch (error) {
    console.error("Error fetching peak usage times:", error)
    return {
      morning: 0,
      afternoon: 0,
      evening: 0,
      night: 0,
    }
  }
}

// Payment methods breakdown
export async function getPaymentMethodsBreakdown() {
  try {
    const { data, error } = await supabaseAdmin
      .from("payments")
      .select("payment_method, amount")
      .eq("status", "completed")

    if (error) {
      console.error("Database error:", error)
      return {}
    }

    const breakdown = data?.reduce((acc: any, payment: any) => {
      const method = payment.payment_method
      if (!acc[method]) {
        acc[method] = 0
      }
      acc[method] += Number(payment.amount)
      return acc
    }, {})

    return breakdown || {}
  } catch (error) {
    console.error("Error fetching payment methods breakdown:", error)
    return {}
  }
}

// Export functions
export async function exportUsersCSV() {
  const users = await getAllUsers()
  const csvHeader = "ID,Name,Email,Role,Status,Data Used (MB),Phone,Created At,Last Login\n"
  const csvData = users
    .map(
      (user) =>
        `${user.id},"${user.full_name}","${user.email}",${user.role},${user.status},${user.data_used_mb || 0},"${user.phone || ""}","${user.created_at}","${user.last_login || "Never"}"`,
    )
    .join("\n")

  return csvHeader + csvData
}

export async function exportVouchersCSV() {
  const vouchers = await getAllVouchers()
  const csvHeader = "ID,Code,User,Plan,Status,Data Used (MB),Data Limit (MB),Price (TZS),Expires At,Created At\n"
  const csvData = vouchers
    .map(
      (voucher) =>
        `${voucher.id},"${voucher.code}","${voucher.user_name}","${voucher.plan_name}",${voucher.status},${voucher.data_used_mb},${voucher.data_limit_mb || "Unlimited"},${voucher.price},"${voucher.expires_at || "No expiry"}","${voucher.created_at}"`,
    )
    .join("\n")

  return csvHeader + csvData
}
