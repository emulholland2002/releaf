/**
 * NextAuth Authentication Configuration
 * 
 * This file configures NextAuth.js for handling authentication in the application.
 * It sets up credential-based authentication with email and password,
 * using Prisma as the database adapter.
 * 
 * @file app/api/auth/[...nextauth]/route.ts
 */

import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/app/client"
import { compare } from "bcrypt"

/**
 * Validates an email address format
 * 
 * @param email The email address to validate
 * @returns True if the email format is valid, false otherwise
 */
function isValidEmail(email: string): boolean {
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Logs authentication attempts for security monitoring
 * 
 * @param email The email used in the authentication attempt
 * @param success Whether the authentication was successful
 * @param reason Optional reason for failure
 */
function logAuthAttempt(email: string, success: boolean, reason?: string): void {
  if (success) {
    console.log(`Successful authentication for user: ${email}`)
  } else {
    console.warn(`Failed authentication attempt for email: ${email}, reason: ${reason || 'Unknown'}`)
  }
}

/**
 * NextAuth configuration and handler
 */
const handler = NextAuth({
  // Use Prisma adapter to connect NextAuth with the database
  adapter: PrismaAdapter(prisma),
  
  // Configure authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      // Define the fields shown on the sign-in form
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      
      /**
       * Authorize function to validate credentials and return a user
       * 
       * @param credentials The credentials provided by the user
       * @returns The user object if authentication is successful, null otherwise
       */
      async authorize(credentials) {
        try {
          // Validate that credentials are provided
          if (!credentials?.email || !credentials?.password) {
            logAuthAttempt(credentials?.email || 'unknown', false, 'Missing credentials')
            return null
          }

          // Validate email format
          if (!isValidEmail(credentials.email)) {
            logAuthAttempt(credentials.email, false, 'Invalid email format')
            return null
          }

          // Find the user in the database
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          })

          // Check if user exists and has a password
          if (!user) {
            logAuthAttempt(credentials.email, false, 'User not found')
            return null
          }

          if (!user.password) {
            logAuthAttempt(credentials.email, false, 'User has no password (possibly OAuth account)')
            return null
          }

          // Verify the password
          const isPasswordValid = await compare(credentials.password, user.password)

          if (!isPasswordValid) {
            logAuthAttempt(credentials.email, false, 'Invalid password')
            return null
          }

          // Authentication successful, log and return user
          logAuthAttempt(credentials.email, true)
          
          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
          }
        } catch (error) {
          // Log any unexpected errors
          console.error('Authentication error:', error)
          return null
        }
      },
    }),
    // You can add additional providers here (Google, GitHub, etc.)
  ],
  
  // Session configuration
  session: {
    strategy: "jwt", // Use JWT for session management
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  
  // Custom pages configuration
  pages: {
    signIn: "/signin",
  },
  
  // Callbacks to customise authentication behavior
  callbacks: {
    /**
     * Session callback to add user ID to the session
     * 
     * @param params The session and token objects
     * @returns The modified session object
     */
    async session({ session, token }) {
      // Add the user ID from the token to the session
      if (token && session.user) {
        session.user.id = token.sub
      }
      return session
    },
  },
  
  // Enable debug messages in development
  debug: process.env.NODE_ENV === "development",
  
  // Additional security options
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }