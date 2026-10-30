"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"

type Member = { id: string; name: string; email: string; photo?: string; designation: string | null; contribution: string | null; display_order: number | null; is_founder: boolean | null }

export default function DeveloperManagementPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [members, setMembers] = useState<Member[]>([])
  const [selectedId, setSelectedId] = useState("")
  const [search, setSearch] = useState("")
  const [designation, setDesignation] = useState("Developer")
  const [contribution, setContribution] = useState("")
  const [displayOrder, setDisplayOrder] = useState(0)
  const [isFounder, setIsFounder] = useState(false)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const load = async () => {
    const res = await fetch("/api/admin/developers", { cache: "no-store" })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Unable to load members")
    setMembers(data)
  }
  useEffect(() => { if (user?.role === "super_admin") load().catch((error) => toast({ title: String(error), variant: "destructive" })).finally(() => setLoading(false)) }, [user?.role])
  const select = (id: string) => {
    setSelectedId(id)
    const member = members.find((item) => item.id === id)
    setDesignation(member?.designation || "Developer")
    setContribution(member?.contribution || "")
    setDisplayOrder(member?.display_order || 0)
    setIsFounder(Boolean(member?.is_founder))
  }
  const submit = async (action: "save" | "remove") => {
    if (!selectedId || busy) return
    setBusy(true)
    try {
      const res = await fetch("/api/admin/developers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, profileId: selectedId, designation, contribution, displayOrder, isFounder }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Unable to update developer")
      await load(); select("")
      toast({ title: action === "save" ? "Developer saved" : "Developer removed" })
    } catch (error) { toast({ title: "Update failed", description: String(error), variant: "destructive" }) }
    finally { setBusy(false) }
  }
  if (user?.role !== "super_admin") return <p className="p-8">Super Admin access required.</p>
  return <main className="max-w-6xl mx-auto px-4 py-8 space-y-6"><div><h1 className="text-3xl font-bold">Developer Management</h1><p className="text-gray-600">Assign approved members. Developer status does not change admin permissions.</p></div>
    <Card><CardContent className="p-6 space-y-4"><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search registered members" />
      <select className="w-full border rounded-md p-2" value={selectedId} onChange={(e) => select(e.target.value)}><option value="">Select a member</option>{members.filter((m) => `${m.name} ${m.email}`.toLowerCase().includes(search.toLowerCase())).map((m) => <option key={m.id} value={m.id}>{m.name} ({m.email}){m.designation ? " — Developer" : ""}</option>)}</select>
      {selectedId && <div className="space-y-3"><Input value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="Designation" /><Textarea value={contribution} onChange={(e) => setContribution(e.target.value)} placeholder="Contribution" /><label className="block text-sm">Display order <Input type="number" min="0" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} /></label><label className="flex gap-2"><input type="checkbox" checked={isFounder} onChange={(e) => setIsFounder(e.target.checked)} /> Founder / Creator</label><div className="flex gap-2"><Button disabled={busy} onClick={() => submit("save")}>Save Developer</Button>{members.find((m) => m.id === selectedId)?.designation && <Button disabled={busy} variant="destructive" onClick={() => submit("remove")}>Remove Developer</Button>}</div></div>}
    </CardContent></Card>
    <div className="space-y-2">{loading && <p>Loading members...</p>}{members.filter((m) => m.designation).sort((a,b) => Number(b.is_founder)-Number(a.is_founder) || (a.display_order || 0)-(b.display_order || 0)).map((m) => <Card key={m.id}><CardContent className="p-4 flex items-center justify-between"><div><strong>{m.name}</strong><p className="text-sm text-gray-600">{m.designation} · {m.contribution}</p></div><div className="flex gap-2">{m.is_founder && <Badge>Founder</Badge>}<Button variant="outline" onClick={() => select(m.id)}>Edit</Button></div></CardContent></Card>)}</div>
  </main>
}
