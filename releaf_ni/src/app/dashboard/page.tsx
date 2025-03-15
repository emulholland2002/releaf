import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SignOutButton } from "@/components/sign-out-button"

export default async function Dashboard() {
  const session = await getServerSession()

  if (!session?.user) {
    redirect("/signin")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
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
      </div>
  )
}