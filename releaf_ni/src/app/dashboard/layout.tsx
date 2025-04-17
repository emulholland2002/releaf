import type { Metadata } from "next"
import UserDashboard from "./user-dashboard"

export const metadata: Metadata = {
  title: "User Dashboard | ReLeaf NI",
  description: "View your donation history and recent activities",
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
      <UserDashboard />
    </div>
  )
}
