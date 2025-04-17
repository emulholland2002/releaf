import { CalendarView } from "@/components/calendar-view"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>ReLeaf NI Afforestation Events</CardTitle>
          <CardDescription>
            View and join upcoming tree planting and forest restoration events across Northern Ireland
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CalendarView />
        </CardContent>
      </Card>
    </div>
  )
}
