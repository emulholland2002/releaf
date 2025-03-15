import Link from "next/link"
import { Github, Facebook, Twitter, Instagram } from "lucide-react"

import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="flex flex-col items-center text-center">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-4">
          <Link href="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-green-500">
            About
          </Link>
          <Link href="/faq" className="text-sm font-medium text-muted-foreground transition-colors hover:text-green-500">
            FAQ
          </Link>
          <Link href="/privacy-policy" className="text-sm font-medium text-muted-foreground transition-colors hover:text-green-500">
            Privacy Policy
          </Link>
        </div>

        <div className="flex justify-center gap-4 mb-4">
          <Button variant="ghost" size="icon" asChild className="relative h-9 w-9 p-0 hover:bg-green-300/20 transition-colors duration-200">
            <Link href="https://github.com" target="_blank" rel="noreferrer">
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="relative h-9 w-9 p-0 hover:bg-green-300/20 transition-colors duration-200">
            <Link href="https://facebook.com" target="_blank" rel="noreferrer">
              <Facebook className="h-4 w-4" />
              <span className="sr-only">Facebook</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="relative h-9 w-9 p-0 hover:bg-green-300/20 transition-colors duration-200">
            <Link href="https://twitter.com" target="_blank" rel="noreferrer">
              <Twitter className="h-4 w-4" />
              <span className="sr-only">X (Twitter)</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="relative h-9 w-9 p-0 hover:bg-green-300/20 transition-colors duration-200">
            <Link href="https://instagram.com" target="_blank" rel="noreferrer">
              <Instagram className="h-4 w-4" />
              <span className="sr-only">Instagram</span>
            </Link>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Your Company. All rights reserved.</p>
      </div>
    </footer>
  )
}

