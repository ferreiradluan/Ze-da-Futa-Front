"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/auth-service'

export default function GoogleCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    handleGoogleCallback()
  }, [])

  const handleGoogleCallback = async () => {
    try {
      console.log('🔄 Processando callback do Google...')
      
      // Processar o callback automaticamente
      const result = authService.handleOAuthCallback()
      
      if (result.success) {
        console.log('✅ Login realizado com sucesso!')
          // Redirecionar imediatamente para o dashboard correto
        const redirectRoutes = {
          comprador: '/comprador/dashboard',
          usuario: '/comprador/dashboard', // Mapeando 'usuario' para comprador
          vendedor: '/vendedor/dashboard',
          entregador: '/entregador/dashboard'
        }
        
        const userType = result.userType || 'comprador'
        const targetRoute = redirectRoutes[userType as keyof typeof redirectRoutes] || '/comprador/dashboard'
        
        console.log(`🎯 Redirecionando para: ${targetRoute}`)
        
        // Redirecionar imediatamente sem delay
        router.replace(targetRoute)
        
      } else {
        console.error('❌ Erro no callback:', result.error)
        // Em caso de erro, redirecionar para página de login
        router.replace('/auth')
      }
      
    } catch (error) {
      console.error('❌ Erro inesperado no callback:', error)
      // Em caso de erro, redirecionar para página inicial
      router.replace('/')
    }
  }

  // Mostrar apenas um loading mínimo enquanto processa
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
        <p className="text-gray-600 text-sm">Entrando...</p>
      </div>
    </div>
  )
}
