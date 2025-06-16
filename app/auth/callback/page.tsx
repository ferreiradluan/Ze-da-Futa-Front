"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/auth-service'
import { Card, CardContent } from '@/components/ui/card'

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [message, setMessage] = useState('Processando login...')

  useEffect(() => {
    handleAuthCallback()
  }, [])

  const handleAuthCallback = async () => {
    try {
      const result = authService.handleOAuthCallback()
      
      if (result.success) {
        setStatus('success')
        setMessage('Login realizado com sucesso!')
        
        // Aguardar um momento para mostrar sucesso
        setTimeout(() => {
          // Redirecionar baseado no tipo de usuário
          const redirectRoutes = {
            comprador: '/comprador/dashboard',
            vendedor: '/vendedor/dashboard',
            entregador: '/entregador/dashboard',
            admin: '/admin/dashboard'
          }
          
          const userType = result.userType || 'comprador'
          router.push(redirectRoutes[userType as keyof typeof redirectRoutes] || '/comprador/dashboard')
        }, 2000)
        
      } else {
        setStatus('error')
        setMessage(`Erro no login: ${result.error}`)
        setTimeout(() => router.push('/'), 3000)
      }
      
    } catch (error) {
      console.error('Erro no callback:', error)
      setStatus('error')
      setMessage('Erro inesperado durante o login')
      setTimeout(() => router.push('/'), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-8 text-center">
          {status === 'processing' && (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <h2 className="text-xl font-semibold text-gray-800">🔄 Processando login...</h2>
              <p className="text-gray-600">Aguarde enquanto configuramos sua sessão.</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="space-y-4">
              <div className="text-green-500 text-5xl">✅</div>
              <h2 className="text-xl font-semibold text-gray-800">Login realizado com sucesso!</h2>
              <p className="text-gray-600">Redirecionando para o painel...</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-4">
              <div className="text-red-500 text-5xl">❌</div>
              <h2 className="text-xl font-semibold text-gray-800">Erro no login</h2>
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500">Redirecionando para tentar novamente...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
