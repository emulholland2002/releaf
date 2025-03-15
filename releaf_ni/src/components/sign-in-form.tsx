"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export function SigninForm() {
  const router = useRouter()
  const { status } = useSession()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (status === "authenticated") {
      router.refresh()
      router.push("/dashboard")
    }
  }, [status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    console.log("Attempting to sign in...")

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      console.log("Sign in result:", result)

      if (result?.error) {
        console.error("Sign in error:", result.error)
        setError("Invalid email or password")
        setIsLoading(false)
        return
      }

      if (result?.ok) {
        console.log("Sign in successful, redirecting...")
        
        // Important: Reset loading state if navigation fails
        setTimeout(() => {
          if (isLoading) {
            console.log("Navigation seems stuck, resetting loading state")
            setIsLoading(false)
            setError("Redirect failed. Please try navigating to the dashboard manually.")
          }
        }, 5000)
        
        console.log("Refreshing session...")

        // Try to navigate to dashboard
        try {
          // First refresh to ensure session is updated
          router.refresh()
          // Then navigate after a short delay
          setTimeout(() => {
            router.push("/dashboard")
          }, 500)
        } catch (navigationError) {
          console.error("Navigation error:", navigationError)
          setIsLoading(false)
          setError("Failed to redirect. Please try again or navigate manually.")
        }
      }
    } catch (error) {
      console.error("Exception during sign in:", error)
      setError("Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {status === "authenticated" && (
            <Alert>
              <AlertDescription>
                You are signed in! Redirecting to dashboard...
                <Link href="/dashboard" className="ml-2 underline">
                  Click here if not redirected
                </Link>
              </AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading || status === "authenticated"}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}