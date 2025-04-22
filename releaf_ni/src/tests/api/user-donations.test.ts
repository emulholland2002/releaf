// Import NextRequest from next/server to create mock HTTP requests
import { NextRequest } from "next/server"
// Import the GET handler from donation history API route
import { GET } from "@/app/api/donations/user/route"
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

describe("Donation History API", () => {
  it("returns donation history for authenticated user", async () => {
    // Create sample donation data for the past 6 months
    const today = new Date()
    const donations = [
      {
        id: "donation1",
        amount: 100,
        createdAt: new Date(today.getFullYear(), today.getMonth() - 1, 15), // Last month
        email: "test@example.com",
        name: "Test User",
        userId: null,
        message: null,
        status: "completed",
        updatedAt: new Date()
      },
      {
        id: "donation2",
        amount: 50,
        createdAt: new Date(today.getFullYear(), today.getMonth() - 3, 10), // 3 months ago
        email: "test@example.com",
        name: "Test User",
        userId: null,
        message: null,
        status: "completed",
        updatedAt: new Date()
      }
    ]

    // Mock Prisma to return the sample donations
    prismaMock.donation.findMany.mockResolvedValue(donations)

    // Create a mock HTTP request with months parameter
    const req = new NextRequest("http://localhost:3000/api/donation-history?months=6")

    // Call the API handler with the mock request
    const response = await GET(req)
    // Parse the JSON response body
    const data = await response.json()

    // Verify the response status code is 200 (OK)
    expect(response.status).toBe(200)
    
    // Check that the response contains the expected donation data
    expect(data).toHaveProperty("donations")
    expect(data).toHaveProperty("total", 150) // Sum of 100 + 50
    expect(Array.isArray(data.donations)).toBe(true)
    
    // Verify that the donations are aggregated by month
    const months = data.donations.map(d => d.month)
    expect(months).toContain(new Date(today.getFullYear(), today.getMonth() - 1, 1).toLocaleString("default", { month: "short" }))
    expect(months).toContain(new Date(today.getFullYear(), today.getMonth() - 3, 1).toLocaleString("default", { month: "short" }))
    
    // Verify that Prisma was called with the correct parameters
    expect(prismaMock.donation.findMany).toHaveBeenCalledWith({
      where: {
        email: "test@example.com",
        createdAt: {
          gte: expect.any(Date)
        }
      },
      select: {
        id: true,
        amount: true,
        createdAt: true
      },
      orderBy: {
        createdAt: "asc"
      }
    })

    // Verify that the session was checked for authentication
    expect(getServerSession).toHaveBeenCalled()
  })
})