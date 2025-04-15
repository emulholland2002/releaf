"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, TreeDeciduous } from "lucide-react"

export default function DonationForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [donationAmount, setDonationAmount] = useState("25")
  const [customAmount, setCustomAmount] = useState("")
  const [donationType, setDonationType] = useState("one-time")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAmountChange = (value: string) => {
    setDonationAmount(value)
    setCustomAmount("")
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value)
    setDonationAmount("custom")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form data
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert("Please fill in all required fields")
      return
    }

    // Validate amount
    const amount = donationAmount === "custom" ? customAmount : donationAmount
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Please enter a valid donation amount")
      return
    }

    setIsSubmitting(true)

    // Prepare data to match the Donation model
    const donationData = {
      name: `${formData.firstName} ${formData.lastName}`, // Combine first and last name to match the model
      email: formData.email,
      amount: Number(amount),
      message: formData.message || undefined, // Only include if not empty
      status: "pending", // Default status
    }

    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donationData),
      })

      if (response.ok) {
        router.push("/donate/thank-you")
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error("Donation submission failed", errorData)
        alert("There was an error processing your donation. Please try again.")
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error("Error submitting donation:", error)
      alert("There was an error processing your donation. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-green-100 shadow-md">
      <CardHeader className="bg-green-50 border-b border-green-100">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="h-5 w-5 text-green-600" />
          <CardTitle className="text-2xl text-green-800">Make a Donation</CardTitle>
        </div>
        <CardDescription>
          Your contribution helps us plant more trees and create a greener Northern Ireland.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form id="donationForm" onSubmit={handleSubmit}>
          <Tabs defaultValue="one-time" className="w-full mb-6" onValueChange={setDonationType}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger
                value="one-time"
                className="data-[state=active]:bg-green-50 data-[state=active]:text-green-800"
              >
                One-time Donation
              </TabsTrigger>
              <TabsTrigger
                value="monthly"
                className="data-[state=active]:bg-green-50 data-[state=active]:text-green-800"
              >
                Monthly Donation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="one-time" className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-3 block">Select Donation Amount</Label>
                <RadioGroup
                  value={donationAmount}
                  onValueChange={handleAmountChange}
                  className="grid grid-cols-2 md:grid-cols-4 gap-3"
                >
                  {["10", "25", "50", "100"].map((amount) => (
                    <div key={amount} className="relative">
                      <RadioGroupItem value={amount} id={`amount-${amount}`} className="peer sr-only" />
                      <Label
                        htmlFor={`amount-${amount}`}
                        className="flex h-14 items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-green-50 hover:text-green-800 peer-data-[state=checked]:border-green-600 peer-data-[state=checked]:bg-green-50 peer-data-[state=checked]:text-green-800 cursor-pointer"
                      >
                        £{amount}
                      </Label>
                    </div>
                  ))}

                  {/* Custom amount option inside the RadioGroup */}
                  <div className="relative col-span-2 md:col-span-4">
                    <RadioGroupItem value="custom" id="amount-custom" className="peer sr-only" />
                    <div className="flex items-center">
                      <Label htmlFor="amount-custom" className="mr-3">
                        Custom Amount:
                      </Label>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
                        <Input
                          type="number"
                          min="1"
                          step="0.01"
                          placeholder="Other amount"
                          value={customAmount}
                          onChange={handleCustomAmountChange}
                          onClick={() => setDonationAmount("custom")}
                          className="pl-7"
                        />
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </TabsContent>

            <TabsContent value="monthly" className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-3 block">Select Monthly Amount</Label>
                <RadioGroup
                  value={donationAmount}
                  onValueChange={handleAmountChange}
                  className="grid grid-cols-2 md:grid-cols-4 gap-3"
                >
                  {["5", "10", "20", "50"].map((amount) => (
                    <div key={amount} className="relative">
                      <RadioGroupItem value={amount} id={`monthly-${amount}`} className="peer sr-only" />
                      <Label
                        htmlFor={`monthly-${amount}`}
                        className="flex h-14 items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-green-50 hover:text-green-800 peer-data-[state=checked]:border-green-600 peer-data-[state=checked]:bg-green-50 peer-data-[state=checked]:text-green-800 cursor-pointer"
                      >
                        £{amount}/mo
                      </Label>
                    </div>
                  ))}

                  {/* Custom amount option inside the RadioGroup */}
                  <div className="relative col-span-2 md:col-span-4">
                    <RadioGroupItem value="custom" id="monthly-custom" className="peer sr-only" />
                    <div className="flex items-center">
                      <Label htmlFor="monthly-custom" className="mr-3">
                        Custom Monthly:
                      </Label>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
                        <Input
                          type="number"
                          min="1"
                          step="0.01"
                          placeholder="Other amount"
                          value={customAmount}
                          onChange={handleCustomAmountChange}
                          onClick={() => setDonationAmount("custom")}
                          className="pl-7"
                        />
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-4 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Tell us why you're donating or if you'd like to dedicate this donation to someone"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 bg-green-50 border-t border-green-100">
        <div className="flex items-center gap-2 text-sm text-green-700 mb-2">
          <TreeDeciduous className="h-4 w-4" />
          <span>Your donation will help plant native trees across Northern Ireland</span>
        </div>
        <Button
          type="submit"
          form="donationForm"
          disabled={isSubmitting || (donationAmount === "custom" && !customAmount)}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isSubmitting
            ? "Processing..."
            : `Donate ${donationAmount === "custom" ? (customAmount ? `£${customAmount}` : "") : `£${donationAmount}`} ${donationType === "monthly" ? "Monthly" : ""}`}
        </Button>
      </CardFooter>
    </Card>
  )
}
