/**
 * Navigation Bar Component
 *
 * This component renders the site-wide navigation bar for ReLeaf NI, providing:
 * - Brand identity (logo and name)
 * - Main navigation links
 * - Authentication UI (sign in button or user dropdown)
 *
 * The component adapts its UI based on the user's authentication state
 * and provides access to key site sections.
 */

"use client"

// Authentication hooks from NextAuth
import { signIn, signOut, useSession } from "next-auth/react"

// Icons
import { UserCircle, LogOut } from "lucide-react"

// UI components
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const NavBar = () => {
  /**
   * Navigation items configuration
   * Each item defines a section of the website with its title and URL
   */
  const navItems = [
    { title: "Home", href: "/" },
    { title: "Donate", href: "/donate" },
    { title: "Grants", href: "/grants" },
    { title: "Learn", href: "/learn" },
    { title: "Projects", href: "/projects" },
    { title: "Map", href: "/map" },
  ]

  // Get authentication session data and status
  const { data: session, status } = useSession()

  // Track if authentication is still loading
  const isLoading = status === "loading"

  return (
    <header className="sticky top-0 z-[1001] w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 sm:px-8">
        {/* Logo and brand name */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/favicon.ico" alt="Releaf NI" className="h-8 w-8" />
            <span className="text-xl font-bold">Releaf NI</span>
          </Link>
        </div>

        {/* Main navigation links */}
        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-green-500"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Authentication UI - adapts based on auth state */}
        <div className="flex items-center">
          {/* Show loading placeholder while authentication state is being determined */}
          {isLoading ? (
            <div className="h-9 w-20 rounded-md bg-muted animate-pulse" />
          ) : session ? (
            /* User is authenticated - show user dropdown menu */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full p-0 hover:bg-green-300/20 transition-colors duration-200"
                >
                  {/* Show user image if available, otherwise show default icon */}
                  {session.user?.image ? (
                    <img
                      src={session.user.image || "/placeholder.svg"}
                      alt={session.user.name || "User profile"}
                      className="h-9 w-9 rounded-full"
                    />
                  ) : (
                    <UserCircle className="h-6 w-6" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-[1002]">
                {/* User name or default label */}
                <DropdownMenuLabel>{session.user?.name || "User"}</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* User-specific pages */}
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                {/* Sign out option */}
                <DropdownMenuItem onClick={() => signOut()} className="text-red-500 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* User is not authenticated - show sign in button */
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="#" onClick={() => signIn()} className="transition-colors text-white">
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

export default NavBar
