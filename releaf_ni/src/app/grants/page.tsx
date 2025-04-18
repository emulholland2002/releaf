/**
 * GrantsPage Component
 *
 * This component displays a comprehensive directory of grant-related resources
 * for afforestation and tree planting initiatives in Northern Ireland.
 * It presents information in a responsive grid of interactive cards.
 */
import Link from "next/link"
import { Search, FileCheck, BookOpen, Users, BarChart3, Newspaper } from "lucide-react"

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function GrantsPage() {
  // Array of grant resources with their details and navigation links
  // Each object contains title, description, icon, link and call-to-action text
  const grants = [
    {
      title: "Grant Search and Directory",
      description: "Find and filter through available grants for afforestation and tree planting initiatives.",
      icon: <Search className="h-8 w-8 text-green-600" />,
      href: "/grants/search",
      cta: "Search Grants",
    },
    {
      title: "Eligibility and Application Guidance",
      description: "Learn about eligibility requirements and get step-by-step guidance for successful applications.",
      icon: <FileCheck className="h-8 w-8 text-green-600" />,
      href: "/grants/guidance",
      cta: "View Guidelines",
    },
    {
      title: "Resource Library",
      description: "Access templates, sample applications, and other resources to support your grant applications.",
      icon: <BookOpen className="h-8 w-8 text-green-600" />,
      href: "/grants/resources",
      cta: "Browse Resources",
    },
    {
      title: "Support and Networking",
      description: "Connect with other organizations and experts for advice and collaboration opportunities.",
      icon: <Users className="h-8 w-8 text-green-600" />,
      href: "/grants/networking",
      cta: "Connect Now",
    },
    {
      title: "Grant Tracking and Management",
      description: "Tools and tips for tracking application status and managing awarded grants effectively.",
      icon: <BarChart3 className="h-8 w-8 text-green-600" />,
      href: "/grants/tracking",
      cta: "Track Grants",
    },
    {
      title: "News and Updates",
      description: "Stay informed about new grant opportunities, deadlines, and changes in funding priorities.",
      icon: <Newspaper className="h-8 w-8 text-green-600" />,
      href: "/grants/news",
      cta: "Read Updates",
    },
  ]

  return (
    <div className="container mx-auto py-12 px-4">
      {/* Page header with title and description */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Afforestation Grants</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover funding opportunities to support your tree planting and forest restoration initiatives in Northern
          Ireland.
        </p>
      </div>

      {/* Responsive grid layout:
          - 1 column on mobile (default)
          - 2 columns on medium screens (md)
          - 3 columns on large screens (lg) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {grants.map((grant, index) => (
          <Card key={index} className="flex flex-col h-full transition-all duration-200 hover:shadow-lg">
            <CardHeader>
              <div className="mb-4">{grant.icon}</div>
              <CardTitle className="text-xl">{grant.title}</CardTitle>
              <CardDescription className="text-base">{grant.description}</CardDescription>
            </CardHeader>
            {/* CardFooter with mt-auto pushes the button to the bottom of the card */}
            <CardFooter className="mt-auto pt-4">
              <Link
                href={grant.href}
                className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring w-full"
              >
                {grant.cta}
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
