/**
 * API Route: Events
 * 
 * This file handles API endpoints for managing events:
 * - GET: Retrieve events with optional date filtering
 * - POST: Create a new event (authenticated users only)
 * 
 * @file app/api/events/route.ts
 */

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import prisma from "@/app/client"

/**
 * Type definitions for better code documentation and type safety
 */
type EventRequest = {
  title: string;
  date: string;
  endDate?: string;
  location?: string;
  description?: string;
  duration?: string | number;
  volunteers?: string | number;
  typeId?: string;
}

type FormattedEvent = {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  location?: string;
  description?: string;
  duration?: number;
  volunteers?: number;
  type?: string;
  typeColor?: string;
  createdBy?: string;
  attendees: number;
  attendeesList: Array<{
    id: string;
    name: string;
    status: string;
  }>;
}

/**
 * Validates an event request
 * 
 * @param data The event data to validate
 * @returns An object containing validation result and any error messages
 */
function validateEventRequest(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for required fields
  if (!data.title) errors.push("Title is required");
  if (!data.date) errors.push("Date is required");

  // Validate title length
  if (data.title && (data.title.length < 3 || data.title.length > 100)) {
    errors.push("Title must be between 3 and 100 characters");
  }

  // Validate date format
  if (data.date) {
    const dateObj = new Date(data.date);
    if (isNaN(dateObj.getTime())) {
      errors.push("Invalid date format");
    }
  }

  // Validate end date if provided
  if (data.endDate) {
    const endDateObj = new Date(data.endDate);
    if (isNaN(endDateObj.getTime())) {
      errors.push("Invalid end date format");
    }

    // Check that end date is after start date
    if (data.date) {
      const startDateObj = new Date(data.date);
      if (!isNaN(startDateObj.getTime()) && !isNaN(endDateObj.getTime()) && endDateObj < startDateObj) {
        errors.push("End date must be after start date");
      }
    }
  }

  // Validate numeric fields
  if (data.duration !== undefined) {
    const duration = Number(data.duration);
    if (isNaN(duration) || duration <= 0) {
      errors.push("Duration must be a positive number");
    }
  }

  if (data.volunteers !== undefined) {
    const volunteers = Number(data.volunteers);
    if (isNaN(volunteers) || volunteers <= 0 || !Number.isInteger(volunteers)) {
      errors.push("Volunteers must be a positive integer");
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Formats an event object for API response
 * 
 * @param event The raw event object from Prisma
 * @returns A formatted event object for the frontend
 */
function formatEvent(event: any): FormattedEvent {
  return {
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
    attendeesList: event.userEvents.map((ue: any) => ({
      id: ue.user.id,
      name: ue.user.name,
      status: ue.status,
    })),
  };
}

/**
 * GET handler for events API endpoint
 * Retrieves events with optional date filtering
 * 
 * @param request The incoming request object
 * @returns A JSON response with events or error details
 */
export async function GET(request: Request) {
  console.log("API: Fetching events");
  
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // Validate date parameters if provided
    if (startDate && isNaN(new Date(startDate).getTime())) {
      return NextResponse.json({ 
        error: "Invalid startDate format", 
        details: "Please provide date in ISO format (YYYY-MM-DD)" 
      }, { status: 400 });
    }

    if (endDate && isNaN(new Date(endDate).getTime())) {
      return NextResponse.json({ 
        error: "Invalid endDate format", 
        details: "Please provide date in ISO format (YYYY-MM-DD)" 
      }, { status: 400 });
    }

    // Build date filter if both dates are provided
    let dateFilter = {}
    if (startDate && endDate) {
      console.log(`Filtering events between ${startDate} and ${endDate}`);
      dateFilter = {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      }
    }

    // Query database for events
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

    console.log(`Retrieved ${events.length} events`);

    // Transform data for frontend consumption
    const formattedEvents = events.map(formatEvent);

    return NextResponse.json(formattedEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    
    // Return a structured error response
    return NextResponse.json({ 
      error: "Failed to fetch events",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

/**
 * POST handler for events API endpoint
 * Creates a new event (authenticated users only)
 * 
 * @param request The incoming request object
 * @returns A JSON response with the created event or error details
 */
export async function POST(request: Request) {
  console.log("API: Creating new event");
  
  try {
    // Get the authenticated user session
    const session = await getServerSession();

    // Check authentication
    if (!session || !session.user?.email) {
      console.warn("Unauthorized attempt to create event");
      return NextResponse.json({ 
        error: "Authentication required to create events" 
      }, { status: 401 });
    }

    // Find the user in the database using the email from the session
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      console.warn(`User not found for email: ${session.user.email}`);
      return NextResponse.json({ 
        error: "User not found in the database" 
      }, { status: 404 });
    }

    // Parse the request body
    let data: EventRequest;
    try {
      data = await request.json();
    } catch (error) {
      console.error("Failed to parse request body:", error);
      return NextResponse.json({ 
        error: "Invalid request body" 
      }, { status: 400 });
    }

    // Validate request data
    const { isValid, errors } = validateEventRequest(data);
    if (!isValid) {
      console.warn("Validation failed for event creation:", errors);
      return NextResponse.json({ 
        error: "Validation failed", 
        details: errors 
      }, { status: 400 });
    }

    // Prepare the event data according to the Prisma schema
    const eventData = {
      title: data.title,
      date: new Date(data.date),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      location: data.location,
      description: data.description,
      duration: data.duration ? Number.parseInt(String(data.duration)) : undefined,
      volunteers: data.volunteers ? Number.parseInt(String(data.volunteers)) : undefined,

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
    };

    // Verify event type exists if provided
    if (data.typeId) {
      const eventType = await prisma.eventType.findUnique({
        where: { id: data.typeId },
      });
      
      if (!eventType) {
        return NextResponse.json({ 
          error: "Event type not found" 
        }, { status: 400 });
      }
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
    });

    console.log(`Created new event: ${event.title} (ID: ${event.id})`);

    // Format the response
    const formattedEvent = formatEvent(event);

    return NextResponse.json(formattedEvent, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);

    // Handle specific Prisma errors
    if (error.code === "P2002") {
      return NextResponse.json({ 
        error: "A unique constraint would be violated.",
        details: "An event with these details may already exist."
      }, { status: 400 });
    }

    if (error.code === "P2003") {
      return NextResponse.json({ 
        error: "Foreign key constraint failed.",
        details: "One of the referenced records does not exist."
      }, { status: 400 });
    }

    if (error.code === "P2025") {
      return NextResponse.json({ 
        error: "Record not found.",
        details: "A referenced record could not be found."
      }, { status: 400 });
    }

    // Return a generic error message for other errors
    return NextResponse.json({ 
      error: "Failed to create event",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

/**
 * Helper function to safely parse date strings
 * 
 * @param dateString The date string to parse
 * @param defaultValue Optional default value if parsing fails
 * @returns A valid Date object or the default value
 */
function parseDate(dateString: string | null, defaultValue: Date | null = null): Date | null {
  if (!dateString) return defaultValue;
  
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? defaultValue : date;
}

export { validateEventRequest } 