"use client"

import React, { useState } from "react"
import { Heart, TrendingUp } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

const suggestedAmounts = [500, 1000, 2000, 5000]

export default function DonatePage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({ donor_name: "", email: "", phone: "", amount: "", payment_method: "bkash" as "bkash" | "nagad" | "bank_transfer" | "cash", transaction_id: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!form.donor_name || !form.amount || !form.transaction_id) {
        toast({ title: "Validation Error", description: "Please fill in all required fields", variant: "destructive" })
        return
      }

      const amount = parseFloat(form.amount)
      if (isNaN(amount) || amount <= 0) {
        toast({ title: "Invalid Amount", description: "Please enter a valid donation amount", variant: "destructive" })
        return
      }

      const res = await fetch("/api/donation/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donor_name: form.donor_name, email: form.email || undefined, phone: form.phone || undefined, amount, payment_method: form.payment_method, transaction_id: form.transaction_id }),
      })

      const contentType = res.headers.get("content-type") || ""
      const data = contentType.includes("application/json") ? await res.json() : { error: "Unexpected server response" }
      if (!res.ok) throw new Error(data.error || "Donation failed")

      toast({ title: "Thank You!", description: "Your donation has been recorded successfully. May blessings be upon you." })
      setForm({ donor_name: "", email: "", phone: "", amount: "", payment_method: "bkash", transaction_id: "" })
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to process donation", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-5 lg:px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">Make a Donation</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Your contribution helps us maintain puja arrangements, support cultural programs, and keep community activities running smoothly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center"><CardContent className="pt-6"><Heart className="w-10 h-10 text-red-500 mx-auto mb-3" /><h3 className="font-semibold mb-2">Support Puja</h3><p className="text-sm text-gray-600">Help maintain rituals, festival arrangements, and sacred observances.</p></CardContent></Card>
          <Card className="text-center"><CardContent className="pt-6"><TrendingUp className="w-10 h-10 text-green-500 mx-auto mb-3" /><h3 className="font-semibold mb-2">Support Growth</h3><p className="text-sm text-gray-600">Strengthen community programs, events, and student participation.</p></CardContent></Card>
          <Card className="text-center"><CardContent className="pt-6"><Heart className="w-10 h-10 text-yellow-500 mx-auto mb-3" /><h3 className="font-semibold mb-2">Support Welfare</h3><p className="text-sm text-gray-600">Contribute to outreach, care, and shared community needs.</p></CardContent></Card>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Donation Information</CardTitle>
              <CardDescription>Submit your donation reference after completing the payment.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="donor_name" className="block text-sm font-medium text-gray-700 mb-2">Full Name *</Label>
                  <Input id="donor_name" type="text" placeholder="Your name" value={form.donor_name} onChange={(e) => setForm({ ...form, donor_name: e.target.value })} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</Label>
                    <Input id="email" type="email" placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+880 1XXX XXXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">Amount (BDT) *</Label>
                  <Input id="amount" type="number" placeholder="1000" min="1" step="1" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {suggestedAmounts.map((amount) => <Button key={amount} type="button" variant="outline" size="sm" onClick={() => setForm({ ...form, amount: String(amount) })}>BDT {amount}</Button>)}
                  </div>
                </div>
                <div>
                  <Label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</Label>
                  <Select value={form.payment_method} onValueChange={(value) => setForm({ ...form, payment_method: value as typeof form.payment_method })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bkash">bKash</SelectItem>
                      <SelectItem value="nagad">Nagad</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="transaction_id" className="block text-sm font-medium text-gray-700 mb-2">Transaction ID / Reference *</Label>
                  <Input id="transaction_id" type="text" placeholder="Enter the payment reference you received" value={form.transaction_id} onChange={(e) => setForm({ ...form, transaction_id: e.target.value })} required />
                </div>
                <div className="rounded-2xl bg-orange-50 border border-orange-100 p-4 text-sm text-gray-600">
                  Submit the form after sending the donation.
                </div>
                <Button type="submit" disabled={isLoading} className="w-full bg-orange-500 hover:bg-orange-600 text-white">{isLoading ? "Processing..." : "Complete Donation"}</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
