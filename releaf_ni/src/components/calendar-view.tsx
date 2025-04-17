"use client"

import { useState, useEffect } from "react"
import { addMonths, format, isSameDay, parseISO } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Users, Clock, CalendarIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function CalendarView() {
  const [date, setDate] = useState<Date>(new Date())
  const [selectedDay, setSelectedDay] = useState<Date>(new Date())
  const [events, setEvents] = useState<any[]>([])
  const [isClient, setIsClient] = useState(false)

  // Use useEffect to generate events only on the client side
  useEffect(() => {
    setIsClient(true)
    setEvents(generateEvents())
  }, [])

  // Generate dummy events for current and next 2 months
  const generateEvents = () => {
    const today = new Date()
    const events = []

    // Event types with corresponding badge colors
    const eventTypes = [
      { type: "Tree Planting", color: "bg-green-100 text-green-800 hover:bg-green-100" },
      { type: "Forest Restoration", color: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" },
      { type: "Community Workshop", color: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
      { type: "Volunteer Training", color: "bg-amber-100 text-amber-800 hover:bg-amber-100" },
    ]

    // Locations in Northern Ireland
    const locations = [
      "Belfast City Park",
      "Tollymore Forest Park",
      "Glenariff Forest Park",
      "Castlewellan Forest Park",
      "Gortin Glen Forest Park",
      "Clandeboye Estate",
      "Lagan Valley Regional Park",
      "Carnfunnock Country Park",
      "Slieve Gullion Forest Park",
      "Kilbroney Park",
      "Drum Manor Forest Park",
      "Gosford Forest Park",
    ]

    // Generate 15 events spread across 3 months
    for (let i = 0; i < 15; i++) {
      const monthOffset = Math.floor(i / 5) // Distribute events across 3 months
      const eventDate = new Date(today)

      // Set to a random day in the target month
      eventDate.setMonth(today.getMonth() + monthOffset)
      eventDate.setDate(Math.floor(Math.random() * 28) + 1) // Random day 1-28

      // Random start time between 9am and 4pm
      const startHour = Math.floor(Math.random() * 8) + 9
      eventDate.setHours(startHour, 0, 0)

      // Duration between 2-4 hours
      const durationHours = Math.floor(Math.random() * 3) + 2

      // Random event type
      const eventTypeIndex = Math.floor(Math.random() * eventTypes.length)

      // Random location
      const locationIndex = Math.floor(Math.random() * locations.length)

      // Random number of volunteers (10-50)
      const volunteers = Math.floor(Math.random() * 41) + 10

      events.push({
        id: i + 1,
        title: `${eventTypes[eventTypeIndex].type} Event`,
        date: eventDate.toISOString(),
        location: locations[locationIndex],
        type: eventTypes[eventTypeIndex].type,
        typeColor: eventTypes[eventTypeIndex].color,
        duration: durationHours,
        volunteers: volunteers,
        description: `Join us for a ${eventTypes[eventTypeIndex].type.toLowerCase()} event at ${locations[locationIndex]}. We'll be working together to restore our local environment and create a greener Northern Ireland.`,
      })
    }

    return events
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
                    <Badge className={event.typeColor}>{event.type}</Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {event.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm">{event.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-muted-foreground pt-0">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {format(parseISO(event.date), "h:mm a")} ({event.duration} hours)
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {event.volunteers} volunteers
                  </div>
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
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {event.location}
                      </div>
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
              <div className="flex items-center justify-between">
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Tree Planting</Badge>
                <span className="text-sm text-muted-foreground">
                  {events.filter((e) => e.type === "Tree Planting").length} events
                </span>
              </div>
              <div className="flex items-center justify-between">
                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Forest Restoration</Badge>
                <span className="text-sm text-muted-foreground">
                  {events.filter((e) => e.type === "Forest Restoration").length} events
                </span>
              </div>
              <div className="flex items-center justify-between">
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Community Workshop</Badge>
                <span className="text-sm text-muted-foreground">
                  {events.filter((e) => e.type === "Community Workshop").length} events
                </span>
              </div>
              <div className="flex items-center justify-between">
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Volunteer Training</Badge>
                <span className="text-sm text-muted-foreground">
                  {events.filter((e) => e.type === "Volunteer Training").length} events
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
