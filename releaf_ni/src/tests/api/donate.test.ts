import { NextRequest } from "next/server"
import { POST } from "@/app/api/donate/route"
import { describe, expect, it } from "@jest/globals"
import { prismaMock } from "../utils/singleton" 

// Mock next/headers to prevent actual header operations
jest.mock("next/headers", () => ({
  headers: () => new Headers(),
  cookies: () => ({ get: () => null }),
}))

// Preserve actual next-auth implementation with overrides
jest.mock("next-auth", () => ({
  ...jest.requireActual("next-auth"),
}))

// Mock authentication to simulate logged-in user
jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn().mockResolvedValue({
    user: {
      id: "mock-user-id",
      name: "Test User",
      email: "test@example.com",
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  }),
}))

describe("Donate API", () => {
  it("creates a donation successfully", async () => {
    // Mock database to return predefined donation
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

    // Create mock HTTP request with test data
    const req = new NextRequest("http://localhost:3000/api/donate", {
      method: "POST",
      body: JSON.stringify({
        amount: 100,
        email: "test@example.com",
        name: "Test User",
      }),
    })

    // Execute API handler with mocked dependencies
    const response = await POST(req)
    const data = await response.json()

    // Verify response
    expect(response.status).toBe(201)
    expect(data).toHaveProperty("donation.name", "Test User")
    expect(data).toHaveProperty("donation.amount", 100)
    expect(data).toHaveProperty("donation.email", "test@example.com")
  })
})