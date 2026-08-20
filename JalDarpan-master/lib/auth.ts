import { createHmac, timingSafeEqual } from "crypto"
import { cookies } from "next/headers"

const COOKIE_NAME = "marlin_session"
const SESSION_TTL = 1000 * 60 * 60 * 8
const DEMO_USER = {
  id: "usr_marlin_admin",
  name: "Aarav Sharma",
  email: "admin@marlin.network",
  role: "Marine Research Admin",
}

function getSecret() {
  return process.env.AUTH_SECRET || "marlin-local-development-secret"
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex")
}

export function createSession() {
  const payload = Buffer.from(JSON.stringify({ user: DEMO_USER, exp: Date.now() + SESSION_TTL })).toString("base64url")
  return `${payload}.${sign(payload)}`
}

export function getSessionUser() {
  const token = cookies().get(COOKIE_NAME)?.value
  if (!token) return null

  const [payload, signature] = token.split(".")
  if (!payload || !signature) return null

  const expected = sign(payload)
  const valid = signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  if (!valid) return null

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"))
    return session.exp > Date.now() ? session.user : null
  } catch {
    return null
  }
}

export const authCookie = {
  name: COOKIE_NAME,
  options: {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL / 1000,
  },
}

export const demoCredentials = {
  email: DEMO_USER.email,
  password: "Marlin@123",
}
