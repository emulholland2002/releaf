/**
 * Home Page Component
 *
 * This is the main landing page for ReLeaf NI, showcasing the organisation's mission,
 * key initiatives, and calls to action. It features a hero section with prominent CTAs,
 * a mission statement with feature cards, and a final call to action section.
 */

// Next.js component imports
import Link from "next/link"
import Image from "next/image"

// UI component imports
import { Button } from "@/components/ui/button"

// Icon imports from Lucide React
import { TreeDeciduous, Recycle, Users } from "lucide-react"

// Image imports
import bannerImage from "../../public/images/banner.png"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - Main banner with headline, description and primary CTAs */}
      <section className="relative py-20 md:py-28 bg-green-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left column - Text content and CTA buttons */}
            <div className="space-y-6">
              {/* Main headline - Large, bold text highlighting the organization's purpose */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-green-800">
                Growing a Greener Northern Ireland
              </h1>

              {/* Subheading - Brief description of the organization's mission */}
              <p className="text-lg md:text-xl text-gray-600 max-w-[600px]">
                ReLeaf NI is dedicated to increasing tree cover, reducing carbon footprints, and creating a more
                sustainable future for Northern Ireland.
              </p>

              {/* CTA buttons - Primary and secondary action buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Primary CTA - Donation button */}
                <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                  <Link href="/donate">Donate Now</Link>
                </Button>

                {/* Secondary CTA - Carbon calculator button */}
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  <Link href="/carbon-calculator">Calculate Your Carbon Footprint</Link>
                </Button>
              </div>
            </div>

            {/* Right column - Banner image */}
            <div className="relative h-[300px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
              <Image
                src={bannerImage || "/placeholder.svg"}
                alt="Northern Ireland forest landscape"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                quality={80}
                priority={true}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section - Overview of the organization's key initiatives */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          {/* Section header with title and description */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're committed to planting trees, restoring ecosystems, and helping communities reduce their
              environmental impact.
            </p>
          </div>

          {/* Feature cards - Three columns highlighting key initiatives */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 - Tree planting initiative */}
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <TreeDeciduous className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Plant Trees</h3>
              <p className="text-gray-600">
                We've planted over 10,000 native trees across Northern Ireland, creating new habitats and carbon sinks.
              </p>
            </div>

            {/* Feature 2 - Carbon reduction initiative */}
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Recycle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Reduce Carbon</h3>
              <p className="text-gray-600">
                Our carbon calculator helps individuals and businesses understand and reduce their environmental impact.
              </p>
            </div>

            {/* Feature 3 - Education initiative */}
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Educate Communities</h3>
              <p className="text-gray-600">
                We work with schools and community groups to promote environmental awareness and sustainable practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Final call to action with donation and calculator buttons */}
      <section className="py-16 md:py-24 bg-green-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            {/* CTA heading and description */}
            <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">Join Our Mission</h2>
            <p className="text-lg text-gray-600 mb-8">
              Whether you want to donate, volunteer, or learn how to reduce your carbon footprint, there are many ways
              to get involved.
            </p>

            {/* CTA buttons - Mirroring the options from the hero section */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Primary CTA - Donation button */}
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                <Link href="/donate">Donate Now</Link>
              </Button>

              {/* Secondary CTA - Carbon calculator button */}
              <Button asChild variant="outline" size="lg" className="border-green-600 text-green-600 hover:bg-green-50">
                <Link href="/carbon-calculator">Calculate Your Carbon Footprint</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
