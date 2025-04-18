/**
 * RootLayout Component
 *
 * This is the root layout component that wraps all pages in the application.
 * It provides the basic HTML structure, global styles, fonts, authentication context,
 * and consistent navigation and footer across all pages.
 */

// Type imports for Next.js metadata
import type { Metadata } from "next"

// Global CSS styles
import "./globals.css"

// React core import
import type React from "react"

// Component imports for layout structure
import NavBar from "../components/navbar"
import { Footer } from "../components/footer"
import { AuthProvider } from "@/components/auth-provider"

/**
 * Metadata configuration for the application
 * This provides SEO information and browser tab details
 */
export const metadata: Metadata = {
  title: "Releaf NI",
  description: "Saving NI one tree at a time",
}

/**
 * RootLayout function component
 *
 * @param children - The page content that will be wrapped by this layout
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* AuthProvider - Provides authentication context to all child components */}
        <AuthProvider>
          {/* NavBar - Consistent navigation header across all pages */}
          <NavBar />

          {/* Main content area - Renders the current page */}
          {children}
        </AuthProvider>

        {/* Footer - Consistent footer across all pages, outside the auth context */}
        <Footer />
      </body>
    </html>
  )
}
