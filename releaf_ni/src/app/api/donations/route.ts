import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"

// Create a new PrismaClient instance
const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get session
    const session = await getServerSession()
    const userEmail = session?.user?.email

    // Get all events
    const events = await prisma.event.findMany({
      orderBy: {
        date: "asc",
      },
    })

    // Get user's events if logged in
    let userEvents = []
    if (userEmail) {
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
        include: {
          userEvents: true,
        },
      })
      
      userEvents = user?.userEvents || []
    }

    return NextResponse.json({ events, userEvents })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Get session
    const session = await getServerSession()
    
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.date) {
      return NextResponse.json(
        { error: "Missing required fields: title and date are required" },
        { status: 400 },
      )
    }

    // Create event record
    const event = await prisma.event.create({
      data: {
        title: data.title,
        date: new Date(data.date),
      },
    })

    // If user is logged in, automatically add this event to their calendar
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      })
      
      if (user) {
        await prisma.userEvent.create({
          data: {
            userId: user.id,
            eventId: event.id,
          },
        })
      }
    }

    return NextResponse.json({ success: true, event }, { status: 201 })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "An error occurred while creating the event" }, { status: 500 })
  }
}
