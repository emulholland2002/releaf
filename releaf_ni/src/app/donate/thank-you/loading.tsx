import { Loader2 } from "lucide-react"

export default function Loading() {
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-blue-50">
    <div className="text-center">
      <Loader2 className="h-10 w-10 animate-spin text-green-600 mx-auto mb-4" />
        <p className="text-gray-600">Processing your donation...</p>
    </div>
  </div>
  }
  