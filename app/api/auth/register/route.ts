import { type NextRequest, NextResponse } from "next/server"
import { createUser, getUser } from "@/lib/db"
import { hashPassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    console.log("Register API called")

    const body = await request.json()
    console.log("Request body:", {
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      hasPassword: !!body.password,
    })

    const { fullName, email, phone, password } = body

    if (!fullName || !email || !password) {
      console.log("Missing required fields")
      return NextResponse.json({ message: "Full name, email, and password are required" }, { status: 400 })
    }

    // Check if user already exists
    console.log("Checking if user exists:", email)
    const existingUser = await getUser(email)
    if (existingUser) {
      console.log("User already exists")
      return NextResponse.json({ message: "Email already exists" }, { status: 409 })
    }

    // Hash password
    console.log("Hashing password")
    const passwordHash = await hashPassword(password)

    // Create user
    console.log("Creating user")
    const user = await createUser(email, passwordHash, fullName, phone)
    console.log("User created:", user.id)

    // Generate simple token
    console.log("Generating token")
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    console.log("Registration successful for user:", user.email)

    return NextResponse.json({
      message: "Registration successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    })
  } catch (error: any) {
    console.error("Registration error:", error)

    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
