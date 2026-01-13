'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { JwtResponse } from '../types/api/types'
import { setAuthToken } from '../lib/api/user.client'

interface AuthContextType {
  user: JwtResponse | null
  isAuthenticated: boolean
  login: (data: JwtResponse) => void
  logout: () => void
}

interface AuthState {
  userId: number | null
  email: string | null
  token: string | null
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<JwtResponse | null>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    const email = localStorage.getItem('email')
    const role = localStorage.getItem('role')

    if (token && userId && email && role) {
      setUser({ token, userId, email, role })
      setAuthToken(token)
    }

    setInitialized(true)
  }, [])

  const login = (data: JwtResponse) => {
    setUser(data)
    setAuthToken(data.token)

    localStorage.setItem('token', data.token)
    localStorage.setItem('userId', data.userId)
    localStorage.setItem('email', data.email)
    localStorage.setItem('role', data.role)
  }

  const logout = () => {
    setUser(null)
    setAuthToken(undefined)
    localStorage.clear()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        logout,
      }}
    >
      {initialized && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}