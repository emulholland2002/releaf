import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user's events (activities they're attending)
    const userEvents = await prisma.userEvent.findMany({
      where: { userId: user.id },
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

    // Get user's created events
    const createdEvents = await prisma.event.findMany({
      where: { createdById: user.id },
      include: {
        type: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10, // Limit to 10 most recent created events
    });

    // Get user's donations
    const donations = await prisma.donation.findMany({
      where: { userId: user.id },
      orderBy: {
        createdAt: "desc",
      },
      take: 10, // Limit to 10 most recent donations
    });

    // Format the activities
    const formattedUserEvents = userEvents.map((userEvent) => ({
      id: `event-${userEvent.eventId}`,
      type: "Event Registration",
      description: `Registered for ${userEvent.event.title}`,
      date: userEvent.addedAt.toISOString(),
      status: userEvent.status,
      eventType: userEvent.event.type?.name || "Event",
      eventColor: userEvent.event.type?.color || "bg-gray-100",
    }));

    const formattedCreatedEvents = createdEvents.map((event) => ({
      id: `created-${event.id}`,
      type: "Event Creation",
      description: `Created event: ${event.title}`,
      date: event.createdAt.toISOString(),
      eventType: event.type?.name || "Event",
      eventColor: event.type?.color || "bg-gray-100",
    }));

    const formattedDonations = donations.map((donation) => ({
      id: `donation-${donation.id}`,
      type: "Donation",
      description: donation.message
        ? `Donated £${donation.amount} - "${donation.message}"`
        : `Donated £${donation.amount}`,
      date: donation.createdAt.toISOString(),
      amount: donation.amount,
    }));

    // Combine all activities and sort by date (newest first)
    const allActivities = [
      ...formattedUserEvents,
      ...formattedCreatedEvents,
      ...formattedDonations,
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Calculate activities this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const activitiesThisMonth = allActivities.filter(
      (activity) => new Date(activity.date) >= startOfMonth
    ).length;

    return NextResponse.json({
      activities: allActivities.slice(0, 10), // Return top 10 most recent
      activitiesThisMonth,
      totalActivities: allActivities.length,
    });
  } catch (error) {
    console.error("Error fetching user activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}