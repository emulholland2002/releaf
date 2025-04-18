/**
 * Dashboard Page Component
 *
 * This is the main page component for the user dashboard in the ReLeaf NI application.
 * It serves as a container for the UserDashboard component and provides page-level
 * metadata for SEO optimization.
 */
import type { Metadata } from "next"
import UserDashboard from "@/components/user-dashboard"

/**
 * Next.js Metadata Configuration
 *
 * Defines the page title and description for:
 * - Browser tabs
 * - Search engine results
 * - Social media sharing
 */
export const metadata: Metadata = {
  title: "User Dashboard | ReLeaf NI",
  description: "View your donation history and recent activities",
}

/**
 * DashboardPage Component
 *
 * A simple wrapper component that:
 * 1. Provides a container with appropriate spacing
 * 2. Renders the page heading
 * 3. Includes the main UserDashboard component
 */
export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      {/* Main page heading */}
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>

      {/* Main dashboard component that contains all the user-specific data and UI */}
      <UserDashboard />
    </div>
  )
}
