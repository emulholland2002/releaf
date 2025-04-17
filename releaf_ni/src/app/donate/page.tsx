import DonationForm from "@/components/donation-form"
import { Leaf } from "lucide-react"

export default function DonatePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-4">
            <Leaf className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">Support ReLeaf NI</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your donation helps us plant more trees, restore ecosystems, and create a greener future for Northern
            Ireland.
          </p>
        </div>

        <DonationForm />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-green-50 p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold text-green-800 mb-2">£10</h3>
            <p className="text-gray-600">Plants 5 native tree saplings in local woodlands</p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold text-green-800 mb-2">£25</h3>
            <p className="text-gray-600">Provides educational materials for a school workshop</p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold text-green-800 mb-2">£50</h3>
            <p className="text-gray-600">Supports a community tree planting event</p>
          </div>
        </div>
      </div>
    </div>
  )
}
