/**
 * API Route: Event Types
 * 
 * This file handles the API endpoint for retrieving event types:
 * - GET: Retrieve all event types ordered by name
 * 
 * @file app/api/event-types/route.ts
 */

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client for database operations
// Using a single instance to avoid connection issues
const prisma = new PrismaClient();

/**
 * Type definition for event type response
 * This helps with documentation and type safety
 */
type EventType = {
  id: string;
  name: string;
  color: string;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * GET handler for event types API endpoint
 * Retrieves all event types ordered by name
 * 
 * @returns A JSON response with event types or error details
 */
export async function GET() {
  console.log("API: Fetching all event types");
  
  try {
    // Query database for all event types
    const eventTypes = await prisma.eventType.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    
    // Log success with count of retrieved items
    console.log(`Successfully retrieved ${eventTypes.length} event types`);
    
    // Return the event types
    return NextResponse.json(eventTypes);
  } catch (error) {
    // Log the error with details for server-side debugging
    console.error('Error fetching event types:', error);
    
    // Determine if we're in development mode
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // Return a structured error response
    // Include detailed error in development mode only
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch event types',
        message: 'An error occurred while retrieving event types from the database',
        details: isDevelopment ? error.message : undefined
      },
      { status: 500 }
    );
  }
}