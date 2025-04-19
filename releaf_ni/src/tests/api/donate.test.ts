// Import NextRequest from next/server to create mock HTTP requests
import { NextRequest } from "next/server"
// Import the POST handler from your donation API route
import { POST } from "@/app/api/donate/route"
// Import Jest testing utilities for structuring tests and making assertions
import { describe, expect, it } from "@jest/globals"
// Import the prismaMock from singleton utility to mock database operations
import { prismaMock } from "../utils/singleton" 

// Mock the next/headers module to prevent actual header operations during tests
// This replaces the real implementation with mock functions that return empty values
jest.mock("next/headers", () => ({
  // Mock the headers function to return an empty Headers object
  headers: () => new Headers(),
  // Mock the cookies function to return an object with a get method that returns null
  cookies: () => ({ get: () => null }),
}))

// Mock the next-auth module
// This preserves the actual implementation but allows for overriding specific parts
jest.mock("next-auth", () => ({
  // Spread the actual next-auth implementation to keep most functionality
  ...jest.requireActual("next-auth"),
}))

// Mock the next-auth/next module to control authentication during tests
jest.mock("next-auth/next", () => ({
  // Mock getServerSession to return a fake authenticated user session
  // This simulates a logged-in user without requiring actual authentication
  getServerSession: jest.fn().mockResolvedValue({
    user: {
      id: "mock-user-id",
      name: "Test User",
      email: "test@example.com",
    },
    // Set session expiration to 24 hours from now
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  }),
}))

// Group related tests under a descriptive name
describe("Donate API", () => {
  // Define a specific test case
  it("creates a donation successfully", async () => {
    // Mock the Prisma donation.create method to return a predefined result
    // This prevents actual database operations during testing
    prismaMock.donation.create.mockResolvedValue({
      id: "test-id",
      amount: 100,
      email: "test@example.com",
      name: "Test User",
      createdAt: new Date(),
      userId: null,
      message: null,
      status: "",
      updatedAt: new Date(),
    })

    // Create a mock HTTP request with test donation data
    // This simulates what the frontend would send to the API
    const req = new NextRequest("http://localhost:3000/api/donate", {
      method: "POST",
      body: JSON.stringify({
        amount: 100,
        email: "test@example.com",
        name: "Test User",
      }),
    })

    // Call the API handler with the mock request
    // This executes the actual API logic but with mocked dependencies
    const response = await POST(req)
    // Parse the JSON response body
    const data = await response.json()

    // Verify the response status code is 201 (Created)
    expect(response.status).toBe(201)
    // Check that the response contains the expected donation data
    // Using toHaveProperty to check nested properties in the response
    expect(data).toHaveProperty("donation.name", "Test User")
    expect(data).toHaveProperty("donation.amount", 100)
    expect(data).toHaveProperty("donation.email", "test@example.com")
  })
})