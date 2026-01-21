"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
})

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

const onSubmit = async (values: z.infer<typeof formSchema>) => {
  setIsLoading(true)
  console.log("[v0] Login form submitted with email:", values.email)

  try {
    const result = await login(values.email, values.password)
    console.log("[v0] Login result:", result)

    if (result === "OK") {
      console.log("[v0] Login successful, redirecting to profile")
      toast({
        title: "Login successful",
        description: "Welcome back! Redirecting to your profile...",
      })
      router.push("/profile")
      return
    }

    if (typeof result === "object" && result.status === "PENDING") {
      console.log("[v0] Account pending approval")
      toast({
        title: "Account Pending",
        description: result.error,
        variant: "destructive",
      })
      return
    }

    if (typeof result === "object" && result.status === "INVALID") {
      console.log("[v0] Login failed:", result.error)
      toast({
        title: "Login Failed",
        description: result.error,
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Login Failed",
      description: "An unexpected error occurred.",
      variant: "destructive",
    })
  } catch (error) {
    console.error("[v0] Login submit error:", error)
    toast({
      title: "Error",
      description: "Something went wrong. Please try again.",
      variant: "destructive",
    })
  } finally {
    setIsLoading(false)
  }
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-3xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to your RUET Puja Udjapon account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" placeholder="your@email.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl><Input type="password" placeholder="Enter your password" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              <p className="text-sm text-gray-500 pt-2">Hint: admin@temple.com / admin</p>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
