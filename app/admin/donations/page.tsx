"use client"

import { useEffect, useState } from "react"

import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type DonationStats = {
  totalDonations: number
  totalAmount: number
  averageDonation: number
}

type DonationItem = {
  id: string
  donor_name: string
  amount: number
  payment_method: string
  transaction_id: string
  status: string
  created_at: string
}

export default function AdminDonationsPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DonationStats>({ totalDonations: 0, totalAmount: 0, averageDonation: 0 })
  const [donations, setDonations] = useState<DonationItem[]>([])

  useEffect(() => {
    if (user?.role !== "super_admin") return
    Promise.all([fetch("/api/donation/stats"), fetch("/api/donation/list?limit=100")])
      .then(async ([statsRes, listRes]) => {
        const statsData = await statsRes.json()
        const listData = await listRes.json()
        setStats({ totalDonations: statsData.totalDonations || 0, totalAmount: statsData.totalAmount || 0, averageDonation: Number(statsData.averageDonation || 0) })
        setDonations(Array.isArray(listData.data) ? listData.data : [])
      })
      .catch((error) => console.error("[v0] Failed to load donations:", error))
  }, [user?.role])

  if (user?.role !== "super_admin") {
    return <div className="min-h-screen bg-gray-50 py-8"><div className="max-w-4xl mx-auto px-4 sm:px-5 lg:px-6"><Card><CardContent className="p-8 text-center text-gray-500">Only super admins can access donation management.</CardContent></Card></div></div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Donation Management</h1>
          <p className="text-gray-600 mt-2">Review donation totals and submitted references.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardHeader><CardTitle>Total Donations</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{stats.totalDonations}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Total Amount</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">BDT {stats.totalAmount.toFixed(2)}</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Average Donation</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">BDT {stats.averageDonation.toFixed(2)}</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Submitted Donations</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {donations.map((donation) => (
              <div key={donation.id} className="rounded-lg border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="font-medium text-gray-900">{donation.donor_name}</p>
                  <p className="text-sm text-gray-500">{donation.payment_method} • {donation.transaction_id}</p>
                </div>
                <div className="text-sm text-gray-600 md:text-right">
                  <p className="font-semibold text-gray-900">BDT {Number(donation.amount || 0).toFixed(2)}</p>
                  <p className="capitalize">{donation.status || "pending"}</p>
                </div>
              </div>
            ))}
            {donations.length === 0 ? <p className="text-sm text-gray-500">No donation records found yet.</p> : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
