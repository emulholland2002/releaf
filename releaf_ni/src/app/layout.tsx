import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { AuthProvider } from "@/context/auth-context"
import { getCurrentUser } from "./actions/auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Releaf",
  description: "Making a difference, one tree at a time",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider initialUser={user}>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}

