/**
 * API Route: Event Attendance
 * 
 * This file handles API endpoints for managing user attendance to events:
 * - POST: Register or update attendance status for an event
 * - DELETE: Remove attendance from an event
 * 
 * @file app/api/events/[id]/attend/route.ts
 */

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import prisma from "@/app/client"

/**
 * Type definitions for better code documentation and type safety
 */
type AttendanceRequest = {
  status?: string;
};

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * Validates the event ID from the route parameters
 * 
 * @param eventId The event ID to validate
 * @returns True if the ID is valid, false otherwise
 */
function validateEventId(eventId: string): boolean {
  // Check if the ID is not empty and has a valid format
  // This validation can be adjusted based on your ID format
  return !!eventId && eventId.trim().length > 0;
}

/**
 * Validates the attendance status
 * 
 * @param status The attendance status to validate
 * @returns An object containing validation result and any error message
 */
function validateAttendanceStatus(status: string): { isValid: boolean; error?: string } {
  // List of valid attendance statuses
  const validStatuses = ["attending", "maybe", "not_attending", "waitlist"];
  
  if (!validStatuses.includes(status)) {
    return { 
      isValid: false, 
      error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
    };
  }
  
  return { isValid: true };
}

/**
 * Gets the authenticated user from the session
 * 
 * @returns An object containing the user ID if found, or an error response
 */
async function getAuthenticatedUser(): Promise<{ userId?: string; errorResponse?: NextResponse }> {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      console.warn("Unauthorized attempt to access attendance API");
      return { 
        errorResponse: NextResponse.json(
          { error: "Authentication required" }, 
          { status: 401 }
        ) 
      };
    }
    
    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    
    if (!user) {
      console.warn(`User not found for email: ${session.user.email}`);
      return { 
        errorResponse: NextResponse.json(
          { error: "User not found in the database" }, 
          { status: 404 }
        ) 
      };
    }
    
    return { userId: user.id };
  } catch (error) {
    console.error("Error authenticating user:", error);
    return { 
      errorResponse: NextResponse.json(
        { 
          error: "Authentication failed",
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, 
        { status: 500 }
      ) 
    };
  }
}

/**
 * Checks if an event exists
 * 
 * @param eventId The ID of the event to check
 * @returns An object containing the event if found, or an error response
 */
async function checkEventExists(eventId: string): Promise<{ event?: any; errorResponse?: NextResponse }> {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    
    if (!event) {
      console.warn(`Event not found with ID: ${eventId}`);
      return { 
        errorResponse: NextResponse.json(
          { error: "Event not found" }, 
          { status: 404 }
        ) 
      };
    }
    
    return { event };
  } catch (error) {
    console.error(`Error checking if event exists (ID: ${eventId}):`, error);
    return { 
      errorResponse: NextResponse.json(
        { 
          error: "Failed to verify event",
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, 
        { status: 500 }
      ) 
    };
  }
}

/**
 * POST handler for event attendance API endpoint
 * Registers or updates a user's attendance status for an event
 * 
 * @param request The incoming request object
 * @param context The route context containing the event ID
 * @returns A JSON response with the attendance record or error details
 */
export async function POST(
  request: Request,
  context: RouteContext
) {
  console.log("API: Updating event attendance");
  
  try {
    // Get and validate the event ID
    const params = await context.params;
    const eventId = params.id;
    
    if (!validateEventId(eventId)) {
      return NextResponse.json(
        { error: "Invalid event ID" }, 
        { status: 400 }
      );
    }
    
    // Get the authenticated user
    const { userId, errorResponse: authError } = await getAuthenticatedUser();
    if (authError) return authError;
    
    // Check if the event exists
    const { errorResponse: eventError } = await checkEventExists(eventId);
    if (eventError) return eventError;
    
    // Parse and validate the request body
    let data: AttendanceRequest;
    try {
      data = await request.json();
    } catch (error) {
      console.error("Failed to parse request body:", error);
      return NextResponse.json(
        { error: "Invalid request body" }, 
        { status: 400 }
      );
    }
    
    // Default to "attending" if no status is provided
    const status = data.status || "attending";
    
    // Validate the attendance status
    const { isValid, error } = validateAttendanceStatus(status);
    if (!isValid) {
      return NextResponse.json(
        { error }, 
        { status: 400 }
      );
    }
    
    // Create or update attendance record
    const userEvent = await prisma.userEvent.upsert({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
      update: { status },
      create: {
        userId,
        eventId,
        status,
      },
    });
    
    console.log(`User ${userId} ${userEvent.id ? 'updated' : 'registered'} for event ${eventId} with status: ${status}`);
    
    return NextResponse.json({
      ...userEvent,
      message: `Successfully ${userEvent.id ? 'updated' : 'registered'} for the event.`
    });
  } catch (error) {
    console.error("Error updating attendance:", error);
    
    // Handle specific Prisma errors
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "You are already registered for this event" }, 
        { status: 409 }
      );
    }
    
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Event or user not found" }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        error: "Failed to update attendance",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, 
      { status: 500 }
    );
  }
}

/**
 * DELETE handler for event attendance API endpoint
 * Removes a user's attendance from an event
 * 
 * @param request The incoming request object
 * @param context The route context containing the event ID
 * @returns A JSON response with the result or error details
 */
export async function DELETE(
  request: Request,
  context: RouteContext
) {
  console.log("API: Removing event attendance");
  
  try {
    // Get and validate the event ID
    const params = await context.params;
    const eventId = params.id;
    
    if (!validateEventId(eventId)) {
      return NextResponse.json(
        { error: "Invalid event ID" }, 
        { status: 400 }
      );
    }
    
    // Get the authenticated user
    const { userId, errorResponse: authError } = await getAuthenticatedUser();
    if (authError) return authError;
    
    // Check if the event exists
    const { errorResponse: eventError } = await checkEventExists(eventId);
    if (eventError) return eventError;
    
    try {
      // Delete the attendance record
      await prisma.userEvent.delete({
        where: {
          userId_eventId: {
            userId,
            eventId,
          },
        },
      });
      
      console.log(`User ${userId} removed attendance for event ${eventId}`);
      
      return NextResponse.json({ 
        success: true,
        message: "Successfully removed from the event"
      });
    } catch (error) {
      // Handle the case where the record doesn't exist
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "You are not registered for this event" }, 
          { status: 404 }
        );
      }
      
      throw error; // Re-throw for the outer catch block
    }
  } catch (error) {
    console.error("Error removing attendance:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to remove attendance",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, 
      { status: 500 }
    );
  }
}