"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Users, GraduationCap, Crown, Shield, User, Mail, Phone, MapPin } from "lucide-react"

import { tr } from "date-fns/locale"

interface Member {
  id: string
  name: string
  position: string
  role: "teacher" | "president" | "secretary" | "Senior" | "assistant" | "general" | "organizer" | "developer"
  department?: string
  series?: string
  email?: string
  phone?: string
  location?: string
  avatar?: string
  joinDate: string
  bio?: string
  isAlumni: boolean
}

const departments = ["CSE", "EEE", "ME", "Civil", "Archi", "ETE", "ECE", "IPE", "GCE", "MSE", "CFPE", "BECM", "URP"]
const series = Array.from({ length: 31 }, (_, i) => (1995 + i).toString())

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [seriesFilter, setSeriesFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("current")

  // Mock data - replace with API call
  useEffect(() => {
    const mockMembers: Member[] = [
      // Teachers
      {
        id: "1",
        name: "Kapil Deb",
        position: "Head Teacher & Spiritual Guide",
        role: "teacher",
        series: "1999",
        email: "teacher@temple.org",
        phone: "+880-1234-567890",
        location: "Dhaka, Bangladesh",
        avatar: "/kapil.jpg",
        joinDate: "2010-01-15",
        bio: "Ordained monk with 20+ years of teaching experience in Buddhist philosophy and meditation.",
        isAlumni: false,
      },
      {
        id: "2",
        name: "Kapil Deb",
        position: "Temple President",
        role: "president",
        series: "2020",
        email: "assistant@temple.org",
        phone: "+880-1234-567890",
        location: "Dhaka, Bangladesh",
        avatar: "/kapil.jpg",
        joinDate: "2010-01-15",
        bio: "Ordained monk with 20+ years of teaching experience in Buddhist philosophy and meditation.",

        isAlumni: false,
      },
      {
        id: "3",
        name: "Kapil Deb",
        position: "Temple Secretary",
        role: "secretary",
        series: "2020",
        email: "assistant@temple.org",
        phone: "+880-1234-567890",
        location: "Dhaka, Bangladesh",
        avatar: "/kapil.jpg",
        joinDate: "2010-01-15",
        bio: "Ordained monk with 20+ years of teaching experience in Buddhist philosophy and meditation.",
        isAlumni: false,
      },
      {
        id: "4",
        name: "Kapil Deb",
        position: "Organizer",
        role: "organizer",
        series: "2020",
        email: "assistant@temple.org",
        phone: "+880-1234-567890",
        location: "Dhaka, Bangladesh",
        avatar: "/kapil.jpg",
        joinDate: "2010-01-15",
        bio: "Ordained monk with 20+ years of teaching experience in Buddhist philosophy and meditation.",
        isAlumni: false,
      },
      {
        id: "5",
        name: "Kapil Deb",
        position: "Website Developer",
        role: "developer",
        series: "2020",
        email: "assistant@temple.org",
        phone: "+880-1234-567890",
        location: "Dhaka, Bangladesh",
        avatar: "/kapil.jpg",
        joinDate: "2010-01-15",
        bio: "Ordained monk with 20+ years of teaching experience in Buddhist philosophy and meditation.",
        isAlumni: false,
      },
      {
        id: "6",
        name: "Kapil Deb",
        position: "Co-ordinator",
        role: "secretary",
        series: "2021",
        email: "assistant@temple.org",
        phone: "+880-1234-567890",
        location: "Dhaka, Bangladesh",
        avatar: "/kapil.jpg",
        joinDate: "2010-01-15",
        bio: "Ordained monk with 20+ years of teaching experience in Buddhist philosophy and meditation.",
        isAlumni: false,
      },
      {
        id: "7",
        name: "Kapil Deb",
        position: "Student",
        role: "general",
        series: "2022",
        email: "assistant@temple.org",
        phone: "+880-1234-567890",
        location: "Dhaka, Bangladesh",
        avatar: "/kapil.jpg",
        joinDate: "2010-01-15",
        bio: "Ordained monk with 20+ years of teaching experience in Buddhist philosophy and meditation.",
        isAlumni: false,
      },
      {
        id: "8",
        name: "Kapil Deb",
        position: "Alumni Member",
        role: "Senior",
        series: "2019",
        email: "assistant@temple.org",
        phone: "+880-1234-567890",
        location: "Dhaka, Bangladesh",
        avatar: "/kapil.jpg",
        joinDate: "2010-01-15",
        bio: "Ordained monk with 20+ years of teaching experience in Buddhist philosophy and meditation.",
        isAlumni: true,
      },
      {
        id: "9",
        name: "Kapil Deb",
        position: "Alumni Member",
        role: "Senior",
        series: "2019",
        email: "assistant@temple.org",
        phone: "+880-1234-567890",
        location: "Dhaka, Bangladesh",
        avatar: "/kapil.jpg",
        joinDate: "2010-01-15",
        bio: "Ordained monk with 20+ years of teaching experience in Buddhist philosophy and meditation.",
        isAlumni: true,
      },

      {
        id: "10",
        name: "Kapil Deb",
        position: "Alumni Member",
        role: "Senior",
        series: "2018",
        email: "assistant@temple.org",
        phone: "+880-1234-567890",
        location: "Dhaka, Bangladesh",
        avatar: "/kapil.jpg",
        joinDate: "2010-01-15",
        bio: "Ordained monk with 20+ years of teaching experience in Buddhist philosophy and meditation.",
        isAlumni: true,
      },
      {
        id: "11",
        name: "Kapil Deb",
        position: "Alumni Member",
        role: "Senior",
        series: "2017",
        email: "assistant@temple.org",
        phone: "+880-1234-567890",
        location: "Dhaka, Bangladesh",
        avatar: "/kapil.jpg",
        joinDate: "2010-01-15",
        bio: "Ordained monk with 20+ years of teaching experience in Buddhist philosophy and meditation.",
        isAlumni: true,
      },
      {
        id: "12",
        name: "Kapil Deb",
        position: "student",
        role: "general",
        series: "2023",
        email: "assistant@temple.org",
        phone: "+880-1234-567890",
        location: "Dhaka, Bangladesh",
        avatar: "/kapil.jpg",
        joinDate: "2010-01-15",
        bio: "Ordained monk with 20+ years of teaching experience in Buddhist philosophy and meditation.",
        isAlumni: false,
      },
      {
        id: "13",
        name: "Kapil Deb",
        position: "Student",
        role: "general",
        series: "2023",
        email: "assistant@temple.org",
        phone: "+880-1234-567890",
        location: "Dhaka, Bangladesh",
        avatar: "/kapil.jpg",
        joinDate: "2010-01-15",
        bio: "Ordained monk with 20+ years of teaching experience in Buddhist philosophy and meditation.",
        isAlumni: false,
      },
      {
        id: "14",
        name: "Kapil Deb",
        position: "Alumni Member",
        role: "Senior",
        series: "2016",
        email: "assistant@temple.org",
        phone: "+880-1234-567890",
        location: "Dhaka, Bangladesh",
        avatar: "/kapil.jpg",
        joinDate: "2010-01-15",
        bio: "Ordained monk with 20+ years of teaching experience in Buddhist philosophy and meditation.",
        isAlumni: true,
      },
      {
        id: "15",
        name: "Kapil Deb",
        position: "Professor",
        role: "Senior",
        series: "1995",
        email: "assistant@temple.org",
        phone: "+880-1234-567890",
        location: "Dhaka, Bangladesh",
        avatar: "/kapil.jpg",
        joinDate: "2010-01-15",
        bio: "Ordained monk with 20+ years of teaching experience in Buddhist philosophy and meditation.",
        isAlumni: true,
      },
      
    ]

    setMembers(mockMembers)
    setFilteredMembers(mockMembers)
    setLoading(false)
  }, [])

  // Filter members
  useEffect(() => {
    const filtered = members.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.department?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDepartment = departmentFilter === "all" || member.department === departmentFilter
      const matchesSeries = seriesFilter === "all" || member.series === seriesFilter
      const matchesTab = activeTab === "current" ? !member.isAlumni : member.isAlumni

      return matchesSearch && matchesDepartment && matchesSeries && matchesTab
    })

    // Sort by hierarchy: teachers > president > secretary > senior > assistant > general
    const roleOrder = { teacher: 0, president: 1, secretary: 2, senior: 3, assistant: 4, general: 5 }
    type RoleKey = keyof typeof roleOrder;
    filtered.sort((a, b) => {
      const aRole = a.role.toLowerCase() as RoleKey;
      const bRole = b.role.toLowerCase() as RoleKey;
      const roleComparison = roleOrder[aRole] - roleOrder[bRole];
      if (roleComparison !== 0) return roleComparison
      return a.name.localeCompare(b.name)
    })

    setFilteredMembers(filtered)
  }, [members, searchTerm, departmentFilter, seriesFilter, activeTab])

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "teacher":
        return <GraduationCap className="w-4 h-4" />
      case "president":
        return <Crown className="w-4 h-4" />
      case "secretary":
        return <Shield className="w-4 h-4" />
      case "senior":
        return <Users className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "teacher":
        return "bg-purple-100 text-purple-800"
      case "president":
        return "bg-yellow-100 text-yellow-800"
      case "secretary":
        return "bg-blue-100 text-blue-800"
      case "senior":
        return "bg-green-100 text-green-800"
      case "assistant":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-orange-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-orange-100 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-800 mb-4">Temple Members</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Meet our spiritual teachers, dedicated leadership, and vibrant community members
          </p>
        </div>

        {/* Tabs for Current vs Alumni */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="current">Current Members</TabsTrigger>
            <TabsTrigger value="alumni">Alumni</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={seriesFilter} onValueChange={setSeriesFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by series" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Series</SelectItem>
                    {series.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                <Card key={member.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="text-center pb-4">
                    <Avatar className="w-20 h-20 mx-auto mb-4">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback className="text-lg font-semibold bg-orange-100 text-orange-800">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg font-serif">{member.name}</CardTitle>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Badge className={getRoleColor(member.role)}>
                        {getRoleIcon(member.role)}
                        <span className="ml-1 capitalize">{member.role}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm font-medium text-center text-gray-700">{member.position}</p>

                    {member.department && (
                      <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                        <span className="font-medium">{member.department}</span>
                        {member.series && <span>Series {member.series}</span>}
                      </div>
                    )}

                    {member.bio && <p className="text-sm text-gray-600 text-center line-clamp-3">{member.bio}</p>}

                    <div className="space-y-2 pt-2 border-t">
                      {member.email && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-4 h-4 mr-2 text-orange-500" />
                          <span className="truncate">{member.email}</span>
                        </div>
                      )}
                      {member.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2 text-orange-500" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                      {member.location && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                          <span>{member.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-gray-500 text-center pt-2">
                      Joined {new Date(member.joinDate).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredMembers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No members found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
