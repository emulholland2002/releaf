import { NextResponse, type NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { PrismaClient } from "@prisma/client"

// Create a new PrismaClient instance
const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession()

    const body = await request.json()
    const { name, email, amount, message } = body

    // Validate required fields
    if (!name || !email || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Find user if logged in
    let userId = null
    if (session?.user?.email) {
      // FIXED: Changed variable name to avoid shadowing
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      })

      // FIXED: Extract the id from the user object
      if (user) {
        userId = user.id
        console.log("Found user ID:", userId)
      }
    } // FIXED: Added missing closing bracket

    // Create donation in database with userId if available
    const donation = await prisma.donation.create({
      data: {
        name,
        email,
        amount: Number.parseFloat(amount),
        message: message || "",
        status: "completed",
        userId: userId, // This will be null if no user is logged in
      },
    })

    console.log("Created donation:", donation) // Log the created donation

    return NextResponse.json({ success: true, donation }, { status: 201 })
  } catch (error) {
    console.error("Failed to create donation:", error)
    return NextResponse.json({ error: "Failed to create donation" }, { status: 500 })
  }
}
