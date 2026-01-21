"use client"

import { Checkbox } from "@/components/ui/checkbox"

import { Textarea } from "@/components/ui/textarea"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Heart, TrendingUp } from "lucide-react"

export default function DonatePage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [form, setForm] = useState({
    donor_name: "",
    email: "",
    phone: "",
    amount: "",
    payment_method: "Bkash" as "Bkash" | "Nagad" | "BankAccount" | "Cash",
    transaction_id: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!form.donor_name || !form.amount || !form.transaction_id) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      const amount = parseFloat(form.amount)
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid donation amount",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      const res = await fetch("/api/donations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donor_name: form.donor_name,
          email: form.email || undefined,
          phone: form.phone || undefined,
          amount,
          payment_method: form.payment_method,
          transaction_id: form.transaction_id,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Donation failed")
      }

      toast({
        title: "Thank You!",
        description: "Your donation has been recorded successfully. May blessings be upon you.",
      })

      setForm({
        donor_name: "",
        email: "",
        phone: "",
        amount: "",
        payment_method: "Bkash",
        transaction_id: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process donation",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Make a Donation
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your generous contributions help us maintain and expand our temple activities and serve our community better.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Impact Cards */}
          <Card className="text-center">
            <CardContent className="pt-6">
              <Heart className="w-10 h-10 text-red-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Support Spirituality</h3>
              <p className="text-sm text-gray-600">Help us conduct sacred rituals and ceremonies</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <TrendingUp className="w-10 h-10 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Community Growth</h3>
              <p className="text-sm text-gray-600">Expand programs that serve our members</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Heart className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Social Welfare</h3>
              <p className="text-sm text-gray-600">Support charitable activities and outreach</p>
            </CardContent>
          </Card>
        </div>

        {/* Donation Form */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Donation Information</CardTitle>
              <CardDescription>Fill in your details below to make a donation</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Donor Name */}
                <div>
                  <Label htmlFor="donor_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </Label>
                  <Input
                    id="donor_name"
                    type="text"
                    placeholder="Your name"
                    value={form.donor_name}
                    onChange={(e) => setForm({ ...form, donor_name: e.target.value })}
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+880 1XXX XXXXXX"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                {/* Amount */}
                <div>
                  <Label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (BDT) *
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="1000"
                    min="1"
                    step="1"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    required
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <Label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method *
                  </Label>
                  <Select
                    value={form.payment_method}
                    onValueChange={(value) =>
                      setForm({
                        ...form,
                        payment_method: value as "Bkash" | "Nagad" | "BankAccount" | "Cash",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bkash">bKash</SelectItem>
                      <SelectItem value="Nagad">Nagad</SelectItem>
                      <SelectItem value="BankAccount">Bank Transfer</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Transaction ID */}
                <div>
                  <Label htmlFor="transaction_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction ID / Reference *
                  </Label>
                  <Input
                    id="transaction_id"
                    type="text"
                    placeholder="Your transaction reference"
                    value={form.transaction_id}
                    onChange={(e) => setForm({ ...form, transaction_id: e.target.value })}
                    required
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {isLoading ? "Processing..." : "Complete Donation"}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Your donation is secure and will be processed immediately.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
