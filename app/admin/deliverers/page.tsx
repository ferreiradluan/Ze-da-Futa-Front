"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Truck, CheckCircle, XCircle, Clock, Eye } from "lucide-react"
import type { DeliveryProfile } from "@/lib/admin-api"

export default function AdminDeliverersPage() {
  const [deliverers, setDeliverers] = useState<DeliveryProfile[]>([])
  const [filteredDeliverers, setFilteredDeliverers] = useState<DeliveryProfile[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDeliverer, setSelectedDeliverer] = useState<DeliveryProfile | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDeliverers()
  }, [])

  useEffect(() => {
    const filtered = deliverers.filter(
      (deliverer) =>
        deliverer.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deliverer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deliverer.veiculo?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredDeliverers(filtered)
  }, [deliverers, searchTerm])

  const loadDeliverers = async () => {
    setIsLoading(true)

    // Em produção, usar a API real:
    // const result = await adminApiService.getPendingDeliverers()
    // if (result.data) {
    //   setDeliverers(result.data)
    // }

    // Por enquanto, lista vazia até API real ser implementada
    setDeliverers([])
    setIsLoading(false)
  }

  const updateDelivererStatus = async (delivererId: number, status: "aprovado" | "rejeitado") => {
    setDeliverers((prev) =>
      prev.map((deliverer) => (deliverer.id === delivererId ? { ...deliverer, status_aprovacao: status } : deliverer)),
    )
    setIsDetailsOpen(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aprovado":
        return <Badge className="bg-green-500">Aprovado</Badge>
      case "pendente":
        return <Badge className="bg-yellow-500">Pendente</Badge>
      case "rejeitado":
        return <Badge className="bg-red-500">Rejeitado</Badge>
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

  const stats = {
    total: deliverers.length,
    pending: deliverers.filter((d) => d.status_aprovacao === "pendente").length,
    approved: deliverers.filter((d) => d.status_aprovacao === "aprovado").length,
    rejected: deliverers.filter((d) => d.status_aprovacao === "rejeitado").length,
  }

  return (
    <AdminLayout title="Gerenciamento de Entregadores" activeTab="deliverers">
      <div className="space-y-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Entregadores</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <Truck className="w-8 h-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pendentes</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Aprovados</p>
                  <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rejeitados</p>
                  <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Entregadores */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lista de Entregadores</CardTitle>
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar entregadores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
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
                        <div className="bg-gray-200 h-4 rounded w-1/3"></div>
                        <div className="bg-gray-200 h-3 rounded w-1/2"></div>
                      </div>
                      <div className="bg-gray-200 h-6 w-20 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDeliverers.map((deliverer) => (
                  <div key={deliverer.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{deliverer.userName}</h3>
                          {getStatusBadge(deliverer.status_aprovacao)}
                        </div>

                        <div className="space-y-1 text-sm text-gray-600">
                          <p>
                            <strong>Email:</strong> {deliverer.email}
                          </p>
                          <p>
                            <strong>Veículo:</strong> {deliverer.veiculo}
                          </p>
                          <p>
                            <strong>CNH:</strong> {deliverer.cnh}
                          </p>
                          <p>
                            <strong>Solicitação:</strong> {formatDate(deliverer.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedDeliverer(deliverer)
                            setIsDetailsOpen(true)
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalhes
                        </Button>

                        {deliverer.status_aprovacao === "pendente" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => updateDelivererStatus(deliverer.id, "aprovado")}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Aprovar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateDelivererStatus(deliverer.id, "rejeitado")}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Rejeitar
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredDeliverers.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Nenhum entregador encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de Detalhes */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Detalhes do Entregador</DialogTitle>
            </DialogHeader>
            {selectedDeliverer && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg">{selectedDeliverer.userName}</h3>
                  {getStatusBadge(selectedDeliverer.status_aprovacao)}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-sm">{selectedDeliverer.email}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Veículo</label>
                    <p className="text-sm">{selectedDeliverer.veiculo}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">CNH</label>
                    <p className="text-sm font-mono">{selectedDeliverer.cnh}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Data da Solicitação</label>
                    <p className="text-sm">{formatDate(selectedDeliverer.createdAt)}</p>
                  </div>
                </div>

                {selectedDeliverer.status_aprovacao === "pendente" && (
                  <div className="flex gap-2 pt-4">
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => updateDelivererStatus(selectedDeliverer.id, "aprovado")}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Aprovar
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => updateDelivererStatus(selectedDeliverer.id, "rejeitado")}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Rejeitar
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
