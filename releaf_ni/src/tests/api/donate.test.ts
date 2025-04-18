import { NextRequest } from "next/server"
import { POST } from "@/app/api/donate/route"
import { describe, expect, it } from "@jest/globals"
import { prismaMock } from "../utils/singleton" // Import the prismaMock from singleton

jest.mock("next/headers", () => ({
  headers: () => new Headers(),
  cookies: () => ({ get: () => null }),
}))

jest.mock("next-auth", () => ({
  ...jest.requireActual("next-auth"),
}))

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
    // Mock the Prisma donation.create method using prismaMock
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

    // Create mock request
    const req = new NextRequest("http://localhost:3000/api/donate", {
      method: "POST",
      body: JSON.stringify({
        amount: 100,
        email: "test@example.com",
        name: "Test User",
      }),
    })

    // Call the API handler
    const response = await POST(req)
    const data = await response.json()

    // Check response
    expect(response.status).toBe(201)
    expect(data).toHaveProperty("donation.name", "Test User")
    expect(data).toHaveProperty("donation.amount", 100)
    expect(data).toHaveProperty("donation.email", "test@example.com")
  })
})