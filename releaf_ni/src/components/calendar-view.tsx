"use client"

import { useState, useEffect } from "react"
import { addMonths, format, isSameDay, parseISO } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Users, Clock, CalendarIcon, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EventForm } from "@/components/event-form"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"

type Event = {
  id: string
  title: string
  date: string
  endDate?: string
  location?: string
  description?: string
  duration?: number
  volunteers?: number
  type?: string
  typeColor?: string
  createdBy?: string
  attendees?: number
}

export function CalendarView() {
  const [date, setDate] = useState<Date>(new Date())
  const [selectedDay, setSelectedDay] = useState<Date>(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [showEventForm, setShowEventForm] = useState(false)
  const { toast } = useToast()
  const { data: session } = useSession()

  const fetchEvents = async () => {
    setIsLoading(true)
    try {
      // Calculate date range for 3 months
      const startDate = new Date()
      startDate.setMonth(startDate.getMonth() - 1) // Include previous month
      const endDate = new Date()
      endDate.setMonth(endDate.getMonth() + 3)

      // Format dates for API
      const startDateStr = startDate.toISOString().split("T")[0]
      const endDateStr = endDate.toISOString().split("T")[0]

      const response = await fetch(`/api/events?startDate=${startDateStr}&endDate=${endDateStr}`)

      if (!response.ok) {
        throw new Error("Failed to fetch events")
      }

      const data = await response.json()
      setEvents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error(err)
      toast({
        title: "Error",
        description: "Failed to load events. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsClient(true)
    }
  }

  // Fetch events on component mount and when date changes
  useEffect(() => {
    fetchEvents()
  }, [])

  // Handle event creation success
  const handleEventCreated = () => {
    setShowEventForm(false)
    fetchEvents()
    toast({
      title: "Success",
      description: "Event created successfully!",
    })
  }

  // Handle event attendance
  const handleAttendEvent = async (eventId: string) => {
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to attend events.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/events/${eventId}/attend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "attending" }),
      })

      if (!response.ok) {
        throw new Error("Failed to attend event")
      }

      toast({
        title: "Success",
        description: "You're now attending this event!",
      })

      // Refresh events to update attendance count
      fetchEvents()
    } catch (error) {
      console.error("Error attending event:", error)
      toast({
        title: "Error",
        description: "Failed to register for this event. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Filter events for the selected day
  const selectedDayEvents = events.filter((event) => isSameDay(parseISO(event.date), selectedDay))

  // If not client-side yet, render a simple loading state
  if (!isClient) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
        <div className="md:col-span-5">
          <div className="h-[350px] rounded-md border animate-pulse bg-gray-100"></div>
        </div>
        <div className="md:col-span-2">
          <div className="h-[200px] rounded-md border animate-pulse bg-gray-100 mb-6"></div>
          <div className="h-[150px] rounded-md border animate-pulse bg-gray-100"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-8 p-4">
      <div className="md:col-span-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Events Calendar</h2>
          {session?.user && (
            <Button onClick={() => setShowEventForm(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" /> Add Event
            </Button>
          )}
        </div>

        {showEventForm && session?.user ? (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <EventForm
              selectedDate={selectedDay}
              onSuccess={handleEventCreated}
              onCancel={() => setShowEventForm(false)}
            />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-4">
            <Calendar
              mode="single"
              selected={selectedDay}
              onSelect={(day) => day && setSelectedDay(day)}
              month={date}
              onMonthChange={setDate}
              numberOfMonths={1}
              className="w-full"
              modifiersClassNames={{
                selected: "bg-green-600 text-white hover:bg-green-600 hover:text-white",
              }}
              modifiers={{
                hasEvent: (day) => events.some((event) => isSameDay(parseISO(event.date), day)),
              }}
              styles={{
                months: {
                  width: "100%",
                },
                month: {
                  width: "100%",
                },
                table: {
                  width: "100%",
                  borderSpacing: "0.25rem",
                  tableLayout: "fixed",
                },
                head_cell: {
                  width: "100%",
                  padding: "0.75rem 0",
                  fontSize: "1rem",
                  fontWeight: "600",
                },
                cell: {
                  width: "100%",
                  height: "3.5rem",
                  padding: "0.25rem",
                },
                day: {
                  width: "100%",
                  height: "100%",
                  fontSize: "1rem",
                  fontWeight: "normal",
                },
                day_today: {
                  fontWeight: "bold",
                  borderWidth: "1px",
                  borderColor: "rgb(34 197 94)",
                },
                day_selected: {
                  backgroundColor: "rgb(22 163 74)",
                  color: "white",
                },
                day_hasEvent: {
                  backgroundColor: "rgb(240 253 244)",
                  color: "rgb(22 101 52)",
                },
              }}
              components={{
                DayContent: ({ date, displayMonth }) => {
                  const hasEvents = events.some((event) => isSameDay(parseISO(event.date), date))
                  return (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <span className="text-base">{format(date, "d")}</span>
                      {hasEvents && (
                        <div className="absolute bottom-1 left-0 right-0 flex justify-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                        </div>
                      )}
                    </div>
                  )
                },
              }}
            />
          </div>
        )}

        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <h3 className="font-medium text-lg mb-4">
            {selectedDayEvents.length > 0
              ? `Events on ${format(selectedDay, "MMMM d, yyyy")}`
              : `No events on ${format(selectedDay, "MMMM d, yyyy")}`}
          </h3>

          <div className="space-y-4">
            {selectedDayEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    {event.type && event.typeColor && <Badge className={event.typeColor}>{event.type}</Badge>}
                  </div>
                  {event.location && (
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {event.location}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="pb-2">
                  {event.description && <p className="text-sm">{event.description}</p>}
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-muted-foreground pt-0">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {format(parseISO(event.date), "h:mm a")}
                    {event.duration && ` (${event.duration} hours)`}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {event.attendees || 0} attendees
                  </div>
                </CardFooter>
                <CardFooter className="pt-0">
                  <Button
                    onClick={() => handleAttendEvent(event.id)}
                    variant="outline"
                    className="w-full border-green-600 text-green-700 hover:bg-green-50"
                  >
                    {session?.user ? "Attend This Event" : "Sign In to Attend"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="md:col-span-2 space-y-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events
                .filter((event) => {
                  const eventDate = parseISO(event.date)
                  const thirtyDaysFromNow = addMonths(new Date(), 1)
                  return eventDate > new Date() && eventDate < thirtyDaysFromNow
                })
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 5)
                .map((event) => (
                  <div key={event.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 flex flex-col items-center justify-center w-12 h-12 rounded-md bg-green-50 text-green-700">
                      <span className="text-xs font-medium">{format(parseISO(event.date), "MMM")}</span>
                      <span className="text-lg font-bold leading-none">{format(parseISO(event.date), "d")}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{event.title}</h4>
                      {event.location && (
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {event.location}
                        </div>
                      )}
                      <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                        <Clock className="h-3 w-3 mr-1" />
                        {format(parseISO(event.date), "h:mm a")}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground flex items-center">
              <CalendarIcon className="h-3.5 w-3.5 mr-1" />
              {events.length} total events in the next 3 months
            </div>
          </CardFooter>
        </Card>

        <Card className="mt-6 shadow-md">
          <CardHeader>
            <CardTitle>Event Types</CardTitle>
            <CardDescription>Categories of afforestation events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { type: "Tree Planting", color: "bg-green-100 text-green-800 hover:bg-green-100" },
                { type: "Forest Restoration", color: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" },
                { type: "Community Workshop", color: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
                { type: "Volunteer Training", color: "bg-amber-100 text-amber-800 hover:bg-amber-100" },
              ].map((typeInfo) => (
                <div key={typeInfo.type} className="flex items-center justify-between">
                  <Badge className={typeInfo.color}>{typeInfo.type}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {events.filter((e) => e.type === typeInfo.type).length} events
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
