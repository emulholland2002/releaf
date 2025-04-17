"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarIcon, HeartIcon, LeafIcon, TrendingUpIcon } from "lucide-react"

type DonationData = {
  month: string
  amount: number
}

type DonationsResponse = {
  donations: DonationData[]
  total: number
}

export default function UserDashboard() {
  const [donationData, setDonationData] = useState<DonationsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Generate dummy stats
  const dummyStats = {
    // Random number between 3 and 12
    activitiesThisMonth: Math.floor(Math.random() * 10) + 3,
    // Random number between 50 and 95
    impactScore: Math.floor(Math.random() * 46) + 50,
  }

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/donations/user")
        if (!response.ok) {
          throw new Error("Failed to fetch donation data")
        }
        const data = await response.json()
        setDonationData(data)
      } catch (err) {
        setError("Could not load donation data. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDonations()
  }, [])

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-md">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Donated"
          value={loading ? null : `£${donationData?.total.toLocaleString()}`}
          description="Your lifetime contribution"
          icon={<HeartIcon className="h-5 w-5 text-rose-500" />}
        />
        <StatsCard
          title="Activities This Month"
          value={loading ? null : dummyStats.activitiesThisMonth.toString()}
          description="Your recent engagement"
          icon={<CalendarIcon className="h-5 w-5 text-blue-500" />}
        />
        <StatsCard
          title="Impact Score"
          value={loading ? null : dummyStats.impactScore.toString()}
          description="Your environmental impact"
          icon={<LeafIcon className="h-5 w-5 text-green-500" />}
        />
      </div>

      {/* Tabs for Donations and Activity */}
      <Tabs defaultValue="donations" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="donations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Donation History</CardTitle>
              <CardDescription>View your donation trends over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-[400px] w-full" />
                  </div>
                ) : (
                  <ChartContainer
                    config={{
                      amount: {
                        label: "Amount (£)",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="w-full h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={donationData?.donations || []}
                        margin={{ top: 20, right: 30, left: 30, bottom: 30 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent formatter={(value) => `£${value}`} />} />
                        <Bar dataKey="amount" fill="var(--color-amount)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest interactions with ReLeaf NI</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {generateDummyActivities().map((activity) => (
                    <ActivityItem key={activity.id} event={activity} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Generate dummy activities for the activity tab
function generateDummyActivities() {
  const eventTypes = ["Donation", "Volunteer Sign-up", "Event Registration", "Newsletter Subscription"]
  const descriptions = [
    "Made a donation to tree planting initiative",
    "Signed up for weekend cleanup event",
    "Registered for environmental workshop",
    "Subscribed to monthly newsletter",
    "Participated in community garden project",
  ]

  return Array.from({ length: 5 }).map((_, i) => {
    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)]
    const daysAgo = Math.floor(Math.random() * 30)
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)

    return {
      id: `dummy-event-${i}`,
      type,
      description: descriptions[i],
      date: date.toISOString(),
      amount: type === "Donation" ? Math.floor(Math.random() * 100) + 10 : null,
    }
  })
}

function StatsCard({
  title,
  value,
  description,
  icon,
}: {
  title: string
  value: string | null
  description: string
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {value ? <div className="text-2xl font-bold">{value}</div> : <Skeleton className="h-8 w-24" />}
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function ActivityItem({ event }: { event: any }) {
  const date = new Date(event.date)
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  const getEventIcon = (type: string) => {
    switch (type) {
      case "Donation":
        return <HeartIcon className="h-5 w-5 text-rose-500" />
      case "Volunteer Sign-up":
        return <LeafIcon className="h-5 w-5 text-green-500" />
      case "Event Registration":
        return <CalendarIcon className="h-5 w-5 text-blue-500" />
      default:
        return <TrendingUpIcon className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="flex items-center space-x-4 rounded-md border p-3">
      <div className="flex-shrink-0">{getEventIcon(event.type)}</div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">{event.type}</p>
        <p className="text-xs text-muted-foreground">{event.description}</p>
      </div>
      <div className="text-right">
        {event.amount && <p className="text-sm font-medium">£{event.amount}</p>}
        <p className="text-xs text-muted-foreground">{formattedDate}</p>
      </div>
    </div>
  )
}
