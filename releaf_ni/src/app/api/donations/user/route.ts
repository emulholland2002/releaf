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

    const months = 6

    // Fetch donations for the specified number of months
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - months)
    startDate.setDate(1)
    startDate.setHours(0, 0, 0, 0)

    // Get all donations in the specified period
    const donations = await prisma.donation.findMany({
      where: {
        email: session.user.email,
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        id: true,
        amount: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    // Process donations by month
    const donationsByMonth = new Map()

    // Initialize with all months (even empty ones)
    for (let i = 0; i < months; i++) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = date.toLocaleString("default", { month: "short" })
      donationsByMonth.set(monthKey, 0)
    }

    // Fill in actual donation amounts
    donations.forEach((donation) => {
      const monthKey = donation.createdAt.toLocaleString("default", { month: "short" })
      const currentAmount = donationsByMonth.get(monthKey) || 0
      donationsByMonth.set(monthKey, currentAmount + donation.amount)
    })

    // Convert to array and reverse to get chronological order
    const formattedDonations = Array.from(donationsByMonth, ([month, amount]) => ({
      month,
      amount,
    })).reverse()

    // Calculate total donated (optional)
    const totalDonated = donations.reduce((sum, donation) => sum + donation.amount, 0)

    // Return just the donations data
    return NextResponse.json({
      donations: formattedDonations,
      total: totalDonated,
    })
  } catch (error) {
    console.error("Error fetching donation data:", error)
    return NextResponse.json({ error: "Failed to fetch donation data" }, { status: 500 })
  }
}
