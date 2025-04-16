import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    const userId = session?.user?.id

    // Get all events
    const events = await db.event.findMany({
      orderBy: {
        date: "asc",
      },
    })

    // Get user's events if logged in
    let userEvents = []
    if (userId) {
      userEvents = await db.userEvent.findMany({
        where: {
          userId,
        },
      })
    }

    return NextResponse.json({ events, userEvents })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}
