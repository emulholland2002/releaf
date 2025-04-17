import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { PrismaClient } from "@prisma/client" 

const prisma = new PrismaClient()

// GET /api/events - Fetch events with optional date filtering
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")

  let dateFilter = {}
  if (startDate && endDate) {
    dateFilter = {
      date: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    }
  }

  try {
    const events = await prisma.event.findMany({
      where: dateFilter,
      include: {
        type: true,
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        userEvents: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    })

    // Transform data for frontend consumption
    const formattedEvents = events.map((event) => ({
      id: event.id,
      title: event.title,
      date: event.date.toISOString(),
      endDate: event.endDate?.toISOString(),
      location: event.location,
      description: event.description,
      duration: event.duration,
      volunteers: event.volunteers,
      type: event.type?.name,
      typeColor: event.type?.color,
      createdBy: event.createdBy?.name,
      attendees: event.userEvents.length,
      attendeesList: event.userEvents.map((ue) => ({
        id: ue.user.id,
        name: ue.user.name,
        status: ue.status,
      })),
    }))

    return NextResponse.json(formattedEvents)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

// POST /api/events - Create a new event
export async function POST(request: Request) {
  try {
    // Get the authenticated user session
    const session = await getServerSession()

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find the user in the database using the email from the session
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Parse the request body
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.date) {
      return NextResponse.json({ error: "Title and date are required" }, { status: 400 })
    }

    // Prepare the event data according to the Prisma schema
    const eventData = {
      title: data.title,
      date: new Date(data.date),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      location: data.location,
      description: data.description,
      duration: data.duration ? Number.parseInt(data.duration) : undefined,
      volunteers: data.volunteers ? Number.parseInt(data.volunteers) : undefined,

      // Connect to event type if provided
      ...(data.typeId && {
        type: {
          connect: { id: data.typeId },
        },
      }),

      // Connect to the authenticated user using the ID from the database
      createdBy: {
        connect: { id: user.id },
      },

      // Automatically add creator as an attendee
      userEvents: {
        create: {
          userId: user.id,
          status: "attending",
        },
      },
    }

    // Create the event
    const event = await prisma.event.create({
      data: eventData,
      include: {
        type: true,
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        userEvents: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    // Format the response
    const formattedEvent = {
      id: event.id,
      title: event.title,
      date: event.date.toISOString(),
      endDate: event.endDate?.toISOString(),
      location: event.location,
      description: event.description,
      duration: event.duration,
      volunteers: event.volunteers,
      type: event.type?.name,
      typeColor: event.type?.color,
      createdBy: event.createdBy?.name,
      attendees: event.userEvents.length,
      attendeesList: event.userEvents.map((ue) => ({
        id: ue.user.id,
        name: ue.user.name,
        status: ue.status,
      })),
    }

    return NextResponse.json(formattedEvent, { status: 201 })
  } catch (error) {
    console.error("Error creating event:", error)

    // Handle specific errors
    if (error.code === "P2002") {
      return NextResponse.json({ error: "A unique constraint would be violated." }, { status: 400 })
    }

    if (error.code === "P2003") {
      return NextResponse.json({ error: "Foreign key constraint failed. Invalid reference." }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
