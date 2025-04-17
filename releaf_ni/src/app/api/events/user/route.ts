import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Export a named GET function instead of using default export
export async function GET(request: Request) {
  try {
    // Get the authenticated user using NextAuth
    const session = await getServerSession()

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({
      
    })
  } catch (error) {
    console.error("Error fetching donation data:", error)
    return NextResponse.json({ error: "Failed to fetch donation data" }, { status: 500 })
  }
}
