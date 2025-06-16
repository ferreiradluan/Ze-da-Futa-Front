"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { authService } from "@/lib/auth-service"

export default function AuthPage() {
  const [userType, setUserType] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  useEffect(() => {
    // Buscar tipo de usuário salvo
    const savedUserType = localStorage.getItem("userType")
    if (!savedUserType) {
      router.push("/")
      return
    }
    setUserType(savedUserType)
  }, [router])

  const handleOAuthCallback = async () => {
    setLoading(true)
    try {
      const result = authService.handleOAuthCallback()
      
      if (result.success) {
        // Aguardar um momento e redirecionar para o dashboard
        setTimeout(() => {
          const redirectRoutes = {
            comprador: '/comprador/dashboard',
            vendedor: '/vendedor/dashboard',
            entregador: '/entregador/dashboard'
          }
          
          const userType = result.userType || 'comprador'
          router.push(redirectRoutes[userType as keyof typeof redirectRoutes])
        }, 1000)
      } else {
        console.error('Erro no callback OAuth:', result.error)
        router.push('/')
      }
    } catch (error) {
      console.error('Erro ao processar callback:', error)
      router.push('/')
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      await authService.loginWithGoogle(userType)
      // A página será redirecionada automaticamente para o OAuth
    } catch (error) {
      console.error('Erro ao iniciar login:', error)
      setLoading(false)
    }
  }

  const getUserTypeTitle = () => {
    switch (userType) {
      case "comprador":
        return "Comprador"
      case "vendedor":
        return "Vendedor"
      case "entregador":
        return "Entregador"
      default:
        return ""
    }
  }
  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">🔄 Processando login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Botão Voltar */}
        <Button 
          variant="ghost" 
          onClick={() => router.push("/")} 
          className="mb-6 text-gray-600 hover:text-gray-800"
          disabled={loading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <Card className="shadow-xl">
          <CardHeader className="text-center space-y-4">
            <Image src="/logo.png" alt="Zé da Manga" width={250} height={100} className="mx-auto" priority />
            <CardTitle className="text-2xl">Entrar como {getUserTypeTitle()}</CardTitle>
            <p className="text-gray-600">Faça login para acessar sua conta</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <Button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-semibold py-3 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              {loading ? 'Conectando...' : 'Entrar com Google'}
            </Button>

            <div className="text-center text-sm text-gray-500">
              Ao continuar, você concorda com nossos Termos de Uso
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
