/**
 * Sign-up Form Component
 *
 * This component provides a complete registration form for new users.
 * It handles form submission, validation, error states, and redirects users
 * to the sign-in page after successful account creation. The component also
 * provides feedback during the registration process.
 */

"use client"

// Type imports
import type React from "react"

// React hooks
import { useState } from "react"

// Next.js hooks and components
import { useRouter } from "next/navigation"
import Link from "next/link"

// UI components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Icons
import { AlertCircle } from "lucide-react"

export function SignupForm() {
  // Next.js router for navigation after successful signup
  const router = useRouter()

  // Form state for user registration data
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // UI state for error handling and loading indicators
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Handle form submission
   * Registers the user with provided information and handles success/error states
   *
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Submit registration data to the API
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      // Parse the API response
      const data = await response.json()
      console.log("API Response:", { status: response.status, data })

      if (!response.ok) {
        // Handle array of validation errors
        if (data.errors && Array.isArray(data.errors)) {
          throw new Error(data.errors.join(", "))
        }
        // Handle single error message
        throw new Error(data.message || "Something went wrong")
      }

      // Redirect to signin page after successful signup
      // The query parameter 'registered=true' can be used to show a success message
      router.push("/signin?registered=true")
    } catch (error) {
      // Handle and display any errors that occur during registration
      console.error("Signup error:", error)
      setError(error instanceof Error ? error.message : "Failed to create account")
    } finally {
      // Reset loading state regardless of outcome
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          {/* Error alert - shown when registration fails */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Name input field */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          {/* Email input field */}
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

          {/* Password input field with minimum length requirement */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
        </CardContent>

        {/* Form actions and sign-in link */}
        <CardFooter className="flex flex-col space-y-4">
          {/* Create account button - disabled during form submission */}
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </Button>

          {/* Sign in link for existing users */}
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
