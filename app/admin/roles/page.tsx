"use client"

import { useEffect, useState } from "react"

import { useAuth } from "@/components/auth-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

type RoleUser = {
  id: string
  name: string
  email: string
  department?: string
  series?: string
  role: string
}

export default function AdminRolesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [users, setUsers] = useState<RoleUser[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [nextRole, setNextRole] = useState("member")

  useEffect(() => {
    if (!user || user.role !== "super_admin") return
    fetch("/api/admin/all-users", { headers: { "x-user-role": user.role } })
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch((error) => console.error("[v0] Failed to load role users:", error))
  }, [user])

  const saveRole = async (userId: string) => {
    if (!user) return
    const res = await fetch("/api/admin/update-user-role", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-user-role": user.role },
      body: JSON.stringify({ userId, newRole: nextRole }),
    })
    const data = await res.json()
    if (!res.ok) {
      toast({ title: "Error", description: data.error || "Failed to update role", variant: "destructive" })
      return
    }
    setUsers((current) => current.map((item) => (item.id === userId ? { ...item, role: nextRole } : item)))
    setEditingId(null)
    toast({ title: "User role updated" })
  }

  const isBlocked = Boolean(user) && user.role !== "super_admin"

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {isBlocked ? (
          <Card>
            <CardContent className="py-10 text-center text-gray-600">
              Only super admins can access user role management.
            </CardContent>
          </Card>
        ) : (
          <>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Roles</h1>
              <p className="text-gray-600 mt-2">Manage admin and super admin permissions from a dedicated page.</p>
            </div>

            <Card>
              <CardHeader><CardTitle>Approved Users</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {users.map((roleUser) => (
                  <div key={roleUser.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{roleUser.name}</p>
                      <p className="text-sm text-gray-600">{roleUser.email}</p>
                      <p className="text-xs text-gray-500">{roleUser.department || "Department not set"} • {roleUser.series || "Batch not set"}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="capitalize">{roleUser.role.replace("_", " ")}</Badge>
                      {editingId === roleUser.id ? (
                        <>
                          <select value={nextRole} onChange={(e) => setNextRole(e.target.value)} className="border rounded-md px-2 py-1 text-sm">
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                            <option value="super_admin">Super Admin</option>
                          </select>
                          <Button size="sm" onClick={() => saveRole(roleUser.id)}>Save Role</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                        </>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => { setEditingId(roleUser.id); setNextRole(roleUser.role) }}>Change Role</Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
