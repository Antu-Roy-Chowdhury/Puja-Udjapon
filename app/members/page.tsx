"use client"

import { useEffect, useMemo, useState } from "react"
import { Mail, Phone, Search, Users } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Member = {
  id: string
  name: string
  position: string
  department?: string
  series?: string
  email?: string
  phone?: string
  avatar?: string
  joinDate: string
  bio?: string
  isAlumni: boolean
}

const departments = ["CSE", "EEE", "ME", "CE", "Arch", "ETE", "ECE", "IPE", "GCE", "MSE", "CFPE", "BECM", "URP"]
const series = Array.from({ length: 10 }, (_, i) => (20 + i).toString())

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [seriesFilter, setSeriesFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("committee")

  useEffect(() => {
    setLoading(true)
    fetch("/api/members")
      .then((res) => res.json())
      .then((data) => setMembers(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [])

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.department?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDepartment = departmentFilter === "all" || member.department === departmentFilter
      const matchesSeries = seriesFilter === "all" || member.series?.endsWith(seriesFilter)
      const matchesTab = activeTab === "committee" ? !member.isAlumni : member.isAlumni

      return matchesSearch && matchesDepartment && matchesSeries && matchesTab
    })
  }, [members, searchTerm, departmentFilter, seriesFilter, activeTab])

  const groupedMembers = useMemo(() => {
    return filteredMembers.reduce<Record<string, Member[]>>((acc, member) => {
      const group = member.position || "Committee Member"
      if (!acc[group]) acc[group] = []
      acc[group].push(member)
      return acc
    }, {})
  }, [filteredMembers])

  if (loading) {
    return <div className="min-h-screen bg-[#faf7f2]" />
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6 space-y-8">
        <div className="text-center max-w-3xl mx-auto">
          <Badge className="bg-orange-100 text-orange-800 mb-4">Committee Directory</Badge>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">Executive Committee & Members</h1>
          <p className="text-lg text-gray-600">Grouped by committee position, with member photos and contact details for a clearer public directory.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="committee">Committee</TabsTrigger>
            <TabsTrigger value="alumni">Alumni</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6 mt-6">
            <Card>
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search committee..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger><SelectValue placeholder="Filter by department" /></SelectTrigger>
                  <SelectContent><SelectItem value="all">All Departments</SelectItem>{departments.map((dept) => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={seriesFilter} onValueChange={setSeriesFilter}>
                  <SelectTrigger><SelectValue placeholder="Filter by series" /></SelectTrigger>
                  <SelectContent><SelectItem value="all">All Series</SelectItem>{series.map((year) => <SelectItem key={year} value={year}>{year}</SelectItem>)}</SelectContent>
                </Select>
              </CardContent>
            </Card>

            <div className="space-y-8">
              {Object.entries(groupedMembers).map(([position, people]) => (
                <section key={position} className="space-y-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge className="bg-[#efe2c7] text-gray-900 border border-[#d9c7ab]">{position}</Badge>
                    <span className="text-sm text-gray-500">{people.length} member{people.length > 1 ? "s" : ""}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {people.map((member) => (
                      <Card key={member.id} className="border-[#d9c7ab] bg-white shadow-sm">
                        <CardContent className="p-5 space-y-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16 border border-[#eadfcb]">
                              <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                              <AvatarFallback>{member.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-gray-900">{member.name}</h3>
                              <p className="text-sm text-gray-600">{member.department || "Department"} {member.series ? `• ${member.series}` : ""}</p>
                            </div>
                          </div>
                          {member.bio ? <p className="text-sm text-gray-600 line-clamp-3">{member.bio}</p> : null}
                          <div className="space-y-2 text-sm text-gray-600">
                            {member.email ? <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-orange-500" /><span className="truncate">{member.email}</span></div> : null}
                            {member.phone ? <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-orange-500" /><span>{member.phone}</span></div> : null}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {filteredMembers.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-14 h-14 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No members matched the current filters.</p>
              </div>
            ) : null}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
