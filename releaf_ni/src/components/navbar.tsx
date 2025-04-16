'use client'

import { signIn, signOut, useSession } from "next-auth/react"
import { UserCircle, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const NavBar = () => {
    const navItems = [ 
        { title: "Home", href: "/" },
        { title: "Donate", href: "/donate" },
        { title: "Grants", href: "/grants" },
        { title: "Learn", href: "/learn" },
        { title: "Projects", href: "/projects-news" },
        { title: "Map", href: "/map" }
    ]

    const { data: session, status } = useSession()
    const isLoading = status === "loading"

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
          <div className="flex h-16 items-center justify-between px-4 sm:px-8">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center space-x-2">
                <img src="/favicon.ico" alt="Releaf NI" className="h-8 w-8" />
                <span className="text-xl font-bold">Releaf NI</span>
              </Link>
            </div>
    
            {/* Navigation */}
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
    
        {/* Authentication UI */}
        <div className="flex items-center">
          {isLoading ? (
            <div className="h-9 w-20 rounded-md bg-muted animate-pulse" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 hover:bg-green-300/20 transition-colors duration-200">
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
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{session.user?.name || "User"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="text-red-500 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
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