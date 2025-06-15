"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, ShoppingBag, Eye, RefreshCw, DollarSign, Package, Truck, AlertTriangle } from "lucide-react"
import type { AdminOrder } from "@/lib/admin-api"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [filteredOrders, setFilteredOrders] = useState<AdminOrder[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    const filtered = orders.filter(
      (order) =>
        order.id.toString().includes(searchTerm) ||
        order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredOrders(filtered)
  }, [orders, searchTerm])

  const loadOrders = async () => {
    setIsLoading(true)

    // Em produção, usar a API real:
    // const result = await adminApiService.getAllOrders()
    // if (result.data) {
    //   setOrders(result.data)
    // }

    // Por enquanto, lista vazia até API real ser implementada
    setOrders([])
    setIsLoading(false)
  }

  const refundOrder = async (orderId: number) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: "Reembolsado" } : order)))
    setIsDetailsOpen(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Entregue":
        return <Badge className="bg-green-500">Entregue</Badge>
      case "Em Trânsito":
        return <Badge className="bg-blue-500">Em Trânsito</Badge>
      case "Preparando":
        return <Badge className="bg-yellow-500">Preparando</Badge>
      case "Cancelado":
        return <Badge className="bg-red-500">Cancelado</Badge>
      case "Reembolsado":
        return <Badge className="bg-purple-500">Reembolsado</Badge>
      case "Problema na Entrega":
        return <Badge className="bg-orange-500">Problema na Entrega</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  const stats = {
    total: orders.length,
    delivered: orders.filter((o) => o.status === "Entregue").length,
    inTransit: orders.filter((o) => o.status === "Em Trânsito").length,
    problems: orders.filter((o) => o.status === "Problema na Entrega" || o.status === "Cancelado").length,
    totalRevenue: orders.filter((o) => o.status === "Entregue").reduce((sum, o) => sum + o.total, 0),
  }

  return (
    <AdminLayout title="Gerenciamento de Pedidos" activeTab="orders">
      <div className="space-y-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Pedidos</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <ShoppingBag className="w-8 h-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Entregues</p>
                  <p className="text-3xl font-bold text-green-600">{stats.delivered}</p>
                </div>
                <Package className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Em Trânsito</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.inTransit}</p>
                </div>
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Receita Total</p>
                  <p className="text-2xl font-bold text-[#FE9A04]">{formatCurrency(stats.totalRevenue)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-[#FE9A04]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Pedidos */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lista de Pedidos</CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por ID, cliente ou status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={loadOrders} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Atualizar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="animate-pulse border rounded-lg p-4">
                    <div className="flex justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="bg-gray-200 h-4 rounded w-1/4"></div>
                        <div className="bg-gray-200 h-3 rounded w-1/3"></div>
                      </div>
                      <div className="bg-gray-200 h-6 w-20 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>{order.userName}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(order.total)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(order)
                              setIsDetailsOpen(true)
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Ver
                          </Button>
                          {(order.status === "Problema na Entrega" || order.status === "Cancelado") && (
                            <Button size="sm" variant="destructive" onClick={() => refundOrder(order.id)}>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Reembolsar
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {filteredOrders.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Nenhum pedido encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pedidos com Problemas */}
        {stats.problems > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="w-5 h-5" />
                Pedidos com Problemas ({stats.problems})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orders
                  .filter((o) => o.status === "Problema na Entrega" || o.status === "Cancelado")
                  .map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="font-medium">
                          Pedido #{order.id} - {order.userName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(order.total)} • {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(order.status)}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedOrder(order)
                            setIsDetailsOpen(true)
                          }}
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modal de Detalhes do Pedido */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Detalhes do Pedido</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Pedido #{selectedOrder.id}</h3>
                  {getStatusBadge(selectedOrder.status)}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Cliente</label>
                    <p className="text-sm">{selectedOrder.userName}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Data do Pedido</label>
                    <p className="text-sm">{formatDate(selectedOrder.createdAt)}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Itens do Pedido</label>
                    <div className="space-y-2 mt-2">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                          <span>{formatCurrency(item.quantity * item.price)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span className="text-[#FE9A04]">{formatCurrency(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>

                {(selectedOrder.status === "Problema na Entrega" || selectedOrder.status === "Cancelado") && (
                  <div className="flex gap-2 pt-4">
                    <Button
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      onClick={() => refundOrder(selectedOrder.id)}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Processar Reembolso
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
