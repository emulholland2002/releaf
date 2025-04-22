/**
 * Footer Component
 *
 * This component renders the site-wide footer for ReLeaf NI, providing:
 * - Navigation links to key information pages
 * - Social media links with accessible icons
 * - Copyright information
 *
 * The footer maintains consistent styling with the rest of the site
 * and includes proper accessibility features for all interactive elements.
 */

// Next.js navigation
import Link from "next/link"

// Social media icons from Lucide
import { Github, Facebook, Twitter, Instagram } from "lucide-react"

// UI components
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="flex flex-col items-center text-center">
        {/* Internal navigation links */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-4">
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-green-500"
          >
            About
          </Link>
          <Link
            href="/faq"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-green-500"
          >
            FAQ
          </Link>
          <Link
            href="/privacy-policy"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-green-500"
          >
            Privacy Policy
          </Link>
        </div>

        {/* Social media links with icon buttons */}
        <div className="flex justify-center gap-4 mb-4">
          {/* GitHub link */}
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="relative h-9 w-9 p-0 hover:bg-green-300/20 transition-colors duration-200"
          >
            <Link href="https://github.com" target="_blank" rel="noreferrer">
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Link>
          </Button>

          {/* Facebook link */}
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="relative h-9 w-9 p-0 hover:bg-green-300/20 transition-colors duration-200"
          >
            <Link href="https://facebook.com" target="_blank" rel="noreferrer">
              <Facebook className="h-4 w-4" />
              <span className="sr-only">Facebook</span>
            </Link>
          </Button>

          {/* Twitter/X link */}
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="relative h-9 w-9 p-0 hover:bg-green-300/20 transition-colors duration-200"
          >
            <Link href="https://twitter.com" target="_blank" rel="noreferrer">
              <Twitter className="h-4 w-4" />
              <span className="sr-only">X (Twitter)</span>
            </Link>
          </Button>

          {/* Instagram link */}
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="relative h-9 w-9 p-0 hover:bg-green-300/20 transition-colors duration-200"
          >
            <Link href="https://instagram.com" target="_blank" rel="noreferrer">
              <Instagram className="h-4 w-4" />
              <span className="sr-only">Instagram</span>
            </Link>
          </Button>
        </div>

        {/* Copyright information with dynamically generated year */}
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Releaf NI. All rights reserved.</p>
      </div>
    </footer>
  )
}
