/**
 * Sign Out Button Component
 *
 * This component provides a simple button for users to sign out of their account.
 * It uses NextAuth's signOut function and redirects users to the home page after
 * signing out. The button includes a logout icon for visual clarity.
 */

"use client"

// Authentication hooks from NextAuth
import { signOut } from "next-auth/react"

// UI components
import { Button } from "@/components/ui/button"

// Icons
import { LogOut } from "lucide-react"

export function SignOutButton() {
  return (
    <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-2">
      <LogOut className="h-4 w-4" />
      Sign out
    </Button>
  )
}
