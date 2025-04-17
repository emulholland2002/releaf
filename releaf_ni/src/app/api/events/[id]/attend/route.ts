// app/api/events/[id]/attend/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/events/[id]/attend - Attend an event
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const eventId = params.id;
  
  if (!session || !session.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const data = await request.json();
    const status = data.status || 'attending'; // Default to attending
    
    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    // Create or update attendance record
    const userEvent = await prisma.userEvent.upsert({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId,
        },
      },
      update: {
        status,
      },
      create: {
        userId: session.user.id,
        eventId,
        status,
      },
    });
    
    return NextResponse.json(userEvent);
  } catch (error) {
    console.error('Error updating attendance:', error);
    return NextResponse.json(
      { error: 'Failed to update attendance' },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id]/attend - Remove attendance from an event
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const eventId = params.id;
  
  if (!session || !session.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    // Delete the attendance record
    await prisma.userEvent.delete({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId,
        },
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing attendance:', error);
    return NextResponse.json(
      { error: 'Failed to remove attendance' },
      { status: 500 }
    );
  }
}