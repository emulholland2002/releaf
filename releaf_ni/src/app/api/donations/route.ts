// app/api/donations/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"

// Create a new PrismaClient instance
const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    // Get session
    const session = await getServerSession()
    
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.amount) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, and amount are required" },
        { status: 400 },
      )
    }

    // Create donation record
    const donation = await prisma.donation.create({
      data: {
        name: data.name,
        email: data.email,
        amount: data.amount,
        message: data.message,
        status: "pending",
        // Link to user if logged in (using email to connect)
        ...(session?.user?.email ? { user: { connect: { email: session.user.email } } } : {}),
      },
    })

    return NextResponse.json({ success: true, donation }, { status: 201 })
  } catch (error) {
    console.error("Error creating donation:", error)
    return NextResponse.json({ error: "An error occurred while processing your donation" }, { status: 500 })
  }
}