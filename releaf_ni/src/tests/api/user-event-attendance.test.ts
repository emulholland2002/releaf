// Import NextRequest from next/server to create mock HTTP requests
import { NextRequest } from "next/server"
// Import the GET handler from your user activities API route
import { GET } from "@/app/api/events/user/route"
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

// Import after mocking to ensure we get the mocked version
import { getServerSession } from "next-auth/next"

describe("User Activities API", () => {
  it("returns user activities successfully", async () => {
    // Create sample dates for testing
    const today = new Date()
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 15)
    
    // Mock user in database
    prismaMock.user.findUnique.mockResolvedValue({
      id: "user-123",
      name: "Test User",
      email: "test@example.com"
    } as any)
    
    // Mock event registrations with the structure expected by the formatEventRegistrations function
    prismaMock.userEvent.findMany.mockResolvedValue([
      {
        userId: "user-123",
        eventId: "event-1",
        status: "attending",
        addedAt: today,
        event: {
          id: "event-1",
          title: "Community Cleanup",
          type: {
            name: "Volunteer",
            color: "bg-green-100"
          }
        }
      },
      {
        userId: "user-123",
        eventId: "event-2",
        status: "interested",
        addedAt: lastMonth,
        event: {
          id: "event-2",
          title: "Fundraising Gala",
          type: {
            name: "Fundraiser",
            color: "bg-blue-100"
          }
        }
      }
    ] as any)

    // Mock created events
    prismaMock.event.findMany.mockResolvedValue([
      {
        id: "event-3",
        title: "Workshop Series",
        createdById: "user-123",
        createdAt: today,
        type: {
          name: "Education",
          color: "bg-purple-100"
        }
      }
    ] as any)

    // Mock donations
    prismaMock.donation.findMany.mockResolvedValue([
      {
        id: "donation-1",
        userId: "user-123",
        amount: 100,
        message: "Keep up the good work!",
        createdAt: today
      },
      {
        id: "donation-2",
        userId: "user-123",
        amount: 50,
        message: null,
        createdAt: lastMonth
      }
    ] as any)

    // Create a mock HTTP request
    const req = new NextRequest("http://localhost:3000/api/user/activities")

    // Call the API handler with the mock request
    const response = await GET(req)
    // Parse the JSON response body
    const data = await response.json()

    // Verify the response status code is 200 (OK)
    expect(response.status).toBe(200)
    
    // Check that the response contains the expected activity data
    expect(data).toHaveProperty("activities")
    expect(data).toHaveProperty("activitiesThisMonth")
    expect(data).toHaveProperty("totalActivities")
    
    // Verify activities array contains the expected number of items
    expect(Array.isArray(data.activities)).toBe(true)
    expect(data.activities.length).toBeGreaterThan(0)
    
    // Verify the activities contain the expected types
    const activityTypes = data.activities.map(a => a.type)
    expect(activityTypes).toContain("Event Registration")
    expect(activityTypes).toContain("Event Creation")
    expect(activityTypes).toContain("Donation")
    
    // Verify the total count is correct (2 registrations + 1 created event + 2 donations)
    expect(data.totalActivities).toBe(5)
    
    // Verify that Prisma was called with the correct parameters
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
      select: { id: true }
    })
    
    expect(prismaMock.userEvent.findMany).toHaveBeenCalledWith({
      where: { userId: "user-123" },
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
      take: 10
    })
    
    // Verify that the session was checked for authentication
    expect(getServerSession).toHaveBeenCalled()
  })
})