// app/api/event-types/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/event-types - Get all event types
export async function GET() {
  try {
    const eventTypes = await prisma.eventType.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    
    return NextResponse.json(eventTypes);
  } catch (error) {
    console.error('Error fetching event types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event types' },
      { status: 500 }
    );
  }
}

// POST /api/event-types - Create a new event type (admin only)
export async function POST(request: Request) {
  // Add admin check here if needed
  
  try {
    const data = await request.json();
    
    const eventType = await prisma.eventType.create({
      data: {
        name: data.name,
        color: data.color,
      },
    });
    
    return NextResponse.json(eventType);
  } catch (error) {
    console.error('Error creating event type:', error);
    return NextResponse.json(
      { error: 'Failed to create event type' },
      { status: 500 }
    );
  }
}