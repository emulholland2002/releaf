/**
 * Loading Component
 *
 * Displays a loading spinner and message while grants page is being loaded.
 * This component is shown during page transitions.
 */
import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-blue-50">
      <div className="text-center">
        {/* Animated spinner icon from Lucide icons */}
        <Loader2 className="h-10 w-10 animate-spin text-green-600 mx-auto mb-4" />
        {/* Loading message to inform the user */}
        <p className="text-gray-600">Loading Grants...</p>
      </div>
    </div>
  )
}
