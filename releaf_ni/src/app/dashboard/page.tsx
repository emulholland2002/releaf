import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SignOutButton from "@/components/sign-out-button"

export default async function DashboardPage() {
  const session = await getServerSession()

  if (!session?.user) {
    redirect("/sigin")
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <SignOutButton />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome, {session.user.name || "User"}!</CardTitle>
          <CardDescription>You are now signed in to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is your protected dashboard page.</p>
        </CardContent>
      </Card>
    </div>
  )
}