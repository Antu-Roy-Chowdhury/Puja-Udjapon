"use client"

import { useEffect, useMemo, useState } from "react"
import { Mail, Phone, Search, Users, Calendar, Award } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Member = {
  id: string; name: string; position: string; department?: string; series?: string
  email?: string; phone?: string; avatar?: string; bio?: string; isAlumni?: boolean
  display_order?: number
}
type CommitteeSummary = { id: string; year: number; title: string; description?: string }
type Committee = CommitteeSummary & { members: Member[] }

export default function MembersPage() {
  const [committees, setCommittees] = useState<CommitteeSummary[]>([])
  const [committee, setCommittee] = useState<Committee | null>(null)
  const [alumni, setAlumni] = useState<Member[]>([])
  const [selectedYear, setSelectedYear] = useState("")
  const [activeTab, setActiveTab] = useState("committee")
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [seriesFilter, setSeriesFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    Promise.all([fetch("/api/committees").then((res) => res.json()), fetch("/api/members?alumni=true").then((res) => res.json())])
      .then(([committeeData, alumniData]) => {
        if (committeeData.error) throw new Error(committeeData.error)
        const sortedCommittees = (committeeData.committees || []).sort((a: CommitteeSummary, b: CommitteeSummary) => b.year - a.year)
        setCommittees(sortedCommittees)
        setCommittee(committeeData.committee || null)
        setSelectedYear(committeeData.committee ? String(committeeData.committee.year) : "")
        setAlumni(Array.isArray(alumniData) ? alumniData : [])
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load members"))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedYear || committee?.year === Number(selectedYear)) return
    setLoading(true)
    fetch(`/api/committees?year=${selectedYear}`)
      .then((res) => res.json())
      .then((data) => setCommittee(data.committee || null))
      .catch(() => setError("Unable to load the selected committee"))
      .finally(() => setLoading(false))
  }, [selectedYear, committee?.year])

  const sourceMembers = activeTab === "committee" ? committee?.members || [] : alumni
  
  const departments = useMemo(() => [...new Set(sourceMembers.map((m) => m.department).filter(Boolean) as string[])].sort(), [sourceMembers])
  const seriesOptions = useMemo(() => [...new Set(sourceMembers.map((m) => m.series).filter(Boolean) as string[])].sort().reverse(), [sourceMembers])
  
  const filteredMembers = useMemo(() => sourceMembers.filter((member) => {
    const query = searchTerm.toLowerCase()
    return (!query || member.name.toLowerCase().includes(query) || member.position.toLowerCase().includes(query) || member.department?.toLowerCase().includes(query)) &&
      (departmentFilter === "all" || member.department === departmentFilter) &&
      (seriesFilter === "all" || member.series === seriesFilter)
  }), [sourceMembers, searchTerm, departmentFilter, seriesFilter])

  // Group by display_order / position, and sort members within each group by series (descending)
  const sortedAndGroupedMembers = useMemo(() => {
    // First, sort all filtered members by display_order (ascending), then series (descending)
    const sorted = [...filteredMembers].sort((a, b) => {
      const orderA = a.display_order ?? 999
      const orderB = b.display_order ?? 999
      if (orderA !== orderB) return orderA - orderB
      return Number(b.series || 0) - Number(a.series || 0)
    })

    const groups: { position: string; members: Member[]; order: number }[] = []
    const map = new Map<string, { position: string; members: Member[]; order: number }>()

    for (const member of sorted) {
      const pos = member.position || "Committee Member"
      const order = member.display_order ?? 999
      // Group key combines position and exact display order so members sharing the same order appear together
      const key = `${order}-${pos}`
      
      if (!map.has(key)) {
        const groupObj = { position: pos, members: [], order }
        map.set(key, groupObj)
        groups.push(groupObj)
      }
      map.get(key)!.members.push(member)
    }

    // Sort groups by display order
    return groups.sort((a, b) => a.order - b.order)
  }, [filteredMembers])

  return (
    <div className="min-h-screen bg-[#faf7f2] py-10 sm:py-14">
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <Badge className="bg-orange-100 text-orange-800 border border-orange-200 px-3 py-1 rounded-full font-semibold">Committee Directory</Badge>
          <h1 className="font-serif text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl tracking-tight">Executive Committee & Members</h1>
          <p className="text-base text-gray-600 sm:text-lg font-light">Explore each year’s executive panel and leadership structure with verified member profiles.</p>
        </div>

        <Tabs value={activeTab} onValueChange={(tab) => { setActiveTab(tab); setDepartmentFilter("all"); setSeriesFilter("all") }} className="space-y-6">
          <TabsList className="mx-auto grid w-full max-w-sm grid-cols-2 rounded-2xl bg-gray-200/70 p-1">
            <TabsTrigger value="committee" className="rounded-xl font-medium">Committees</TabsTrigger>
            <TabsTrigger value="alumni" className="rounded-xl font-medium">Alumni</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6 focus-visible:outline-none">
            
            {/* Interactive Committee Year Selector Bar */}
            {activeTab === "committee" && committees.length > 0 ? (
              <div className="bg-white p-6 rounded-2xl border border-[#eadfcb] shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Award className="w-5 h-5 text-orange-500" />
                      {committee?.title || "Executive Committee"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">{committee?.description || "Select a year below to view past executive panels"}</p>
                  </div>
                  <div className="w-full sm:w-auto">
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger className="w-full sm:w-48 rounded-xl border-[#eadfcb]">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {committees.map((item) => (
                          <SelectItem key={item.id} value={String(item.year)}>{item.year} Committee</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Quick-Click Year Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Years:
                  </span>
                  {committees.map((item) => {
                    const isSelected = String(item.year) === selectedYear
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedYear(String(item.year))}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all shrink-0 border ${
                          isSelected 
                            ? "bg-orange-500 text-white border-orange-500 shadow-sm" 
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700"
                        }`}
                      >
                        {item.year}
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : null}

            {/* Filter & Search Bar */}
            <Card className="rounded-2xl border-[#eadfcb] shadow-sm bg-white">
              <CardContent className="grid grid-cols-1 gap-3 p-4 sm:p-5 md:grid-cols-3">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    aria-label="Search members" 
                    placeholder="Search by name or position..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="pl-10 rounded-xl border-gray-200" 
                  />
                </div>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="rounded-xl border-gray-200"><SelectValue placeholder="Department" /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All departments</SelectItem>
                    {departments.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={seriesFilter} onValueChange={setSeriesFilter}>
                  <SelectTrigger className="rounded-xl border-gray-200"><SelectValue placeholder="Series" /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All series</SelectItem>
                    {seriesOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Content Display / Loading / Error */}
            {loading ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-56 rounded-2xl" />)}
              </div>
            ) : error ? (
              <Card className="rounded-2xl border-red-100 bg-red-50/50"><CardContent className="py-12 text-center text-red-600 font-medium">{error}</CardContent></Card>
            ) : (
              <div className="space-y-10">
                {sortedAndGroupedMembers.map(({ position, members }) => (
                  <section key={`${position}-${members[0]?.display_order}`} className="space-y-4">
                    <div className="flex items-center gap-3 border-b border-[#eadfcb] pb-2">
                      <Badge className="border border-[#d9c7ab] bg-[#efe2c7] text-gray-900 px-3.5 py-1 font-bold rounded-lg text-sm uppercase tracking-wide">
                        {position}
                      </Badge>
                      <span className="text-xs font-semibold text-gray-500">{members.length} member{members.length === 1 ? "" : "s"}</span>
                    </div>
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                      {members.map((member) => <MemberCard key={member.id} member={member} />)}
                    </div>
                  </section>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredMembers.length === 0 ? (
              <Card className="rounded-2xl border-[#eadfcb] bg-white shadow-sm">
                <CardContent className="py-16 text-center space-y-3">
                  <Users className="mx-auto h-12 w-12 text-orange-400 stroke-[1.5]" />
                  <p className="text-gray-800 font-semibold text-lg">No members found.</p>
                  <p className="text-gray-500 text-sm">
                    {activeTab === "committee" && committees.length === 0 
                      ? "No yearly committee has been published yet." 
                      : "No members matched your search or filter criteria."}
                  </p>
                </CardContent>
              </Card>
            ) : null}

          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function MemberCard({ member }: { member: Member }) {
  return (
    <Card className="rounded-2xl border-[#eadfcb] bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border border-[#eadfcb] shrink-0 shadow-sm">
            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} className="object-cover" />
            <AvatarFallback className="bg-orange-50 text-orange-700 font-bold">
              {member.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 space-y-0.5">
            <h3 className="font-bold text-gray-900 truncate text-base">{member.name}</h3>
            <p className="text-xs font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md inline-block">
              {member.position}
            </p>
            <p className="text-sm text-gray-600 truncate pt-0.5">
              {member.department || "Department"}{member.series ? ` • Series ${member.series}` : ""}
            </p>
          </div>
        </div>

        {member.bio ? <p className="line-clamp-2 text-xs text-gray-600 font-light italic">{member.bio}</p> : null}

        <div className="space-y-1.5 text-xs text-gray-600 pt-3 border-t border-gray-100">
          {member.email ? (
            <div className="flex items-center gap-2 truncate">
              <Mail className="h-3.5 w-3.5 shrink-0 text-orange-500" />
              <span className="truncate">{member.email}</span>
            </div>
          ) : null}
          {member.phone ? (
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 shrink-0 text-orange-500" />
              <span>{member.phone}</span>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}