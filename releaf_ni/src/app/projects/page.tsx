/**
 * Events Calendar Page
 *
 * This page displays a calendar view of afforestation events organized by ReLeaf NI.
 * It provides users with a way to browse and join upcoming tree planting and
 * forest restoration activities across Northern Ireland.
 */
import { CalendarView } from "@/components/calendar-view"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  return (
    <div className="container mx-auto py-10">
      {/* Card component provides a visually distinct container for the calendar */}
      <Card>
        {/* CardHeader contains the title and description of the calendar */}
        <CardHeader>
          <CardTitle>ReLeaf NI Afforestation Events</CardTitle>
          <CardDescription>
            View and join upcoming tree planting and forest restoration events across Northern Ireland
          </CardDescription>
        </CardHeader>
        {/* CardContent contains the actual calendar component */}
        <CardContent>
          <CalendarView />
        </CardContent>
      </Card>
    </div>
  )
}
