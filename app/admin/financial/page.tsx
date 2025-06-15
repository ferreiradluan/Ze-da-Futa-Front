"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { DollarSign, TrendingUp, TrendingDown, Calendar, Download, RefreshCw } from "lucide-react"
import type { FinancialReport } from "@/lib/admin-api"

export default function AdminFinancialPage() {
  const [financialData, setFinancialData] = useState<FinancialReport | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState("30")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadFinancialData()
  }, [selectedPeriod])

  const loadFinancialData = async () => {
    setIsLoading(true)

    // Em produção, usar a API real:
    // const result = await adminApiService.getFinancialReports()
    // if (result.data) {
    //   setFinancialData(result.data)
    // }

    // Por enquanto, dados vazios até API real ser implementada
    const emptyData: FinancialReport = {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      monthlyRevenue: [],
      topProducts: [],
    }

    setFinancialData(emptyData)
    setIsLoading(false)
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  const exportReport = () => {
    // Simular exportação de relatório
    alert("Relatório exportado com sucesso!")
  }

  // Dados para gráfico de pizza (categorias) - vazios até dados reais
  const categoryData: { name: string; value: number; color: string }[] = []

  // Dados de crescimento mensal - vazios até dados reais
  const growthData: any[] = []

  if (isLoading) {
    return (
      <AdminLayout title="Relatórios Financeiros" activeTab="financial">
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

  if (!financialData) return null

  return (
    <AdminLayout title="Relatórios Financeiros" activeTab="financial">
      <div className="space-y-6">
        {/* Controles */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Selecionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 dias</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 90 dias</SelectItem>
                <SelectItem value="365">Último ano</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={loadFinancialData} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
          <Button onClick={exportReport} className="bg-[#FE9A04] hover:bg-[#E8890B]">
            <Download className="w-4 h-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-[#FE9A04]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Receita Total</p>
                  <p className="text-2xl font-bold text-[#FE9A04]">{formatCurrency(financialData.totalRevenue)}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +15.3% vs período anterior
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-[#FE9A04]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Pedidos</p>
                  <p className="text-3xl font-bold text-green-600">{financialData.totalOrders.toLocaleString()}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +8.7% vs período anterior
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ticket Médio</p>
                  <p className="text-3xl font-bold text-blue-600">{formatCurrency(financialData.averageOrderValue)}</p>
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    -2.1% vs período anterior
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taxa de Crescimento</p>
                  <p className="text-3xl font-bold text-purple-600">+12.4%</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Crescimento mensal
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Receita Mensal */}
          <Card>
            <CardHeader>
              <CardTitle>Receita Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  revenue: {
                    label: "Receita",
                    color: "#FE9A04",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={financialData.monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#FE9A04"
                      strokeWidth={3}
                      dot={{ fill: "#FE9A04", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Produtos Mais Vendidos */}
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Produtos por Receita</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  revenue: {
                    label: "Receita",
                    color: "#22C55E",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financialData.topProducts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="revenue" fill="#22C55E" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Pizza e Tabela de Produtos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distribuição por Categoria */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Vendas por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  frutas: { label: "Frutas", color: "#FE9A04" },
                  verduras: { label: "Verduras", color: "#22C55E" },
                  legumes: { label: "Legumes", color: "#3B82F6" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Tabela de Top Produtos */}
          <Card>
            <CardHeader>
              <CardTitle>Produtos Mais Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {financialData.topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#FE9A04] rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.sales} vendas</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#FE9A04]">{formatCurrency(product.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Crescimento Mensal */}
        <Card>
          <CardHeader>
            <CardTitle>Análise de Crescimento Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {growthData.map((month) => (
                <div key={month.month} className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-gray-600">{month.month}</p>
                  <p className="text-lg font-bold">{formatCurrency(month.revenue)}</p>
                  <p
                    className={`text-sm flex items-center justify-center mt-1 ${
                      Number(month.growth) >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {Number(month.growth) >= 0 ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {month.growth}%
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
