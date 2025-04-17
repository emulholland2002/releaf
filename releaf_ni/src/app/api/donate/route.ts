import { NextResponse, NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"

// Create a new PrismaClient instance
const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, amount, message } = body

    // Validate required fields
    if (!name || !email || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create donation in database
    const donation = await prisma.donation.create({
      data: {
        name,
        email,
        amount: Number.parseFloat(amount),
        message: message || "",
        status: "completed",
      },
    })

    return NextResponse.json({ success: true, donation }, { status: 201 })
  } catch (error) {
    console.error("Failed to create donation:", error)
    return NextResponse.json({ error: "Failed to create donation" }, { status: 500 })
  }
}
