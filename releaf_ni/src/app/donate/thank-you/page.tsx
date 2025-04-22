/**
 * ThankYouPage Component
 *
 * A confirmation page displayed after a successful donation.
 * Features animated elements, confetti celebration effect,
 * and personalised messaging based on URL parameters.
 */
"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Heart, Share2, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useEffect } from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"

export default function ThankYouPage() {
  // Extract donor name and donation amount from URL query parameters
  // Provide fallback values if parameters are not present
  const searchParams = useSearchParams()
  const name = searchParams.get("name") || "Donor"
  const amount = searchParams.get("amount") || "0"

  useEffect(() => {
    // Launch confetti animation when the component mounts
    // Creates a celebratory effect for the successful donation
    confetti({
      particleCount: 100, 
      spread: 70, 
      origin: { y: 0.6 }, 
    })
  }, []) // Empty dependency array ensures this runs only once on mount

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        {/* Wrapper motion div for the entire card with initial fade-in and slide-up animation */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-none shadow-lg overflow-hidden">
            {/* Decorative colored bar at the top of the card */}
            <div className="h-3 bg-gradient-to-r from-green-400 via-green-500 to-teal-500" />

            <div className="pt-8 px-6 text-center">
              {/* Animated success icon with spring animation for a bouncy effect */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto bg-green-100 rounded-full p-3 w-20 h-20 flex items-center justify-center mb-6"
              >
                <CheckCircle className="h-12 w-12 text-green-600" />
              </motion.div>

              {/* "Thank You" heading with delayed fade-in animation */}
              <motion.h1
                className="text-3xl font-bold text-gray-800 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Thank You!
              </motion.h1>

              {/* Confirmation text and donation amount with delayed fade-in */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <p className="text-gray-600 mb-2">Your donation has been received</p>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                  <span className="text-2xl font-bold text-gray-800">£{amount}</span>
                </div>
              </motion.div>
            </div>

            <CardContent className="px-6 pb-6">
              {/* Personalised thank you message in a highlighted box */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100"
              >
                <p className="text-gray-700">
                  Thank you, <span className="font-semibold">{name}</span>, for your generous contribution. Your support
                  makes our work possible and creates a lasting impact in our community.
                </p>
              </motion.div>

              {/* Email confirmation message with delayed fade-in */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-sm text-gray-500 text-center"
              >
                A confirmation email has been sent with your receipt details.
              </motion.div>
            </CardContent>

            {/* Action buttons in the card footer */}
            <CardFooter className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3 justify-center">
              {/* Return home button */}
              <Button asChild className="bg-green-600 hover:bg-green-700 flex-1">
                <Link href="/" className="flex items-center justify-center gap-2">
                  <Home className="h-4 w-4" />
                  Return Home
                </Link>
              </Button>
              {/* Share support button */}
              <Button variant="outline" className="flex-1 border-green-200 text-green-700 hover:bg-green-50">
                <Share2 className="h-4 w-4 mr-2" />
                Share Your Support
              </Button>
            </CardFooter>
          </Card>

          {/* Support link below the card with final delayed fade-in */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center mt-6 text-sm text-gray-500"
          >
            Need help?{" "}
            <Link href="/contact" className="text-green-600 hover:underline">
              Contact our support team
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
