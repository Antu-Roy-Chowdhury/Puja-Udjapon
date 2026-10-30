import { redirect } from "next/navigation"

import { AdminShell } from "@/components/admin-shell"
import { getCurrentUser } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect("/login?returnTo=/admin")
  if (user.role !== "admin" && user.role !== "super_admin") redirect("/")
  return <AdminShell>{children}</AdminShell>
}
