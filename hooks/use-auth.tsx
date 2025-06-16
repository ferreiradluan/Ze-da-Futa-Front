"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { authService } from '@/lib/auth-service'

interface User {
  id: string | number
  email: string
  name: string
  userType: string
  profile?: any
  loginTime?: string
  exp?: number
  roles?: string[]
  type?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (userType: string) => Promise<void>
  logout: () => void
  token: string | null
  userType: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      if (authService.isAuthenticated()) {
        const userData = authService.getUserData()
        setUser(userData)
        setIsAuthenticated(true)
        
        // Tentar atualizar perfil
        await authService.fetchUserProfile()
        const updatedData = authService.getUserData()
        setUser(updatedData)
      }
    } catch (error) {
      console.error('Erro ao verificar auth:', error)
      authService.logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (userType: string) => {
    return await authService.loginWithGoogle(userType)
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    setIsAuthenticated(false)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    token: authService.getToken(),
    userType: authService.getUserType()
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro do AuthProvider')
  }
  return context
}
