import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/db"
import { verifyPassword, generateToken } from "@/lib/auth"
import { supabase } from "@/lib/supabase";


export async function POST(request: NextRequest) {
  try {
    console.log("Login API called")

    const body = await request.json()
    console.log("Request body:", { email: body.email, hasPassword: !!body.password })

    const { email, password } = body

    if (!email || !password) {
      console.log("Missing email or password")
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    // Get user from database
    console.log("Looking up user:", email)
    const user = await getUser(email)
    console.log("User found:", !!user)

    if (!user) {
      console.log("User not found")
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    console.log("User data:", { id: user.id, email: user.email, role: user.role })
    console.log("Password hash:", user.password_hash)

    // For demo purposes, also check if password is exactly "password"
    if (password === "password") {
      console.log("Using demo password bypass")

      // Generate simple token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      })

      console.log("Login successful for user:", user.email)

      return NextResponse.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
        },
      })
    }

    // Verify password
    console.log("Verifying password with bcrypt")
    const isValidPassword = await verifyPassword(password, user.password_hash)
    console.log("Password valid:", isValidPassword)

    if (!isValidPassword) {
      console.log("Invalid password")
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Generate simple token
    console.log("Generating token")
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    console.log("Login successful for user:", user.email)

    // Return user data and token
    return NextResponse.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
