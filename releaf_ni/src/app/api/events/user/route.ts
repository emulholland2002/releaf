/**
 * API Route: User Activities
 * 
 * This endpoint retrieves a user's recent activities including:
 * - Events they're attending
 * - Events they've created
 * - Donations they've made
 * 
 * The endpoint requires authentication and returns the most recent activities,
 * along with summary statistics.
 * 
 * @file app/api/user/activities/route.ts
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma client for database operations
const prisma = new PrismaClient();

/**
 * Type definitions for better code documentation and type safety
 */
type Activity = {
  id: string;
  type: string;
  description: string;
  date: string;
  status?: string;
  eventType?: string;
  eventColor?: string;
  amount?: number;
};

type ActivityResponse = {
  activities: Activity[];
  activitiesThisMonth: number;
  totalActivities: number;
};

/**
 * Formats event registrations into activity objects
 * 
 * @param userEvents Array of user event registrations from Prisma
 * @returns Array of formatted activity objects
 */
function formatEventRegistrations(userEvents: any[]): Activity[] {
  return userEvents.map((userEvent) => ({
    id: `event-${userEvent.eventId}`,
    type: "Event Registration",
    description: `Registered for ${userEvent.event.title}`,
    date: userEvent.addedAt.toISOString(),
    status: userEvent.status,
    eventType: userEvent.event.type?.name || "Event",
    eventColor: userEvent.event.type?.color || "bg-gray-100",
  }));
}

/**
 * Formats created events into activity objects
 * 
 * @param events Array of events created by the user from Prisma
 * @returns Array of formatted activity objects
 */
function formatCreatedEvents(events: any[]): Activity[] {
  return events.map((event) => ({
    id: `created-${event.id}`,
    type: "Event Creation",
    description: `Created event: ${event.title}`,
    date: event.createdAt.toISOString(),
    eventType: event.type?.name || "Event",
    eventColor: event.type?.color || "bg-gray-100",
  }));
}

/**
 * Formats donations into activity objects
 * 
 * @param donations Array of donations made by the user from Prisma
 * @returns Array of formatted activity objects
 */
function formatDonations(donations: any[]): Activity[] {
  return donations.map((donation) => ({
    id: `donation-${donation.id}`,
    type: "Donation",
    description: donation.message
      ? `Donated £${donation.amount} - "${donation.message}"`
      : `Donated £${donation.amount}`,
    date: donation.createdAt.toISOString(),
    amount: donation.amount,
  }));
}

/**
 * Calculates the number of activities that occurred this month
 * 
 * @param activities Array of activity objects
 * @returns Number of activities that occurred this month
 */
function countActivitiesThisMonth(activities: Activity[]): number {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  return activities.filter(
    (activity) => new Date(activity.date) >= startOfMonth
  ).length;
}

/**
 * GET handler for user activities API endpoint
 * Retrieves a user's recent activities across different types
 * 
 * @returns A JSON response with activities or error details
 */
export async function GET(request: Request) {
  console.log("API: Fetching user activities");
  
  try {
    // Get the authenticated user session
    const session = await getServerSession();

    // Check authentication
    if (!session || !session.user?.email) {
      console.warn("Unauthorized attempt to access user activities");
      return NextResponse.json({ 
        error: "Authentication required to access activities" 
      }, { status: 401 });
    }

    const userEmail = session.user.email;
    console.log(`Fetching activities for user: ${userEmail}`);

    // Find the user in the database
    try {
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
        select: { id: true },
      });

      if (!user) {
        console.warn(`User not found for email: ${userEmail}`);
        return NextResponse.json({ 
          error: "User not found in the database" 
        }, { status: 404 });
      }

      const userId = user.id;
      
      // Get user's events (activities they're attending)
      const userEvents = await prisma.userEvent.findMany({
        where: { userId },
        include: {
          event: {
            include: {
              type: true,
            },
          },
        },
        orderBy: {
          addedAt: "desc",
        },
        take: 10, // Limit to 10 most recent activities
      });
      console.log(`Retrieved ${userEvents.length} event registrations`);

      // Get user's created events
      const createdEvents = await prisma.event.findMany({
        where: { createdById: userId },
        include: {
          type: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10, // Limit to 10 most recent created events
      });
      console.log(`Retrieved ${createdEvents.length} created events`);

      // Get user's donations
      const donations = await prisma.donation.findMany({
        where: { userId },
        orderBy: {
          createdAt: "desc",
        },
        take: 10, // Limit to 10 most recent donations
      });
      console.log(`Retrieved ${donations.length} donations`);

      // Format the activities
      const formattedUserEvents = formatEventRegistrations(userEvents);
      const formattedCreatedEvents = formatCreatedEvents(createdEvents);
      const formattedDonations = formatDonations(donations);

      // Combine all activities and sort by date (newest first)
      const allActivities = [
        ...formattedUserEvents,
        ...formattedCreatedEvents,
        ...formattedDonations,
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // Calculate activities this month
      const activitiesThisMonth = countActivitiesThisMonth(allActivities);

      // Prepare the response
      const response: ActivityResponse = {
        activities: allActivities.slice(0, 10), // Return top 10 most recent
        activitiesThisMonth,
        totalActivities: allActivities.length,
      };

      console.log(`Returning ${response.activities.length} activities (${response.activitiesThisMonth} this month, ${response.totalActivities} total)`);
      
      return NextResponse.json(response);
    } catch (dbError) {
      console.error("Database error while fetching activities:", dbError);
      return NextResponse.json({ 
        error: "Failed to retrieve user activities",
        details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      }, { status: 500 });
    }
  } catch (error) {
    // Catch-all for unexpected errors
    console.error("Unhandled exception in user activities API:", error);
    return NextResponse.json({ 
      error: "An unexpected error occurred while retrieving activities",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}