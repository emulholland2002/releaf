import { NextResponse, type NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import prisma from "@/app/client"

/**
 * Donation request body type definition
 */
type DonationRequest = {
  name: string;
  email: string;
  amount: number | string;
  message?: string;
}

/**
 * Validates a donation request
 * @param data The donation request data to validate
 * @returns An object containing validation result and any error messages
 */
function validateDonationRequest(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check for required fields
  if (!data.name) errors.push("Name is required")
  if (!data.email) errors.push("Email is required")
  if (data.amount === undefined || data.amount === null) errors.push("Amount is required")

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (data.email && !emailRegex.test(data.email)) {
    errors.push("Invalid email format")
  }

  // Validate amount is a positive number
  const amount = Number(data.amount)
  if (isNaN(amount) || amount <= 0) {
    errors.push("Amount must be a positive number")
  }

  // Validate name length
  if (data.name && (data.name.length < 2 || data.name.length > 100)) {
    errors.push("Name must be between 2 and 100 characters")
  }

  // Validate message length if provided
  if (data.message && data.message.length > 500) {
    errors.push("Message must be less than 500 characters")
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * POST handler for donation API endpoint
 * Creates a new donation record in the database
 * 
 * @param request The incoming request object
 * @returns A JSON response with the created donation or error details
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body: DonationRequest
    try {
      body = await request.json()
    } catch (error) {
      console.error("Failed to parse request body:", error)
      return NextResponse.json({ 
        success: false, 
        error: "Invalid request body" 
      }, { status: 400 })
    }

    // Validate request data
    const { isValid, errors } = validateDonationRequest(body)
    if (!isValid) {
      console.warn("Validation failed for donation request:", errors)
      return NextResponse.json({ 
        success: false, 
        error: "Validation failed", 
        details: errors 
      }, { status: 400 })
    }

    // Extract and normalize data
    const { name, email, message = "" } = body
    const amount = Number.parseFloat(body.amount as string)

    // Get the current user session (if authenticated)
    let userId = null
    try {
      const session = await getServerSession()
      
      // Find user by email if logged in
      if (session?.user?.email) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { id: true },
        })

        if (user) {
          userId = user.id
          console.log(`User found: ${session.user.email} (ID: ${userId})`)
        } else {
          console.log(`User session found but no matching user in database: ${session.user.email}`)
        }
      }
    } catch (error) {
      // Non-fatal error - we can continue without user association
      console.error("Error retrieving user session:", error)
      // Continue processing without user ID
    }

    // Create donation record
    try {
      const donation = await prisma.donation.create({
        data: {
          name,
          email,
          amount,
          message,
          status: "completed", // Default status for new donations
          userId, // Will be null if no user is logged in or found
        },
      })

      console.log(`Donation created successfully: ID ${donation.id}, Amount: ${donation.amount}`)

      // Return success response with created donation
      return NextResponse.json({ 
        success: true, 
        donation 
      }, { status: 201 })
    } catch (dbError) {
      console.error("Database error creating donation:", dbError)
      return NextResponse.json({ 
        success: false, 
        error: "Failed to save donation", 
        details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      }, { status: 500 })
    }
  } catch (error) {
    // Catch-all for unexpected errors
    console.error("Unhandled exception in donation API:", error)
    return NextResponse.json({ 
      success: false, 
      error: "An unexpected error occurred" 
    }, { status: 500 })
  }
}