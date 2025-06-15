"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, ShoppingBag, DollarSign, AlertCircle, Clock, CheckCircle, XCircle, Store, Truck } from "lucide-react"
import type { AdminDashboard } from "@/lib/admin-api"

export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState<AdminDashboard | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)

    // Em produção, usar a API real:
    // const result = await adminApiService.getDashboard()
    // if (result.data) {
    //   setDashboardData(result.data)
    // }

    // Por enquanto, dados vazios até API real ser implementada
    const emptyData: AdminDashboard = {
      totalUsers: 0,
      totalOrders: 0,
      totalRevenue: 0,
      pendingApprovals: 0,
      recentActivity: [],
    }

    setDashboardData(emptyData)
    setIsLoading(false)
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "new_user":
        return <Users className="w-4 h-4 text-blue-600" />
      case "order_completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "establishment_pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "deliverer_approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "order_refunded":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / 60000)

    if (diffInMinutes < 1) return "Agora"
    if (diffInMinutes < 60) return `${diffInMinutes} min atrás`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} h atrás`
    return `${Math.floor(diffInMinutes / 1440)} dias atrás`
  }

  if (isLoading) {
    return (
      <AdminLayout title="Dashboard" activeTab="dashboard">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="bg-gray-200 h-16 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </AdminLayout>
    )
  }

  if (!dashboardData) return null

  return (
    <AdminLayout title="Dashboard" activeTab="dashboard">
      <div className="space-y-6">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Usuários</p>
                  <p className="text-3xl font-bold text-blue-600">{dashboardData.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Pedidos</p>
                  <p className="text-3xl font-bold text-green-600">{dashboardData.totalOrders.toLocaleString()}</p>
                </div>
                <ShoppingBag className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#FE9A04]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Receita Total</p>
                  <p className="text-3xl font-bold text-[#FE9A04]">
                    R$ {dashboardData.totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-[#FE9A04]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Aprovações Pendentes</p>
                  <p className="text-3xl font-bold text-red-600">{dashboardData.pendingApprovals}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-20 flex flex-col gap-2 bg-blue-600 hover:bg-blue-700">
                <Users className="w-6 h-6" />
                <span>Gerenciar Usuários</span>
              </Button>
              <Button className="h-20 flex flex-col gap-2 bg-green-600 hover:bg-green-700">
                <Store className="w-6 h-6" />
                <span>Aprovar Estabelecimentos</span>
              </Button>
              <Button className="h-20 flex flex-col gap-2 bg-purple-600 hover:bg-purple-700">
                <Truck className="w-6 h-6" />
                <span>Aprovar Entregadores</span>
              </Button>
              <Button className="h-20 flex flex-col gap-2 bg-[#FE9A04] hover:bg-[#E8890B]">
                <DollarSign className="w-6 h-6" />
                <span>Relatórios Financeiros</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Atividade Recente */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Atividade Recente</CardTitle>
              <Button variant="outline" size="sm" onClick={loadDashboardData}>
                Atualizar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentActivity.length > 0 ? (
                dashboardData.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="mt-1">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Nenhuma atividade recente</p>
                  <p className="text-gray-400 text-sm mt-2">As atividades aparecerão aqui quando houver dados</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Alertas e Notificações */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="w-5 h-5" />
                Alertas Importantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum alerta no momento</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="w-5 h-5" />
                Resumo do Dia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500">Dados do dia serão exibidos aqui</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
