"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredUserType?: string | null
  redirectTo?: string
}

export default function ProtectedRoute({ 
  children, 
  requiredUserType = null, 
  redirectTo = '/auth' 
}: ProtectedRouteProps) {
  const { isAuthenticated, loading, userType } = useAuth()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!loading && isMounted) {
      if (!isAuthenticated) {
        router.push(redirectTo)
        return
      }

      if (requiredUserType && userType !== requiredUserType) {
        // Redirecionar para dashboard correto baseado no tipo de usuário
        const dashboardRoutes = {
          comprador: '/comprador/dashboard',
          vendedor: '/vendedor/dashboard',
          entregador: '/entregador/dashboard',
          admin: '/admin/dashboard'
        }
        
        const correctRoute = dashboardRoutes[userType as keyof typeof dashboardRoutes]
        if (correctRoute) {
          router.push(correctRoute)
        } else {
          router.push('/')        }
      }
    }
  }, [isAuthenticated, loading, userType, requiredUserType, router, redirectTo, isMounted])

  // Enquanto não carregou ou não está montado, mostra loading
  if (!isMounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">🔄 Carregando...</p>
        </div>
      </div>
    )
  }

  // Se não está autenticado, não mostra nada (já está redirecionando)
  if (!isAuthenticated) {
    return null // O redirecionamento já foi feito no useEffect
  }

  // Se tem tipo específico exigido e não confere, não mostra nada (já está redirecionando)
  if (requiredUserType && userType !== requiredUserType) {
    return null // O redirecionamento já foi feito no useEffect
  }

  return <>{children}</>
}
