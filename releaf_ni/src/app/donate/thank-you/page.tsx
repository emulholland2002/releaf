"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ThankYouPage() {
  const searchParams = useSearchParams()
  const name = searchParams.get("name") || "Donor"
  const amount = searchParams.get("amount") || "0"

  return (
    <div className="flex min-h-screen items-center justify-center py-10 px-4">
      <div className="w-full max-w-md">
        <div className="container max-w-3xl py-10">
          <div className="space-y-6">
            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <CardTitle className="text-3xl">Thank You for Your Donation!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xl">
                  Thank you, <span className="font-semibold">{name}</span> for your generous donation of ${amount}.
                </p>
                <p className="text-muted-foreground">
                  Your contribution will help us continue our mission and make a real difference. We've sent a confirmation
                  email with the details of your donation.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button asChild>
                  <Link href="/">Return to Homepage</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
