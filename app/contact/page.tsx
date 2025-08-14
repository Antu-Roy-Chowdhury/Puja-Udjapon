"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Clock, Users, Crown, Shield, Settings, Code } from "lucide-react"
import Image from "next/image"

interface ContactPerson {
  id: string
  name: string
  position: string
  category: "leadership" | "administration" | "technical" | "spiritual"
  email: string
  phone: string
  location?: string
  avatar?: string
  responsibilities: string[]
  availability?: string
}

export default function ContactPage() {
  const [contacts, setContacts] = useState<ContactPerson[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data - replace with API call
  useEffect(() => {
    const mockContacts: ContactPerson[] = [
      // Spiritual Leadership
      {
        id: "1",
        name: "Kapil Deb",
        position: "Head Teacher & Spiritual Guide",
        category: "spiritual",
        email: "spiritual.guide@temple.org",
        phone: "+880-1234-567890",
        location: "Main Temple Hall",
        avatar: "/kapil.jpg",
        responsibilities: [
          "Spiritual guidance and counseling",
          "Dharma teachings and meditation sessions",
          "Religious ceremonies and rituals",
          "Community spiritual development",
        ],
        availability: "Daily 6:00 AM - 8:00 PM",
      },
      {
        id: "2",
        name: "Kapil Deb",
        position: "Meditation Instructor",
        category: "spiritual",
        email: "meditation@temple.org",
        phone: "+880-1234-567891",
        location: "Meditation Hall",
        avatar: "/kapil.jpg",
        responsibilities: [
          "Meditation classes and workshops",
          "Mindfulness training programs",
          "Stress relief and wellness sessions",
          "Youth meditation programs",
        ],
        availability: "Mon-Fri 9:00 AM - 6:00 PM",
      },
      // Temple Leadership
      {
        id: "3",
        name: "Kapil Deb",
        position: "Temple President",
        category: "leadership",
        email: "president@temple.org",
        phone: "+880-1234-567892",
        location: "Administrative Office",
        avatar: "/kapil.jpg",
        responsibilities: [
          "Overall temple administration",
          "Strategic planning and development",
          "Community relations and partnerships",
          "Board meetings and governance",
        ],
        availability: "Mon-Fri 10:00 AM - 5:00 PM",
      },
      {
        id: "4",
        name: "Kapil Deb",
        position: "General Secretary",
        category: "leadership",
        email: "secretary@temple.org",
        phone: "+880-1234-567893",
        location: "Secretary Office",
        avatar: "/kapil.jpg",
        responsibilities: [
          "Member registration and records",
          "Communication and correspondence",
          "Meeting coordination and minutes",
          "Document management",
        ],
        availability: "Mon-Sat 9:00 AM - 6:00 PM",
      },
      // Administration
      {
        id: "5",
        name: "Kapil Deb",
        position: "Event Coordinator",
        category: "administration",
        email: "events@temple.org",
        phone: "+880-1234-567894",
        location: "Event Planning Office",
        avatar: "/kapil.jpg",
        responsibilities: [
          "Festival and ceremony planning",
          "Community event organization",
          "Venue management and logistics",
          "Volunteer coordination",
        ],
        availability: "Tue-Sun 8:00 AM - 7:00 PM",
      },
      {
        id: "6",
        name: "Kapil Deb",
        position: "Finance Manager",
        category: "administration",
        email: "finance@temple.org",
        phone: "+880-1234-567895",
        location: "Finance Office",
        responsibilities: [
          "Financial planning and budgeting",
          "Donation management",
          "Expense tracking and reporting",
          "Audit coordination",
        ],
        availability: "Mon-Fri 9:00 AM - 5:00 PM",
      },
      {
        id: "7",
        name: "Kapil Deb",
        position: "Facilities Manager",
        category: "administration",
        email: "facilities@temple.org",
        phone: "+880-1234-567896",
        location: "Maintenance Office",
        responsibilities: [
          "Building maintenance and repairs",
          "Security and safety management",
          "Utilities and infrastructure",
          "Cleaning and housekeeping coordination",
        ],
        availability: "Daily 7:00 AM - 6:00 PM",
      },
      // Technical Support
      {
        id: "8",
        name: "Kapil Deb",
        position: "IT Administrator",
        category: "technical",
        email: "it.support@temple.org",
        phone: "+880-1234-567897",
        location: "IT Office",
        responsibilities: [
          "Website and system maintenance",
          "Audio/visual equipment support",
          "Online streaming and broadcasts",
          "Digital communication platforms",
        ],
        availability: "Mon-Fri 10:00 AM - 6:00 PM",
      },
    ]

    setContacts(mockContacts)
    setLoading(false)
  }, [])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "spiritual":
        return <Crown className="w-5 h-5" />
      case "leadership":
        return <Shield className="w-5 h-5" />
      case "administration":
        return <Settings className="w-5 h-5" />
      case "technical":
        return <Code className="w-5 h-5" />
      default:
        return <Users className="w-5 h-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "spiritual":
        return "bg-purple-100 text-purple-800"
      case "leadership":
        return "bg-yellow-100 text-yellow-800"
      case "administration":
        return "bg-blue-100 text-blue-800"
      case "technical":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const groupedContacts = contacts.reduce(
    (acc, contact) => {
      if (!acc[contact.category]) {
        acc[contact.category] = []
      }
      acc[contact.category].push(contact)
      return acc
    },
    {} as Record<string, ContactPerson[]>,
  )

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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-gray-800 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Connect with our dedicated team members who are here to serve and support our temple community. Each person
            brings unique expertise and is committed to helping you with your spiritual journey.
          </p>
        </div>

        {/* Emergency Contact */}
        <div className="bg-orange-100 border border-orange-200 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <Phone className="w-6 h-6 text-orange-600 mr-3" />
            <h2 className="text-xl font-semibold text-orange-800">Emergency Contact</h2>
          </div>
          <p className="text-orange-700 mb-2">
            For urgent spiritual guidance or temple emergencies, please call our 24/7 helpline:
          </p>
          <p className="text-2xl font-bold text-orange-800">+880-1234-567800</p>
        </div>

        {/* Contact Categories */}
        {Object.entries(groupedContacts).map(([category, categoryContacts]) => (
          <div key={category} className="mb-12">
            <div className="flex items-center mb-6">
              {getCategoryIcon(category)}
              <h2 className="text-2xl font-serif font-bold text-gray-800 ml-3 capitalize">
                {category === "spiritual"
                  ? "Spiritual Guidance"
                  : category === "leadership"
                    ? "Temple Leadership"
                    : category === "administration"
                      ? "Administration"
                      : "Technical Support"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryContacts.map((contact) => (
                <Card key={contact.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="text-center pb-4">
                    <Avatar className="w-20 h-20 mx-auto mb-4">
                      <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                      <AvatarFallback className="text-lg font-semibold bg-orange-100 text-orange-800">
                        {contact.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg font-serif">{contact.name}</CardTitle>
                    <Badge className={getCategoryColor(contact.category)}>
                      {getCategoryIcon(contact.category)}
                      <span className="ml-1">{contact.position}</span>
                    </Badge>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Contact Information */}
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Mail className="w-4 h-4 mr-3 text-orange-500 flex-shrink-0" />
                        <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline truncate">
                          {contact.email}
                        </a>
                      </div>

                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-3 text-orange-500 flex-shrink-0" />
                        <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                          {contact.phone}
                        </a>
                      </div>

                      {contact.location && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-3 text-orange-500 flex-shrink-0" />
                          <span>{contact.location}</span>
                        </div>
                      )}

                      {contact.availability && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-3 text-orange-500 flex-shrink-0" />
                          <span>{contact.availability}</span>
                        </div>
                      )}
                    </div>

                    {/* Responsibilities */}
                    <div className="pt-3 border-t">
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Responsibilities:</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {contact.responsibilities.map((responsibility, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-1 h-1 bg-orange-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {responsibility}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Contact Buttons */}
                    <div className="flex gap-2 pt-3">
                      <Button
                        size="sm"
                        className="flex-1 bg-orange-500 hover:bg-orange-600"
                        onClick={() => (window.location.href = `mailto:${contact.email}`)}
                      >
                        <Mail className="w-3 h-3 mr-1" />
                        Email
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => (window.location.href = `tel:${contact.phone}`)}
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        Call
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* General Information */}
        <div className="bg-white rounded-lg shadow-md p-8 mt-12">
          <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6 text-center">Temple Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-3">Address</h3>
              <p className="text-gray-600 mb-4">
                Buddha Temple
                <br />
                123 Spiritual Path
                <br />
                Dhaka 1000, Bangladesh
              </p>

              <h3 className="font-semibold text-lg mb-3">Temple Hours</h3>
              <div className="text-gray-600 space-y-1">
                <p>
                  <strong>Daily:</strong> 5:00 AM - 9:00 PM
                </p>
                <p>
                  <strong>Meditation Sessions:</strong> 6:00 AM, 6:00 PM
                </p>
                <p>
                  <strong>Dharma Talks:</strong> Sundays 3:00 PM
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Getting Here</h3>
              <p className="text-gray-600 mb-4">
                The temple is easily accessible by public transportation. Bus routes 12, 25, and 48 stop nearby. Parking
                is available on-site.
              </p>

              <h3 className="font-semibold text-lg mb-3">Donations</h3>
              <p className="text-gray-600">
                Your generous donations help maintain our temple and support community programs. Contact our Finance
                Manager for donation information.
              </p>
            </div>
          </div>
        </div>

        {/* General Information */}
        <div className="bg-white rounded-lg shadow-md p-8 mt-12">
          <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6 text-center">Website Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
            <div>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="text-center pb-4">
                    <Avatar className="w-40 h-40 mx-auto mb-4">
                      <AvatarImage src="/dev.jpg" alt= "antu ROy Chowdhury" />
                      {/* <AvatarFallback className="text-lg font-semibold bg-orange-100 text-orange-800">
                        {contact.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback> */}
                    </Avatar>
                    <CardTitle className="text-lg font-serif">Antu Roy Chowdhury</CardTitle>
                    <Badge className={getCategoryColor("technical")}>
                      {getCategoryIcon("technical")}
                      <span className="ml-1">Developer</span>
                    </Badge>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Contact Information */}
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Mail className="w-4 h-4 mr-3 text-orange-500 flex-shrink-0" />
                        <a href={`mailto:${"anturoychowdhury3@gmail.com"}`} className="text-blue-600 hover:underline truncate">
                          anturoychowdhury3@gmail.com
                        </a>
                      </div>

                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-3 text-orange-500 flex-shrink-0" />
                        <a href={`tel:${"+8801710-907476"}`} className="text-blue-600 hover:underline">
                          +8801710-907476
                        </a>
                      </div>

              

              
                    </div>


                    {/* Contact Buttons */}
                    <div className="flex gap-2 pt-3">
                      <Button
                        size="sm"
                        className="flex-1 bg-orange-500 hover:bg-orange-600"
                        onClick={() => (window.location.href = `mailto:${"anturoychowdhury3@gmail.com"}`)}
                      >
                        <Mail className="w-3 h-3 mr-1" />
                        Email
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => (window.location.href = `tel:${"+8801710-907476"}`)}
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        Call
                      </Button>
                    </div>
                  </CardContent>
                </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
