"use client"

import React from "react"

type User = {
  id: string
  name: string
  email: string
} | null

type AuthContextType = {
  user: User
  isLoading: boolean
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  isLoading: true,
})

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode
  initialUser: User
}) {
  const [user, setUser] = React.useState<User>(initialUser)
  const [isLoading, setIsLoading] = React.useState(false)

  return <AuthContext.Provider value={{ user, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return React.useContext(AuthContext)
}

