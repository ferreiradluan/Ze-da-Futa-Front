"use client"

import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/protected-route"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ShoppingCart,
  MapPin,
  Package,
  User,
} from "lucide-react"

function CompradorDashboard() {
  const { user, userType } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Não renderizar até estar montado no cliente
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">🔄 Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-2 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Zé da Fruta</h1>
                <p className="text-sm text-gray-600">Dashboard do Comprador</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-700">Olá, {user?.name || 'Usuário'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo ao seu painel!
          </h2>
          <p className="text-gray-600">
            Aqui você pode explorar produtos frescos, fazer pedidos e acompanhar suas entregas.
          </p>
        </div>

        {/* Cards de funcionalidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Produtos</h3>
                  <p className="text-gray-600 text-sm">Explore nosso catálogo</p>
                </div>
              </div>
              <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600">
                Ver Produtos
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Meus Pedidos</h3>
                  <p className="text-gray-600 text-sm">Acompanhe seus pedidos</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Ver Pedidos
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Endereços</h3>
                  <p className="text-gray-600 text-sm">Gerencie entregas</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Gerenciar Endereços
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Informações do usuário */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Informações da Sessão</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Tipo de usuário:</strong> {userType}</p>
              <p><strong>Nome:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Status:</strong> <span className="text-green-600">✅ Conectado</span></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function CompradorDashboardPage() {
  return (
    <ProtectedRoute requiredUserType="comprador">
      <CompradorDashboard />
    </ProtectedRoute>
  )
}
