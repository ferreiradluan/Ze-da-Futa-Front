"use client"

import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/protected-route"
import ClientOnly from "@/components/client-only"
import { useAuth } from "@/hooks/use-auth"

function SimpleDashboard() {
  const { user, userType, isAuthenticated } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    console.log("SimpleDashboard mounted", { user, userType, isAuthenticated })
  }, [user, userType, isAuthenticated])

  if (!mounted) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Dashboard do Comprador
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Bem-vindo!</h2>
          <p className="text-gray-600 mb-4">
            Olá, {user?.name || 'usuário'}! Este é seu painel do comprador.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">Produtos</h3>
              <p className="text-blue-700">Explore nosso catálogo</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900">Pedidos</h3>
              <p className="text-green-700">Acompanhe seus pedidos</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-900">Endereços</h3>
              <p className="text-orange-700">Gerencie suas entregas</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <h4 className="font-semibold mb-2">Debug Info:</h4>
            <p><strong>User Type:</strong> {userType}</p>
            <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
            <p><strong>User Name:</strong> {user?.name}</p>
            <p><strong>User Email:</strong> {user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CompradorDashboardPage() {
  return (
    <ProtectedRoute requiredUserType="comprador">
      <ClientOnly>
        <SimpleDashboard />
      </ClientOnly>
    </ProtectedRoute>
  )
}
