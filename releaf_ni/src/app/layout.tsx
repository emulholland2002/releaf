import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import NavBar from "../components/navbar";
import { Footer } from "../components/footer";
import { AuthProvider } from "@/components/auth-provider"

export const metadata: Metadata = {
  title: "Releaf NI",
  description: "Saving NI one tree at a time",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <NavBar />
          {children}
        </AuthProvider>
        <Footer />
      </body>
    </html>
  )
}
