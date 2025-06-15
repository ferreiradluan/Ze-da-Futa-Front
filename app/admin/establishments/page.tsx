"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Store, CheckCircle, XCircle, Clock, Eye, MapPin, Phone } from "lucide-react"
import type { Establishment } from "@/lib/admin-api"

export default function AdminEstablishmentsPage() {
  const [establishments, setEstablishments] = useState<Establishment[]>([])
  const [filteredEstablishments, setFilteredEstablishments] = useState<Establishment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadEstablishments()
  }, [])

  useEffect(() => {
    const filtered = establishments.filter(
      (establishment) =>
        establishment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        establishment.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        establishment.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredEstablishments(filtered)
  }, [establishments, searchTerm])

  const loadEstablishments = async () => {
    setIsLoading(true)

    // Em produção, usar a API real:
    // const result = await adminApiService.getPendingEstablishments()
    // if (result.data) {
    //   setEstablishments(result.data)
    // }

    // Por enquanto, lista vazia até API real ser implementada
    setEstablishments([])
    setIsLoading(false)
  }

  const updateEstablishmentStatus = async (establishmentId: number, status: "APROVADO" | "REJEITADO") => {
    setEstablishments((prev) =>
      prev.map((establishment) =>
        establishment.id === establishmentId ? { ...establishment, status } : establishment,
      ),
    )
    setIsDetailsOpen(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APROVADO":
        return <Badge className="bg-green-500">Aprovado</Badge>
      case "PENDENTE":
        return <Badge className="bg-yellow-500">Pendente</Badge>
      case "REJEITADO":
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
    total: establishments.length,
    pending: establishments.filter((e) => e.status === "PENDENTE").length,
    approved: establishments.filter((e) => e.status === "APROVADO").length,
    rejected: establishments.filter((e) => e.status === "REJEITADO").length,
  }

  return (
    <AdminLayout title="Gerenciamento de Estabelecimentos" activeTab="establishments">
      <div className="space-y-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Estabelecimentos</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <Store className="w-8 h-8 text-gray-600" />
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

        {/* Lista de Estabelecimentos */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lista de Estabelecimentos</CardTitle>
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar estabelecimentos..."
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
                {filteredEstablishments.map((establishment) => (
                  <div key={establishment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{establishment.name}</h3>
                          {getStatusBadge(establishment.status)}
                        </div>

                        <div className="space-y-1 text-sm text-gray-600">
                          <p>
                            <strong>Proprietário:</strong> {establishment.owner}
                          </p>
                          <p>
                            <strong>Email:</strong> {establishment.email}
                          </p>
                          <div className="flex items-start gap-1">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{establishment.address}</span>
                          </div>
                          {establishment.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              <span>{establishment.phone}</span>
                            </div>
                          )}
                          <p>
                            <strong>Solicitação:</strong> {formatDate(establishment.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedEstablishment(establishment)
                            setIsDetailsOpen(true)
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalhes
                        </Button>

                        {establishment.status === "PENDENTE" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => updateEstablishmentStatus(establishment.id, "APROVADO")}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Aprovar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateEstablishmentStatus(establishment.id, "REJEITADO")}
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

            {filteredEstablishments.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Nenhum estabelecimento encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de Detalhes */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Detalhes do Estabelecimento</DialogTitle>
            </DialogHeader>
            {selectedEstablishment && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg">{selectedEstablishment.name}</h3>
                  {getStatusBadge(selectedEstablishment.status)}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Proprietário</label>
                    <p className="text-sm">{selectedEstablishment.owner}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-sm">{selectedEstablishment.email}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Endereço</label>
                    <p className="text-sm">{selectedEstablishment.address}</p>
                  </div>

                  {selectedEstablishment.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Telefone</label>
                      <p className="text-sm">{selectedEstablishment.phone}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-600">Data da Solicitação</label>
                    <p className="text-sm">{formatDate(selectedEstablishment.createdAt)}</p>
                  </div>
                </div>

                {selectedEstablishment.status === "PENDENTE" && (
                  <div className="flex gap-2 pt-4">
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => updateEstablishmentStatus(selectedEstablishment.id, "APROVADO")}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Aprovar
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => updateEstablishmentStatus(selectedEstablishment.id, "REJEITADO")}
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
