// Import NextRequest from next/server to create mock HTTP requests
import { NextRequest } from "next/server"
// Import the POST handler from registration API route
import { POST } from "@/app/api/auth/signup/route"
// Import Jest testing utilities for structuring tests and making assertions
import { describe, expect, it } from "@jest/globals"
// Import the prismaMock from singleton utility to mock database operations
import { prismaMock } from "../utils/singleton"

// Mock the bcrypt module to prevent actual password hashing during tests
jest.mock("bcrypt", () => ({
  // Mock the hash function to return a predictable hashed password
  hash: jest.fn().mockResolvedValue("mocked-hashed-password"),
}))

describe("User Registration API", () => {
  it("registers a new user successfully", async () => {
    // Mock Prisma findUnique to return null (user doesn't exist yet)
    prismaMock.user.findUnique.mockResolvedValue(null)

    // Mock Prisma create to return a predefined user object
    prismaMock.user.create.mockResolvedValue({
      id: "test-user-id",
      name: "Test User",
      email: "test@example.com",
      password: "mocked-hashed-password",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Create a mock HTTP request with valid registration data
    const req = new NextRequest("http://localhost:3000/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        password: "Password123!",
      }),
    })

    // Call the API handler with the mock request
    const response = await POST(req)
    // Parse the JSON response body
    const data = await response.json()

    // Verify the response status code is 201 (Created)
    expect(response.status).toBe(201)
    // Check that the response contains the expected success message
    expect(data).toHaveProperty("success", true)
    expect(data).toHaveProperty("message", "User created successfully")
    // Check that the response contains the user data (without password)
    expect(data).toHaveProperty("user.name", "Test User")
    expect(data).toHaveProperty("user.email", "test@example.com")
    // Ensure password is not included in the response
    expect(data.user).not.toHaveProperty("password")

    // Verify that Prisma was called with the correct data
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    })
    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        name: "Test User",
        email: "test@example.com",
        password: "mocked-hashed-password",
      },
    })
  })
})