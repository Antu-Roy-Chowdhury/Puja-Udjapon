"use client"

import { useEffect, useMemo, useState } from "react"

import { useAuth } from "@/components/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

type CommitteeMember = {
  id: string
  name: string
  email: string
  department?: string
  series?: string
  role: string
  position: string
  phone?: string
  photo?: string
}

export default function AdminCommitteePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [members, setMembers] = useState<CommitteeMember[]>([])
  const [savingId, setSavingId] = useState<string | null>(null)

  useEffect(() => {
    if (!user || user.role !== "super_admin") return
    fetch("/api/admin/all-users", { headers: { "x-user-role": user.role } })
      .then((res) => res.json())
      .then((data) => setMembers(Array.isArray(data) ? data : []))
      .catch((error) => console.error("[v0] Failed to load committee members:", error))
  }, [user])

  const sortedMembers = useMemo(() => [...members].sort((a, b) => (a.position || "").localeCompare(b.position || "") || a.name.localeCompare(b.name)), [members])

  const updateDraft = (id: string, field: keyof CommitteeMember, value: string) => {
    setMembers((current) => current.map((member) => (member.id === id ? { ...member, [field]: value } : member)))
  }

  const saveMember = async (member: CommitteeMember) => {
    if (!user) return
    setSavingId(member.id)
    try {
      const res = await fetch("/api/admin/update-member", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-role": user.role },
        body: JSON.stringify({ userId: member.id, position: member.position, department: member.department, series: member.series, phone: member.phone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save committee entry")
      toast({ title: "Committee entry updated" })
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to save committee entry", variant: "destructive" })
    } finally {
      setSavingId(null)
    }
  }

  const isBlocked = Boolean(user) && user.role !== "super_admin"

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {isBlocked ? (
          <Card>
            <CardContent className="py-10 text-center text-gray-600">
              Only super admins can access committee assignment.
            </CardContent>
          </Card>
        ) : (
          <>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Committee Assignment</h1>
              <p className="text-gray-600 mt-2">Use the cards below to edit committee positions, departments, series, and member contact info.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedMembers.map((member) => (
                <Card key={member.id} className="shadow-sm border-gray-200">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-16 w-16 border">
                      <AvatarImage src={member.photo || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>{member.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Input value={member.position || ""} onChange={(e) => updateDraft(member.id, "position", e.target.value)} placeholder="Committee position" />
                    <div className="grid grid-cols-2 gap-3">
                      <Input value={member.department || ""} onChange={(e) => updateDraft(member.id, "department", e.target.value)} placeholder="Department" />
                      <Input value={member.series || ""} onChange={(e) => updateDraft(member.id, "series", e.target.value)} placeholder="Series" />
                    </div>
                    <Input value={member.phone || ""} onChange={(e) => updateDraft(member.id, "phone", e.target.value)} placeholder="Phone" />
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs text-gray-500">Role: {member.role.replace("_", " ")}</span>
                      <Button onClick={() => saveMember(member)} disabled={savingId === member.id}>{savingId === member.id ? "Saving..." : "Save"}</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
