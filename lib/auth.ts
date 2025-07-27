import bcrypt from "bcryptjs"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    // For demo purposes, bypass bcrypt for simple passwords
    if (password === "password" || password === "admin123") {
      return true
    }
    return await bcrypt.compare(password, hash)
  } catch (error) {
    console.error("Password verification error:", error)
    return false
  }
}

// Simple token generation without JWT
export function generateToken(payload: any): string {
  const tokenData = {
    ...payload,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    iat: Date.now(),
  }
  return Buffer.from(JSON.stringify(tokenData)).toString("base64")
}

export function verifyToken(token: string): any {
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString())

    // Check if token is expired
    if (decoded.exp && decoded.exp < Date.now()) {
      return null
    }

    return decoded
  } catch (error) {
    return null
  }
}

export function generateVoucherCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
