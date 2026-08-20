import { NextResponse } from "next/server"
import { authCookie, createSession, demoCredentials } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
    const password = typeof body.password === "string" ? body.password : ""

    if (email !== demoCredentials.email || password !== demoCredentials.password) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 })
    }

    const response = NextResponse.json({
      success: true,
      user: { name: "Aarav Sharma", email: demoCredentials.email, role: "Marine Research Admin" },
    })
    response.cookies.set(authCookie.name, createSession(), authCookie.options)
    return response
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 })
  }
}
