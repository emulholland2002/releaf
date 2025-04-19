// Import NextRequest from next/server to create mock HTTP requests
import { NextRequest } from "next/server"
// Import the GET and POST handlers from your events API route
import { GET, POST, validateEventRequest } from "@/app/api/events/route"
// Import Jest testing utilities for structuring tests and making assertions
import { describe, expect, it } from "@jest/globals"
// Import the prismaMock from singleton utility to mock database operations
import { prismaMock } from "../utils/singleton"

// Mock the next-auth/next module to control authentication during tests
jest.mock("next-auth/next", () => ({
  // Mock getServerSession to return a fake authenticated user session
  getServerSession: jest.fn().mockResolvedValue({
    user: {
      name: "Test User",
      email: "test@example.com"
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  })
}))

describe("Event Request Validation", () => {
  it("validates a complete and valid event request", () => {
    // Create a valid event request with all required and optional fields
    const validEvent = {
      title: "Community Cleanup",
      date: "2023-12-15T10:00:00Z",
      endDate: "2023-12-15T14:00:00Z",
      location: "City Park",
      description: "Join us for a community cleanup event",
      duration: 4,
      volunteers: 10,
      typeId: "event-type-id"
    }

    // Call the validation function with the valid event data
    const result = validateEventRequest(validEvent)

    // Verify the validation passes with no errors
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })
})

describe("Events API", () => {
  // Test the GET endpoint happy path
  it("retrieves events successfully", async () => {
    // Create sample dates for testing
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    // Mock events in database
    const mockEvents = [
      {
        id: "event-1",
        title: "Community Cleanup",
        date: today,
        location: "City Park",
        description: "Join us for a community cleanup event",
        duration: 4,
        volunteers: 10,
        type: {
          name: "Volunteer",
          color: "bg-green-100"
        },
        createdBy: {
          id: "user-123",
          name: "Test User"
        },
        userEvents: [
          {
            user: {
              id: "user-123",
              name: "Test User"
            },
            status: "attending"
          }
        ]
      },
      {
        id: "event-2",
        title: "Fundraising Gala",
        date: tomorrow,
        location: "Community Center",
        description: "Annual fundraising event",
        duration: 3,
        volunteers: 5,
        type: {
          name: "Fundraiser",
          color: "bg-blue-100"
        },
        createdBy: {
          id: "user-456",
          name: "Another User"
        },
        userEvents: []
      }
    ]
    
    // Mock Prisma to return sample events
    prismaMock.event.findMany.mockResolvedValue(mockEvents as any)

    // Create a mock HTTP request
    const req = new NextRequest("http://localhost:3000/api/events")

    // Call the API handler with the mock request
    const response = await GET(req)
    // Parse the JSON response body
    const data = await response.json()

    // Verify the response status code is 200 (OK)
    expect(response.status).toBe(200)
    
    // Check that the response contains the expected events
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBe(2)
    
    // Verify the first event has the expected properties
    expect(data[0]).toHaveProperty("id", "event-1")
    expect(data[0]).toHaveProperty("title", "Community Cleanup")
    expect(data[0]).toHaveProperty("type", "Volunteer")
    expect(data[0]).toHaveProperty("typeColor", "bg-green-100")
    expect(data[0]).toHaveProperty("attendees", 1)
    
    // Verify that Prisma was called with the correct parameters
    expect(prismaMock.event.findMany).toHaveBeenCalledWith({
      where: {},
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
  })

  // Test the POST endpoint happy path
  it("creates a new event successfully", async () => {
    // Mock user in database
    prismaMock.user.findUnique.mockResolvedValue({
      id: "user-123",
      name: "Test User",
      email: "test@example.com"
    } as any)

    // Mock event type if needed
    prismaMock.eventType.findUnique.mockResolvedValue({
      id: "type-1",
      name: "Volunteer",
      color: "bg-green-100"
    } as any)

    // Create a sample event to be returned after creation
    const createdEvent = {
      id: "event-new",
      title: "New Community Event",
      date: new Date("2023-12-20T10:00:00Z"),
      location: "Downtown",
      description: "A brand new community event",
      duration: 2,
      volunteers: 5,
      type: {
        name: "Volunteer",
        color: "bg-green-100"
      },
      createdBy: {
        id: "user-123",
        name: "Test User"
      },
      userEvents: [
        {
          user: {
            id: "user-123",
            name: "Test User"
          },
          status: "attending"
        }
      ]
    }

    // Mock Prisma to return the created event
    prismaMock.event.create.mockResolvedValue(createdEvent as any)

    // Create a mock HTTP request with event data
    const req = new NextRequest("http://localhost:3000/api/events", {
      method: "POST",
      body: JSON.stringify({
        title: "New Community Event",
        date: "2023-12-20T10:00:00Z",
        location: "Downtown",
        description: "A brand new community event",
        duration: 2,
        volunteers: 5,
        typeId: "type-1"
      })
    })

    // Call the API handler with the mock request
    const response = await POST(req)
    // Parse the JSON response body
    const data = await response.json()

    // Verify the response status code is 201 (Created)
    expect(response.status).toBe(201)
    
    // Check that the response contains the expected event data
    expect(data).toHaveProperty("id", "event-new")
    expect(data).toHaveProperty("title", "New Community Event")
    expect(data).toHaveProperty("type", "Volunteer")
    expect(data).toHaveProperty("typeColor", "bg-green-100")
    expect(data).toHaveProperty("createdBy", "Test User")
    expect(data).toHaveProperty("attendees", 1)
    
    // Verify that Prisma was called with the correct parameters
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: {
        email: "test@example.com",
      },
      select: {
        id: true,
      },
    })
    
    // Verify event creation was called with correct data
    expect(prismaMock.event.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        title: "New Community Event",
        date: expect.any(Date),
        location: "Downtown",
        description: "A brand new community event",
        duration: 2,
        volunteers: 5,
        createdBy: {
          connect: { id: "user-123" },
        },
        userEvents: {
          create: {
            userId: "user-123",
            status: "attending",
          },
        },
      }),
      include: expect.any(Object)
    })
  })
})