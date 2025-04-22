/**
 * UserDashboard Component
 *
 * This component displays a comprehensive dashboard for users of the ReLeaf NI platform.
 * It shows donation history, activity tracking, and impact metrics.
 */
"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, HeartIcon, LeafIcon, TrendingUpIcon, PlusIcon } from "lucide-react"

// Type definitions for API responses and data structures
type DonationData = {
  month: string
  amount: number
}

type DonationsResponse = {
  donations: DonationData[]
  total: number
}

type Activity = {
  id: string
  type: string
  description: string
  date: string
  amount?: number
  status?: string
  eventType?: string
  eventColor?: string
}

type ActivitiesResponse = {
  activities: Activity[]
  activitiesThisMonth: number
  totalActivities: number
}

/**
 * Main dashboard component that fetches and displays user data
 * including donations, activities, and calculated impact score
 */
export default function UserDashboard() {
  const [donationData, setDonationData] = useState<DonationsResponse | null>(null)
  const [activityData, setActivityData] = useState<ActivitiesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch user donation history and activity data from API endpoints

        // Fetch donations
        const donationsResponse = await fetch("/api/donations/user")
        if (!donationsResponse.ok) {
          throw new Error("Failed to fetch donation data")
        }
        const donationsData = await donationsResponse.json()
        setDonationData(donationsData)

        // Fetch activities
        const activitiesResponse = await fetch("/api/events/user")
        if (!activitiesResponse.ok) {
          throw new Error("Failed to fetch activity data")
        }
        const activitiesData = await activitiesResponse.json()
        setActivityData(activitiesData)
      } catch (err) {
        setError("Could not load user data. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-md">
        <p>{error}</p>
      </div>
    )
  }

  /**
   * Calculates a user's environmental impact score based on:
   * - Total donation amount (1 point per £1)
   * - Number of activities (5 points per activity)
   * The score is scaled to a 0-100 range
   */
  const calculateImpactScore = () => {
    if (!donationData || !activityData) return 0

    // Simple algorithm: 1 point per £1 donated + 5 points per activity
    const donationPoints = donationData.total
    const activityPoints = activityData.totalActivities * 5

    // Scale to 0-100
    const totalPoints = donationPoints + activityPoints

    return totalPoints
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Donated"
          value={loading ? null : `£${donationData?.total.toLocaleString() || "0"}`}
          description="Your lifetime contribution"
          icon={<HeartIcon className="h-5 w-5 text-rose-500" />}
        />
        <StatsCard
          title="Activities This Month"
          value={loading ? null : (activityData?.activitiesThisMonth || 0).toString()}
          description="Your recent engagement"
          icon={<CalendarIcon className="h-5 w-5 text-blue-500" />}
        />
        <StatsCard
          title="Impact Score"
          value={loading ? null : calculateImpactScore().toString()}
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
              ) : activityData?.activities && activityData.activities.length > 0 ? (
                <div className="space-y-4">
                  {activityData.activities.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                    <CalendarIcon className="h-6 w-6 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No activities yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You haven't participated in any events or made donations yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

/**
 * Reusable card component for displaying key metrics
 * Supports loading state with skeleton UI
 */
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

/**
 * Renders a single activity item with appropriate icons and badges
 * Different styling based on activity type (donation, event, etc.)
 */
function ActivityItem({ activity }: { activity: Activity }) {
  const date = new Date(activity.date)
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  const getEventIcon = (type: string) => {
    // Return appropriate icon based on activity type
    switch (type) {
      case "Donation":
        return <HeartIcon className="h-5 w-5 text-rose-500" />
      case "Event Registration":
        return <CalendarIcon className="h-5 w-5 text-blue-500" />
      case "Event Creation":
        return <PlusIcon className="h-5 w-5 text-green-500" />
      default:
        return <TrendingUpIcon className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div
      className={`flex items-center space-x-4 rounded-md border p-3 ${activity.type === "Donation" ? "bg-gray-100" : ""}`}
    >
      <div className="flex-shrink-0">{getEventIcon(activity.type)}</div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{activity.type}</p>
          {activity.type === "Donation" && (
            <Badge className="bg-green-300 text-gray-800" variant="outline">
              Donation
            </Badge>
          )}
          {activity.eventType && (
            <Badge className={activity.eventColor || "bg-gray-100 text-gray-800"} variant="outline">
              {activity.eventType}
            </Badge>
          )}
          {activity.status && (
            <Badge
              className={
                activity.status === "attending"
                  ? "bg-green-100 text-green-800"
                  : activity.status === "interested"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
              }
              variant="outline"
            >
              {activity.status}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{activity.description}</p>
      </div>
      <div className="text-right">
        {activity.amount && (
          <p className={`text-sm font-medium ${activity.type === "Donation" ? "text-gray-800" : ""}`}>
            £{activity.amount}
          </p>
        )}
        <p className="text-xs text-muted-foreground">{formattedDate}</p>
      </div>
    </div>
  )
}
