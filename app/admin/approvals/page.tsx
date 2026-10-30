"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

type PendingUser = { id: string; name: string; email: string; department?: string; series?: string }
type PendingGallery = { id: string; title: string; url: string; description?: string; uploadedBy?: string }

export default function ApprovalsPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState<PendingUser[]>([])
  const [gallery, setGallery] = useState<PendingGallery[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  const load = async () => {
    const responses = await Promise.all([fetch("/api/admin/pending-users", { cache: "no-store" }), fetch("/api/admin/pending-gallery", { cache: "no-store" })])
    const data = await Promise.all(responses.map((res) => res.json()))
    if (!responses.every((res) => res.ok)) throw new Error("Unable to load pending approvals")
    setUsers(data[0]); setGallery(data[1])
  }
  useEffect(() => { load().catch((error) => toast({ title: String(error), variant: "destructive" })).finally(() => setLoading(false)) }, [])
  const act = async (path: string, body: object, id: string, success: string) => {
    if (busy) return
    setBusy(id)
    try {
      const res = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Action failed")
      await load()
      toast({ title: success })
    } catch (error) { toast({ title: "Approval action failed", description: String(error), variant: "destructive" }) }
    finally { setBusy(null) }
  }
  return <main className="max-w-6xl mx-auto px-4 py-8 space-y-6"><div><h1 className="text-3xl font-bold">Approval Panel</h1><p className="text-gray-600">Review new members and gallery submissions.</p></div>
    {loading && <p>Loading approvals...</p>}
    <Card><CardHeader><CardTitle>Pending Members ({users.length})</CardTitle></CardHeader><CardContent className="space-y-4">{!loading && users.length === 0 && <p className="text-gray-600">No pending members.</p>}{users.map((member) => <div key={member.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border rounded-xl p-4"><div><strong>{member.name}</strong><p className="text-sm text-gray-600">{member.email}</p><p className="text-xs text-gray-500">{member.department} · {member.series}</p></div><div className="flex gap-2"><Button disabled={!!busy} onClick={() => act("/api/admin/approve-user", { targetEmail: member.email }, member.id, "Member approved")}>Approve</Button><Button disabled={!!busy} variant="destructive" onClick={() => act("/api/admin/reject-user", { targetEmail: member.email }, member.id, "Member rejected")}>Reject</Button></div></div>)}</CardContent></Card>
    <Card><CardHeader><CardTitle>Pending Gallery ({gallery.length})</CardTitle></CardHeader><CardContent className="space-y-4">{!loading && gallery.length === 0 && <p className="text-gray-600">No pending gallery items.</p>}{gallery.map((item) => <div key={item.id} className="flex flex-col sm:flex-row gap-4 border rounded-xl p-4"><img src={item.url} alt={item.title} className="w-full sm:w-40 h-32 object-cover rounded-lg" /><div className="flex-1"><strong>{item.title}</strong><p className="text-sm text-gray-600">{item.description}</p><p className="text-xs text-gray-500">Uploaded by {item.uploadedBy || "Unknown member"}</p></div><div className="flex gap-2"><Button disabled={!!busy} onClick={() => act("/api/admin/approve-gallery", { id: item.id }, item.id, "Gallery item approved")}>Approve</Button><Button disabled={!!busy} variant="destructive" onClick={() => act("/api/admin/reject-gallery", { id: item.id }, item.id, "Gallery item rejected")}>Reject</Button></div></div>)}</CardContent></Card>
  </main>
}
