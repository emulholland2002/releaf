// app/api/events/[id]/attend/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params object
    const params = await context.params;
    const eventId = params.id;
    
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    const data = await request.json();
    const status = data.status || "attending";
    
    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    
    // Create or update attendance record
    const userEvent = await prisma.userEvent.upsert({
      where: {
        userId_eventId: {
          userId: user.id,
          eventId,
        },
      },
      update: { status },
      create: {
        userId: user.id,
        eventId,
        status,
      },
    });
    
    return NextResponse.json(userEvent);
  } catch (error) {
    console.error("Error updating attendance:", error);
    return NextResponse.json(
      { error: "Failed to update attendance" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params object
    const params = await context.params;
    const eventId = params.id;
    
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Delete the attendance record
    await prisma.userEvent.delete({
      where: {
        userId_eventId: {
          userId: user.id,
          eventId,
        },
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing attendance:", error);
    return NextResponse.json(
      { error: "Failed to remove attendance" },
      { status: 500 }
    );
  }
}