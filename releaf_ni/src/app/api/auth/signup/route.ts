/**
 * User Registration API
 * 
 * This API endpoint handles user registration by creating new user accounts.
 * It validates input data, checks for existing users, hashes passwords,
 * and creates new user records in the database.
 * 
 * @file app/api/auth/register/route.ts
 */

import { NextResponse } from "next/server"
import { hash } from "bcrypt"
import prisma from "@/app/client"

/**
 * Type definition for registration request data
 */
type RegistrationRequest = {
  name: string;
  email: string;
  password: string;
}

/**
 * Validates user registration input data
 * 
 * @param data The registration data to validate
 * @returns An object containing validation result and any error messages
 */
function validateRegistrationData(data: RegistrationRequest): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Validate name
  if (!data.name || data.name.trim().length === 0) {
    errors.push("Name is required")
  } else if (data.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long")
  }

  // Validate email
  if (!data.email || data.email.trim().length === 0) {
    errors.push("Email is required")
  } else {
    // More comprehensive email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      errors.push("Please provide a valid email address")
    }
  }

  // Validate password
  if (!data.password) {
    errors.push("Password is required")
  } else if (data.password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  } else {
    // Check password strength
    const hasUpperCase = /[A-Z]/.test(data.password)
    const hasLowerCase = /[a-z]/.test(data.password)
    const hasNumbers = /\d/.test(data.password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(data.password)
    
    if (!(hasUpperCase && hasLowerCase && (hasNumbers || hasSpecialChar))) {
      errors.push("Password must contain uppercase, lowercase, and either numbers or special characters")
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * POST handler for user registration API endpoint
 * Creates a new user account
 * 
 * @param request The incoming request object
 * @returns A JSON response with the created user or error details
 */
export async function POST(request: Request) {
  console.log("API: Processing user registration request")
  
  try {
    // Parse request body
    let data: RegistrationRequest
    try {
      data = await request.json()
    } catch (error) {
      console.error("Failed to parse request body:", error)
      return NextResponse.json({ 
        success: false,
        message: "Invalid request format" 
      }, { status: 400 })
    }

    // Validate input data
    const { isValid, errors } = validateRegistrationData(data)
    if (!isValid) {
      console.warn("Registration validation failed:", errors)
      return NextResponse.json({ 
        success: false,
        message: "Validation failed", 
        errors 
      }, { status: 400 })
    }

    // Sanitize inputs (trim whitespace)
    const name = data.name.trim()
    const email = data.email.trim().toLowerCase()
    const { password } = data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      console.warn(`Registration attempt with existing email: ${email}`)
      return NextResponse.json({ 
        success: false,
        message: "User with this email already exists" 
      }, { status: 409 })
    }

    // Hash the password
    const hashedPassword = await hash(password, 10)

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    console.log(`User created successfully: ${email} (ID: ${user.id})`)

    // Return the user without the password
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        message: "User created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating user:", error)
    
    // Handle specific Prisma errors
    if (error.code === "P2002") {
      return NextResponse.json({ 
        success: false,
        message: "A user with this information already exists" 
      }, { status: 409 })
    }
    
    // Generic error response
    return NextResponse.json({ 
      success: false,
      message: "Failed to create user account",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }
}