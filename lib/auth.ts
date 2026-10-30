import { createHash, randomBytes } from "node:crypto"
import { cookies } from "next/headers"

import { getDatabase } from "@/lib/db"

export const SESSION_COOKIE = "puja_session"
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30

export type UserRole = "member" | "admin" | "super_admin"

export type AuthUser = {
  id: string
  name: string
  email: string
  role: UserRole
  approved: boolean
  isApproved: boolean
  department?: string
  series?: string
  bloodGroup?: string
  contact?: string
  photo?: string
  bio?: string
}

export class AuthorizationError extends Error {
  status: number

  constructor(message = "Unauthorized", status = 401) {
    super(message)
    this.name = "AuthorizationError"
    this.status = status
  }
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex")
}

function normalizeUser(row: Record<string, any>): AuthUser {
  const approved = Boolean(row.approved)

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    approved,
    isApproved: approved,
    department: row.department || "",
    series: row.series || "",
    bloodGroup: row.blood_group || "",
    contact: row.contact || "",
    photo: row.photo || "",
    bio: row.bio || "",
  }
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url")
  const tokenHash = hashToken(token)
  const expiresAt = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000)
  const sql = getDatabase()

  await sql`
    INSERT INTO sessions (token_hash, user_id, expires_at)
    VALUES (${tokenHash}, ${userId}, ${expiresAt.toISOString()})
  `

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  })
}

export async function clearSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value

  if (token) {
    const sql = getDatabase()
    await sql`DELETE FROM sessions WHERE token_hash = ${hashToken(token)}`
  }

  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  })
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token) return null

  const sql = getDatabase()
  const rows = await sql`
    SELECT
      u.id,
      u.email,
      p.name,
      p.role,
      p.approved,
      p.department,
      p.series,
      p.photo,
      p.contact,
      p.blood_group,
      p.bio
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    JOIN profiles p ON p.id = u.id
    WHERE s.token_hash = ${hashToken(token)}
      AND s.expires_at > NOW()
    LIMIT 1
  `

  return rows[0] ? normalizeUser(rows[0]) : null
}

export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) throw new AuthorizationError()
  return user
}

export async function requireRole(roles: UserRole[]) {
  const user = await requireUser()
  if (!roles.includes(user.role)) throw new AuthorizationError("Forbidden", 403)
  return user
}

export async function requireAdmin() {
  return requireRole(["admin", "super_admin"])
}
