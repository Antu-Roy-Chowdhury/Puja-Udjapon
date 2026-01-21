import { headers } from "next/headers"

export async function requireAdmin() {
  const role = (await headers()).get("x-user-role")

  if (role !== "admin" && role !== "super_admin") {
    throw new Error("Unauthorized")
  }

  return { role }
}
