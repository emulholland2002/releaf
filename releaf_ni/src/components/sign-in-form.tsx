/**
 * Sign-in Form Component
 *
 * This component provides a complete authentication form for users to sign in.
 * It handles form submission, validation, error states, and redirects authenticated
 * users to the dashboard. The component also provides feedback during the authentication
 * process and links to related authentication pages.
 */

"use client"

// Type imports
import type React from "react"

// React hooks
import { useState, useEffect } from "react"

// Next.js hooks and components
import { useRouter } from "next/navigation"
import Link from "next/link"

// Authentication hooks from NextAuth
import { signIn, useSession } from "next-auth/react"

// UI components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Icons
import { AlertCircle } from "lucide-react"

export function SigninForm() {
  // Next.js router for navigation
  const router = useRouter()

  // Get current authentication status
  const { status } = useSession()

  // Form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // UI state
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Redirect to dashboard if already authenticated
   * This prevents showing the sign-in form to authenticated users
   */
  useEffect(() => {
    if (status === "authenticated") {
      router.refresh()
      router.push("/dashboard")
    }
  }, [status, router])

  /**
   * Handle form submission
   * Authenticates the user with provided credentials and handles success/error states
   *
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    console.log("Attempting to sign in...")

    try {
      // Attempt to sign in with credentials
      const result = await signIn("credentials", {
        redirect: false, // Handle redirect manually
        email,
        password,
      })

      console.log("Sign in result:", result)

      // Handle authentication error
      if (result?.error) {
        console.error("Sign in error:", result.error)
        setError("Invalid email or password")
        setIsLoading(false)
        return
      }

      // Handle successful authentication
      if (result?.ok) {
        console.log("Sign in successful, redirecting...")

        // Safety timeout to reset loading state if navigation fails
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
          // Then navigate after a short delay to allow session to be fully established
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
      // Handle unexpected errors
      console.error("Exception during sign in:", error)
      setError("Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          {/* Error alert - shown when authentication fails */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success alert - shown when user is authenticated but not yet redirected */}
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

          {/* Password input field with forgot password link */}
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

        {/* Form actions and sign-up link */}
        <CardFooter className="flex flex-col space-y-4">
          {/* Sign in button - disabled during loading or when already authenticated */}
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isLoading || status === "authenticated"}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          {/* Sign up link for new users */}
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
