import { getDatabase } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function DevelopersPage() {
  const developers = await getDatabase()`
    SELECT p.id, p.name, p.photo, p.department, p.series, d.designation, d.contribution, d.is_founder
    FROM developer_profiles d JOIN profiles p ON p.id = d.profile_id
    WHERE p.approved = TRUE ORDER BY d.is_founder DESC, d.display_order, p.name`
  const founder = developers.find((person) => person.is_founder)
  return <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fff7ed,white_55%)] py-12">
    <div className="max-w-6xl mx-auto px-4 space-y-8">
      <div className="text-center"><Badge className="bg-orange-100 text-orange-700">Developer Team</Badge><h1 className="font-serif text-4xl font-bold mt-4">Meet the Developer Team</h1></div>
      {founder && <section className="rounded-3xl bg-gradient-to-br from-orange-500 to-amber-400 text-white p-8 text-center shadow-lg">
        <Badge className="bg-white text-orange-700">Founder / Creator</Badge>
        <img src={founder.photo || "/placeholder.svg"} alt={founder.name} className="w-32 h-32 rounded-full object-cover mx-auto my-5 border-4 border-white" />
        <h2 className="font-serif text-3xl font-bold">{founder.name}</h2><p>{founder.designation}</p><p className="mt-3 max-w-2xl mx-auto">{founder.contribution}</p>
      </section>}
      {developers.length === 0 && <p className="text-center text-gray-600">Developer profiles will appear here once assigned.</p>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{developers.filter((person) => !person.is_founder).map((person) => <Card key={person.id} className="border-orange-100"><CardContent className="p-6 text-center"><img src={person.photo || "/placeholder.svg"} alt={person.name} className="w-24 h-24 rounded-full object-cover mx-auto mb-4" /><h2 className="font-serif text-xl font-bold">{person.name}</h2><p className="text-orange-600">{person.designation}</p><p className="text-sm text-gray-600 mt-3">{person.contribution}</p></CardContent></Card>)}</div>
    </div>
  </main>
}
