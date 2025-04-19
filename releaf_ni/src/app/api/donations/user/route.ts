/**
 * API Route: Donation History
 * 
 * This endpoint retrieves a user's donation history for the past N months,
 * aggregated by month. It requires authentication and returns both the
 * monthly breakdown and total amount donated.
 */

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import prisma from "@/app/client"


// Define types for better code documentation and type safety
type DonationRecord = {
  id: string;
  amount: number;
  createdAt: Date;
}

type MonthlyDonation = {
  month: string;
  amount: number;
}

type DonationResponse = {
  donations: MonthlyDonation[];
  total: number;
}

/**
 * Calculates the start date for the donation history query
 * 
 * @param monthsBack Number of months to look back
 * @returns Date object set to the first day of the month N months ago
 */
function calculateStartDate(monthsBack: number): Date {
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - monthsBack)
  startDate.setDate(1) // First day of month
  startDate.setHours(0, 0, 0, 0) // Start of day
  return startDate
}

/**
 * Aggregates donations by month
 * 
 * @param donations Array of donation records
 * @param months Number of months to include in the result
 * @returns Map of month names to donation amounts
 */
function aggregateDonationsByMonth(donations: DonationRecord[], months: number): Map<string, number> {
  const donationsByMonth = new Map<string, number>()

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
    if (donationsByMonth.has(monthKey)) {
      const currentAmount = donationsByMonth.get(monthKey) || 0
      donationsByMonth.set(monthKey, currentAmount + donation.amount)
    }
  })

  return donationsByMonth
}

/**
 * GET handler for donation history API endpoint
 * Retrieves a user's donation history aggregated by month
 * 
 * @param request The incoming request object
 * @returns A JSON response with donation history or error details
 */
export async function GET(request: Request) {
  // Get query parameters (if any)
  const url = new URL(request.url)
  const monthsParam = url.searchParams.get("months")
  
  // Default to 6 months, but allow customization via query parameter
  let months = 6
  
  // Validate months parameter if provided
  if (monthsParam) {
    const parsedMonths = parseInt(monthsParam, 10)
    if (isNaN(parsedMonths) || parsedMonths < 1 || parsedMonths > 24) {
      return NextResponse.json({ 
        error: "Invalid 'months' parameter. Must be a number between 1 and 24." 
      }, { status: 400 })
    }
    months = parsedMonths
  }

  try {
    // Get the authenticated user using NextAuth
    const session = await getServerSession()

    // Check authentication
    if (!session || !session.user?.email) {
      console.warn("Unauthorized access attempt to donation history")
      return NextResponse.json({ 
        error: "Authentication required to access donation history" 
      }, { status: 401 })
    }

    const userEmail = session.user.email
    console.log(`Fetching donation history for user: ${userEmail}, months: ${months}`)

    // Calculate start date for the query
    const startDate = calculateStartDate(months)

    try {
      // Get all donations in the specified period
      const donations = await prisma.donation.findMany({
        where: {
          email: userEmail,
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

      console.log(`Found ${donations.length} donations for user ${userEmail} since ${startDate.toISOString()}`)

      // Process donations by month
      const donationsByMonth = aggregateDonationsByMonth(donations, months)

      // Convert to array and reverse to get chronological order
      const formattedDonations = Array.from(donationsByMonth, ([month, amount]) => ({
        month,
        amount,
      })).reverse()

      // Calculate total donated
      const totalDonated = donations.reduce((sum, donation) => sum + donation.amount, 0)

      // Return the donation data
      const response: DonationResponse = {
        donations: formattedDonations,
        total: totalDonated,
      }

      return NextResponse.json(response)
    } catch (dbError) {
      console.error("Database error while fetching donations:", dbError)
      return NextResponse.json({ 
        error: "Failed to retrieve donation records",
        details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      }, { status: 500 })
    }
  } catch (error) {
    // Catch-all for unexpected errors
    console.error("Unhandled exception in donation history API:", error)
    return NextResponse.json({ 
      error: "An unexpected error occurred while retrieving donation history" 
    }, { status: 500 })
  }
}