// Import NextRequest from next/server to create mock HTTP requests
import { NextRequest } from "next/server"
// Import the POST and DELETE handlers from event attendance API route
import { POST, DELETE } from "@/app/api/events/[id]/attend/route"
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

describe("Event Attendance API", () => {
  it("registers a user for an event successfully", async () => {
    // Mock user in database
    prismaMock.user.findUnique.mockResolvedValue({
      id: "user-123",
      email: "test@example.com",
      name: "Test User"
    } as any)

    // Mock event in database
    prismaMock.event.findUnique.mockResolvedValue({
      id: "event-456",
      title: "Community Cleanup"
    } as any)

    // Mock the upsert operation to create a new attendance record
    prismaMock.userEvent.upsert.mockResolvedValue({
      userId: "user-123",
      eventId: "event-456",
      status: "attending",
      addedAt: new Date()
    } as any)

    // Create a mock HTTP request with attendance data
    const req = new NextRequest("http://localhost:3000/api/events/event-456/attend", {
      method: "POST",
      body: JSON.stringify({
        status: "attending"
      })
    })

    // Create a mock context with event ID
    const context = {
      params: Promise.resolve({ id: "event-456" })
    }

    // Call the API handler with the mock request and context
    const response = await POST(req, context)
    // Parse the JSON response body
    const data = await response.json()

    // Verify the response status code is 200 (OK)
    expect(response.status).toBe(200)
    
    // Check that the response contains the expected attendance data
    expect(data).toHaveProperty("userId", "user-123")
    expect(data).toHaveProperty("eventId", "event-456")
    expect(data).toHaveProperty("status", "attending")
    expect(data).toHaveProperty("message")
    
    // Verify that Prisma was called with the correct parameters
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
      select: { id: true }
    })
    
    expect(prismaMock.event.findUnique).toHaveBeenCalledWith({
      where: { id: "event-456" }
    })
    
    expect(prismaMock.userEvent.upsert).toHaveBeenCalledWith({
      where: {
        userId_eventId: {
          userId: "user-123",
          eventId: "event-456"
        }
      },
      update: { status: "attending" },
      create: {
        userId: "user-123",
        eventId: "event-456",
        status: "attending"
      }
    })
  })

  it("removes a user from an event successfully", async () => {
    // Mock user in database
    prismaMock.user.findUnique.mockResolvedValue({
      id: "user-123",
      email: "test@example.com",
      name: "Test User"
    } as any)

    // Mock event in database
    prismaMock.event.findUnique.mockResolvedValue({
      id: "event-456",
      title: "Community Cleanup"
    } as any)

    // Mock the delete operation
    prismaMock.userEvent.delete.mockResolvedValue({
      userId: "user-123",
      eventId: "event-456",
      status: "attending",
      addedAt: new Date()
    } as any)

    // Create a mock HTTP request
    const req = new NextRequest("http://localhost:3000/api/events/event-456/attend", {
      method: "DELETE"
    })

    // Create a mock context with event ID
    const context = {
      params: Promise.resolve({ id: "event-456" })
    }

    // Call the API handler with the mock request and context
    const response = await DELETE(req, context)
    // Parse the JSON response body
    const data = await response.json()

    // Verify the response status code is 200 (OK)
    expect(response.status).toBe(200)
    
    // Check that the response indicates success
    expect(data).toHaveProperty("success", true)
    expect(data).toHaveProperty("message", "Successfully removed from the event")
    
    // Verify that Prisma was called with the correct parameters
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
      select: { id: true }
    })
    
    expect(prismaMock.event.findUnique).toHaveBeenCalledWith({
      where: { id: "event-456" }
    })
    
    expect(prismaMock.userEvent.delete).toHaveBeenCalledWith({
      where: {
        userId_eventId: {
          userId: "user-123",
          eventId: "event-456"
        }
      }
    })
  })
})