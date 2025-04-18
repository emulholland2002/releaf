/**
 * Authentication Provider Component
 *
 * This component provides authentication context to the application using NextAuth.js.
 * It wraps parts of the application that need access to authentication state,
 * such as user session data, login status, and authentication methods.
 */

"use client"

// Import React types for type checking
import type React from "react"

// Import SessionProvider from NextAuth.js
import { SessionProvider } from "next-auth/react"

/**
 * @param children - The React components to be wrapped with authentication context
 * @returns The children wrapped with SessionProvider
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
