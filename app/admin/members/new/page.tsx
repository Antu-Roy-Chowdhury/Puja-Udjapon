"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function AddMemberPage() {
  const { toast } = useToast()
  const [form, setForm] = useState({ name: "", email: "", department: "", series: "", phone: "", bio: "" })
  const [saving, setSaving] = useState(false)
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }))
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (saving) return
    setSaving(true)
    try {
      const res = await fetch("/api/admin/members", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Unable to add member")
      toast({ title: "Member added", description: data.linkedExistingAccount ? "Linked to the existing approved account." : "Added as a directory member without creating a login account." })
      setForm({ name: "", email: "", department: "", series: "", phone: "", bio: "" })
    } catch (error) { toast({ title: "Unable to add member", description: String(error), variant: "destructive" }) }
    finally { setSaving(false) }
  }
  return <main className="max-w-3xl mx-auto px-4 py-8"><Card><CardHeader><CardTitle className="text-2xl">Add Member</CardTitle><p className="text-sm text-gray-600">Existing approved accounts are linked. New directory members do not receive login access.</p></CardHeader><CardContent><form onSubmit={submit} className="space-y-4"><label className="block">Full name *<Input required maxLength={150} value={form.name} onChange={(e) => update("name", e.target.value)} /></label><label className="block">Email *<Input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} /></label><div className="grid sm:grid-cols-2 gap-4"><label>Department<Input value={form.department} onChange={(e) => update("department", e.target.value)} /></label><label>Series / Batch<Input value={form.series} onChange={(e) => update("series", e.target.value)} /></label></div><label className="block">Phone<Input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} /></label><label className="block">Bio<Textarea value={form.bio} onChange={(e) => update("bio", e.target.value)} /></label><Button type="submit" disabled={saving}>{saving ? "Adding..." : "Add Member"}</Button></form></CardContent></Card></main>
}
