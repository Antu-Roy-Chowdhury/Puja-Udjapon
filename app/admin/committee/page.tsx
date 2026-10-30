"use client"

import { useEffect, useState } from "react"
import { Plus, Search, UserPlus, Trash2, Edit2, ShieldAlert, Award, ArrowUpDown } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

type Member = { id: string; name: string; email?: string; department?: string; series?: string; avatar?: string; position?: string; committee_member_id?: string; display_order?: number }
type Committee = { id: string; year: number; title: string; description?: string; term_start?: string; term_end?: string; members?: Member[] }
const departments = ["CSE", "EEE", "ME", "CE", "Arch", "ETE", "ECE", "IPE", "GCE", "MSE", "CFPE", "BECM", "URP"]

export default function AdminCommitteePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [committees, setCommittees] = useState<Committee[]>([])
  const [committee, setCommittee] = useState<Committee | null>(null)
  const [selectedYear, setSelectedYear] = useState("")
  const [candidates, setCandidates] = useState<Member[]>([])
  const [filters, setFilters] = useState({ department: "all", series: "all", search: "" })
  const [selectedCandidate, setSelectedCandidate] = useState<Member | null>(null)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [assignment, setAssignment] = useState({ position: "Committee Member", displayOrder: "0" })
  const [createOpen, setCreateOpen] = useState(false)
  const [newCommittee, setNewCommittee] = useState({ year: String(new Date().getFullYear()), title: "", description: "", termStart: "", termEnd: "" })
  const [editingCommittee, setEditingCommittee] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const loadCommittees = async (year?: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/committees${year ? `?year=${year}` : ""}`, { cache: "no-store" })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to load committees")
      setCommittees(data.committees || [])
      setCommittee(data.committee || null)
      if (data.committee) setSelectedYear(String(data.committee.year))
    } catch (error) {
      toast({ title: "Unable to load committees", description: error instanceof Error ? error.message : "Please try again", variant: "destructive" })
    } finally { setLoading(false) }
  }

  useEffect(() => { if (user?.role === "super_admin") void loadCommittees() }, [user?.role])
  useEffect(() => {
    if (user?.role !== "super_admin") return
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams()
      if (filters.department !== "all") params.set("department", filters.department)
      if (filters.series !== "all") params.set("series", filters.series)
      if (filters.search) params.set("search", filters.search)
      fetch(`/api/admin/member-candidates?${params}`, { cache: "no-store" }).then((res) => res.json()).then((data) => setCandidates(Array.isArray(data) ? data : []))
    }, 250)
    return () => window.clearTimeout(timer)
  }, [filters, user?.role])

  const performAction = async (body: Record<string, unknown>) => {
    const response = await fetch("/api/admin/committees", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || "Committee update failed")
    return data
  }

  const createCommittee = async () => {
    setSaving(true)
    try {
      const data = await performAction({ action: editingCommittee ? "edit" : "create", committeeId: editingCommittee ? committee?.id : undefined, ...newCommittee, title: newCommittee.title || `${newCommittee.year} Committee` })
      setCreateOpen(false); setEditingCommittee(false); await loadCommittees(String(data.committee.year)); toast({ title: "Committee saved successfully" })
    } catch (error) { toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to save committee", variant: "destructive" }) } finally { setSaving(false) }
  }

  const assignMember = async () => {
    if (!committee || !selectedCandidate) return
    setSaving(true)
    try {
      await performAction({ action: "assign", committeeId: committee.id, memberId: selectedCandidate.id, position: assignment.position, displayOrder: assignment.displayOrder })
      setSelectedCandidate(null); await loadCommittees(selectedYear); toast({ title: "Member assigned successfully" })
    } catch (error) { toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to assign member", variant: "destructive" }) } finally { setSaving(false) }
  }

  const saveAssignment = async (member: Member) => {
    try { 
      await performAction({ action: "update_member", committeeMemberId: member.committee_member_id, position: member.position, displayOrder: member.display_order })
      await loadCommittees(selectedYear)
      setEditingMember(null)
      toast({ title: "Assignment updated" }) 
    } catch (error) { toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to update assignment", variant: "destructive" }) }
  }

  const removeAssignment = async (member: Member) => {
    try { await performAction({ action: "remove", committeeMemberId: member.committee_member_id }); await loadCommittees(selectedYear); toast({ title: "Member removed from committee" }) }
    catch (error) { toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to remove assignment", variant: "destructive" }) }
  }

  if (user && user.role !== "super_admin") {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center bg-gray-50/70">
        <Card className="max-w-md w-xl rounded-2xl border-red-100 shadow-sm bg-white">
          <CardContent className="py-12 text-center space-y-3">
            <ShieldAlert className="w-12 h-12 mx-auto text-red-500" />
            <h2 className="text-lg font-bold text-gray-900">Access Restricted</h2>
            <p className="text-gray-600 text-sm">Only super administrators are authorized to manage committees.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/70 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* Header Title & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold font-serif text-gray-900">Committee Management</h1>
            <p className="mt-1 text-gray-600 text-sm">Create yearly executive committees and assign approved members with custom roles.</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingCommittee(false); setNewCommittee({ year: String(new Date().getFullYear()), title: "", description: "", termStart: "", termEnd: "" }) }} className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-5 shadow-sm">
                <Plus className="mr-2 h-4 w-4" /> New Committee
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl p-6 sm:p-8">
              <DialogHeader><DialogTitle className="font-serif text-2xl font-bold">{editingCommittee ? "Edit Committee" : "Create Yearly Committee"}</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <Label className="text-sm font-semibold">Year *</Label>
                  <Input type="number" disabled={editingCommittee} value={newCommittee.year} onChange={(e) => setNewCommittee({ ...newCommittee, year: e.target.value })} className="rounded-xl mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-semibold">Title</Label>
                  <Input value={newCommittee.title} onChange={(e) => setNewCommittee({ ...newCommittee, title: e.target.value })} placeholder={`${newCommittee.year} Committee`} className="rounded-xl mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-semibold">Description</Label>
                  <Textarea value={newCommittee.description} onChange={(e) => setNewCommittee({ ...newCommittee, description: e.target.value })} placeholder="Optional committee note..." className="rounded-xl mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-3"><label className="text-sm">Term start<Input type="date" value={newCommittee.termStart} onChange={(e) => setNewCommittee({ ...newCommittee, termStart: e.target.value })} /></label><label className="text-sm">Term end<Input type="date" value={newCommittee.termEnd} onChange={(e) => setNewCommittee({ ...newCommittee, termEnd: e.target.value })} /></label></div>
                <Button onClick={createCommittee} disabled={saving} className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full py-6 mt-2">
                  {saving ? "Saving…" : "Save Committee"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Committee Selector Bar */}
        {committees.length > 0 ? (
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-500" />
              <span className="font-semibold text-gray-800 text-sm">Active Committee View:</span>
            </div>
            <Select value={selectedYear} onValueChange={(year) => { setSelectedYear(year); void loadCommittees(year) }}>
              <SelectTrigger className="w-full sm:w-60 rounded-xl border-gray-200"><SelectValue /></SelectTrigger>
              <SelectContent className="rounded-xl">
                {committees.map((item) => <SelectItem key={item.id} value={String(item.year)}>{item.year} Committee ({item.title})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        ) : null}

        {!committee && !loading ? (
          <Card className="rounded-2xl border-gray-100 bg-white shadow-sm">
            <CardContent className="py-16 text-center text-gray-500 font-medium">Create your first yearly committee above to begin assigning members.</CardContent>
          </Card>
        ) : null}

        {committee ? (
          <div className="space-y-8">
            
            {/* Committee Overview Banner */}
            <Card className="rounded-2xl border-gray-100 bg-white shadow-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent pb-4">
                <div className="flex items-center justify-between gap-3"><CardTitle className="font-serif text-2xl text-gray-900">{committee.title}</CardTitle><Button variant="outline" onClick={() => { setEditingCommittee(true); setNewCommittee({ year: String(committee.year), title: committee.title, description: committee.description || "", termStart: committee.term_start?.slice(0, 10) || "", termEnd: committee.term_end?.slice(0, 10) || "" }); setCreateOpen(true) }}>Edit Committee</Button></div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-gray-600 font-light">{committee.description || "No description provided for this term."}</p>
                {(committee.term_start || committee.term_end) && <p className="text-xs text-gray-500 mt-2">Term: {committee.term_start?.slice(0, 10) || "Unspecified"} to {committee.term_end?.slice(0, 10) || "Unspecified"}</p>}
              </CardContent>
            </Card>

            {/* Find & Assign Members Section */}
            <Card className="rounded-2xl border-gray-100 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="font-serif text-xl text-gray-900">Assign Members from Directory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search name or email..." className="pl-10 rounded-xl border-gray-200" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
                  </div>
                  <Select value={filters.department} onValueChange={(value) => setFilters({ ...filters, department: value })}>
                    <SelectTrigger className="rounded-xl border-gray-200"><SelectValue placeholder="Department" /></SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="all">All departments</SelectItem>
                      {departments.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={filters.series} onValueChange={(value) => setFilters({ ...filters, series: value })}>
                    <SelectTrigger className="rounded-xl border-gray-200"><SelectValue placeholder="Series" /></SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="all">All series</SelectItem>
                      {Array.from({ length: new Date().getFullYear() - 1994 }, (_, index) => String(new Date().getFullYear() - index)).map((year) => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* Candidate Selection Grid */}
                <div className="grid gap-3 md:grid-cols-2 pt-2 max-h-[360px] overflow-y-auto pr-1">
                  {candidates.filter((candidate) => !committee.members?.some((member) => member.id === candidate.id)).map((candidate) => (
                    <button 
                      type="button" 
                      key={candidate.id} 
                      onClick={() => { 
                        setSelectedCandidate(candidate); 
                        setAssignment({ position: "Committee Member", displayOrder: String((committee.members?.length || 0) + 1) }) 
                      }} 
                      className="flex items-center gap-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 p-3.5 text-left hover:border-orange-300 hover:bg-orange-50/40 transition-all group"
                    >
                      <Avatar className="h-12 w-12 border border-gray-200 shrink-0">
                        <AvatarImage src={candidate.avatar || "/placeholder.svg"} className="object-cover" />
                        <AvatarFallback className="bg-orange-100 text-orange-800 font-bold">{candidate.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <span className="block truncate font-semibold text-gray-900 group-hover:text-orange-900">{candidate.name}</span>
                        <span className="block text-xs text-gray-500 font-medium">{candidate.department || "—"} • Series {candidate.series || "—"}</span>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                        <UserPlus className="h-4 w-4" />
                      </div>
                    </button>
                  ))}
                </div>
                {candidates.length === 0 ? <p className="py-8 text-center text-sm text-gray-500">No approved members matched these filters.</p> : null}
              </CardContent>
            </Card>

            {/* Currently Assigned Members Visual Grid */}
            <Card className="rounded-2xl border-gray-100 bg-white shadow-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="font-serif text-xl text-gray-900">Assigned Committee Members ({committee.members?.length || 0})</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {committee.members?.map((member) => (
                      <div key={member.committee_member_id} className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <Avatar className="h-14 w-14 border border-gray-200 shrink-0">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} className="object-cover" />
                            <AvatarFallback className="bg-orange-50 text-orange-700 font-bold">{member.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 space-y-1">
                            <h4 className="font-semibold text-gray-900 truncate">{member.name}</h4>
                            <p className="text-xs text-gray-500 font-medium">{member.department || "—"} • Series {member.series || "—"}</p>
                            <div className="flex items-center gap-2 pt-0.5">
                              <Badge className="bg-orange-50 text-orange-700 border border-orange-200 font-semibold text-xs px-2.5 py-0.5 rounded-lg">
                                {member.position || "Member"}
                              </Badge>
                              <span className="text-[11px] text-gray-400 font-medium">Order: #{member.display_order ?? 0}</span>
                            </div>
                          </div>
                        </div>

                        {/* Quick Edit & Delete Actions */}
                        <div className="flex flex-col sm:flex-row gap-1.5 shrink-0">
                          <Button size="sm" variant="outline" onClick={() => setEditingMember(member)} className="rounded-xl border-gray-200 hover:bg-orange-50 hover:text-orange-600">
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline" className="rounded-xl border-red-100 bg-red-50/50 text-red-600 hover:bg-red-100">
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-2xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="font-serif">Remove {member.name}?</AlertDialogTitle>
                                <AlertDialogDescription>This removes the member from {committee.title}. Their general profile remains untouched.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => removeAssignment(member)} className="rounded-xl bg-red-600 hover:bg-red-700">Remove</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {!loading && committee.members?.length === 0 ? <p className="py-12 text-center text-sm text-gray-500">No members have been assigned to this committee yet.</p> : null}
              </CardContent>
            </Card>

          </div>
        ) : null}

        {/* Assign Candidate Dialog */}
        <Dialog open={Boolean(selectedCandidate)} onOpenChange={(open) => !open && setSelectedCandidate(null)}>
          <DialogContent className="rounded-2xl p-6 sm:p-8">
            <DialogHeader><DialogTitle className="font-serif text-2xl font-bold">Assign {selectedCandidate?.name}</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label className="text-sm font-semibold">Role / Position *</Label>
                <Input value={assignment.position} onChange={(e) => setAssignment({ ...assignment, position: e.target.value })} placeholder="President, General Secretary, Member…" className="rounded-xl mt-1" />
              </div>
              <div>
                <Label className="text-sm font-semibold">Display Order Priority</Label>
                <Input type="number" min="0" value={assignment.displayOrder} onChange={(e) => setAssignment({ ...assignment, displayOrder: e.target.value })} className="rounded-xl mt-1" />
                <p className="text-[11px] text-gray-400 mt-1">Lower numbers appear higher on the committee layout (e.g. 1 for President, 2 for Secretaries).</p>
              </div>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full py-6 mt-2" disabled={saving || !assignment.position.trim()} onClick={assignMember}>
                {saving ? "Assigning…" : "Confirm Assignment"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Assigned Member Role/Order Dialog */}
        <Dialog open={Boolean(editingMember)} onOpenChange={(open) => !open && setEditingMember(null)}>
          <DialogContent className="rounded-2xl p-6 sm:p-8">
            <DialogHeader><DialogTitle className="font-serif text-2xl font-bold">Edit Role for {editingMember?.name}</DialogTitle></DialogHeader>
            {editingMember && (
              <div className="space-y-4 pt-2">
                <div>
                  <Label className="text-sm font-semibold">Role / Position *</Label>
                  <Input value={editingMember.position || ""} onChange={(e) => setEditingMember({ ...editingMember, position: e.target.value })} className="rounded-xl mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-semibold">Display Order Priority</Label>
                  <Input type="number" min="0" value={editingMember.display_order ?? 0} onChange={(e) => setEditingMember({ ...editingMember, display_order: Number(e.target.value) })} className="rounded-xl mt-1" />
                </div>
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full py-6 mt-2" onClick={() => saveAssignment(editingMember)}>
                  Save Changes
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </div>
  )
}
