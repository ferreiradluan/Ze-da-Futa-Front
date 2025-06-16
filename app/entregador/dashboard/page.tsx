"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import DeliveryDetails from "@/components/delivery-details"
import DeliveryApprovalStatus from "@/components/delivery-approval-status"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  DollarSign,
  Package,
  Navigation,
  User,
  Phone,
  Filter,
  RefreshCw,
} from "lucide-react"
import type { Delivery, DeliveryProfile } from "@/lib/api"

export default function EntregadorDashboard() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [myDeliveries, setMyDeliveries] = useState<Delivery[]>([])
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [deliveryProfile, setDeliveryProfile] = useState<DeliveryProfile | null>(null)
  const [activeTab, setActiveTab] = useState<"available" | "active" | "completed">("available")
  const [isLoading, setIsLoading] = useState(false)
  const [filterDistance, setFilterDistance] = useState("")
  const [filterValue, setFilterValue] = useState("")

  useEffect(() => {
    loadDeliveryProfile()
    loadAvailableDeliveries()
    loadMyDeliveries()
  }, [])

  const loadDeliveryProfile = async () => {
    // Simular carregamento do perfil
    const mockProfile: DeliveryProfile = {
      id: 1,
      userId: 1,
      status_aprovacao: "aprovado", // pode ser "pendente", "aprovado", "rejeitado"
      veiculo: "Moto Honda CG 160",
      cnh: "12345678901",
      createdAt: new Date().toISOString(),
    }
    setDeliveryProfile(mockProfile)
  }

  const loadAvailableDeliveries = async () => {
    setIsLoading(true)

    // Simular dados da API
    const mockDeliveries: Delivery[] = [
      {
        id: 1,
        pedidoId: 101,
        status: "AGUARDANDO_COLETA",
        endereco: {
          rua: "Rua das Flores",
          numero: "123",
          cidade: "São Paulo",
          estado: "SP",
          cep: "01234-567",
        },
        cliente: {
          nome: "João Silva",
          telefone: "(11) 99999-9999",
        },
        itens: [
          { nome: "Manga Tommy", quantidade: 2, preco: 8.9 },
          { nome: "Tomate Cereja", quantidade: 1, preco: 12.5 },
        ],
        valorTotal: 30.3,
        distancia: "2.5 km",
        tempoEstimado: "15 min",
        observacoes: "Apartamento 45, interfone 123",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        pedidoId: 102,
        status: "AGUARDANDO_COLETA",
        endereco: {
          rua: "Av. Principal",
          numero: "456",
          cidade: "São Paulo",
          estado: "SP",
          cep: "01234-890",
        },
        cliente: {
          nome: "Maria Santos",
          telefone: "(11) 88888-8888",
        },
        itens: [{ nome: "Banana Prata", quantidade: 3, preco: 6.0 }],
        valorTotal: 18.0,
        distancia: "1.8 km",
        tempoEstimado: "12 min",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 3,
        pedidoId: 103,
        status: "AGUARDANDO_COLETA",
        endereco: {
          rua: "Rua do Comércio",
          numero: "789",
          cidade: "São Paulo",
          estado: "SP",
          cep: "01234-123",
        },
        cliente: {
          nome: "Pedro Costa",
        },
        itens: [
          { nome: "Alface", quantidade: 1, preco: 4.5 },
          { nome: "Manga Tommy", quantidade: 2, preco: 8.9 },
        ],
        valorTotal: 22.3,
        distancia: "3.2 km",
        tempoEstimado: "20 min",
        observacoes: "Casa amarela com portão preto",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    setDeliveries(mockDeliveries)
    setIsLoading(false)
  }

  const loadMyDeliveries = async () => {
    // Simular entregas do entregador
    const mockMyDeliveries: Delivery[] = [
      {
        id: 4,
        pedidoId: 104,
        entregadorId: 1,
        status: "EM_TRANSITO",
        endereco: {
          rua: "Rua Nova",
          numero: "321",
          cidade: "São Paulo",
          estado: "SP",
          cep: "01234-456",
        },
        cliente: {
          nome: "Ana Costa",
          telefone: "(11) 77777-7777",
        },
        itens: [{ nome: "Tomate", quantidade: 2, preco: 8.0 }],
        valorTotal: 16.0,
        distancia: "1.5 km",
        tempoEstimado: "10 min",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 5,
        pedidoId: 105,
        entregadorId: 1,
        status: "ENTREGUE",
        endereco: {
          rua: "Rua Antiga",
          numero: "654",
          cidade: "São Paulo",
          estado: "SP",
          cep: "01234-789",
        },
        cliente: {
          nome: "Carlos Lima",
        },
        itens: [
          { nome: "Manga Tommy", quantidade: 1, preco: 8.9 },
          { nome: "Banana", quantidade: 2, preco: 6.0 },
        ],
        valorTotal: 20.9,
        distancia: "2.1 km",
        tempoEstimado: "15 min",
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
        updatedAt: new Date().toISOString(),
      },
    ]

    setMyDeliveries(mockMyDeliveries)
  }

  const acceptDelivery = async (deliveryId: number) => {
    // Simular aceitar entrega
    const delivery = deliveries.find((d) => d.id === deliveryId)
    if (delivery) {
      const updatedDelivery = { ...delivery, status: "EM_TRANSITO" as const, entregadorId: 1 }
      setDeliveries((prev) => prev.filter((d) => d.id !== deliveryId))
      setMyDeliveries((prev) => [updatedDelivery, ...prev])
      setIsDetailsOpen(false)
    }
  }

  const completeDelivery = async (deliveryId: number) => {
    // Simular finalizar entrega
    setMyDeliveries((prev) =>
      prev.map((d) =>
        d.id === deliveryId ? { ...d, status: "ENTREGUE" as const, updatedAt: new Date().toISOString() } : d,
      ),
    )
    setIsDetailsOpen(false)
  }

  const openDeliveryDetails = (delivery: Delivery) => {
    setSelectedDelivery(delivery)
    setIsDetailsOpen(true)
  }

  const refreshDeliveries = () => {
    loadAvailableDeliveries()
    loadMyDeliveries()
  }

  // Filtros
  const filteredDeliveries = deliveries.filter((delivery) => {
    if (filterDistance && delivery.distancia) {
      const distance = Number.parseFloat(delivery.distancia.replace(" km", ""))
      const maxDistance = Number.parseFloat(filterDistance)
      if (distance > maxDistance) return false
    }

    if (filterValue) {
      const minValue = Number.parseFloat(filterValue)
      if (delivery.valorTotal < minValue) return false
    }

    return true
  })

  // Estatísticas
  const activeDeliveries = myDeliveries.filter((d) => d.status === "EM_TRANSITO")
  const completedToday = myDeliveries.filter((d) => {
    const today = new Date().toDateString()
    const deliveryDate = new Date(d.updatedAt).toDateString()
    return d.status === "ENTREGUE" && deliveryDate === today
  })
  const totalEarningsToday = completedToday.reduce((sum, d) => {
    // Simular taxa de entrega (10% do valor do pedido)
    return sum + d.valorTotal * 0.1
  }, 0)

  // Se o perfil não está aprovado, mostrar status
  if (deliveryProfile && deliveryProfile.status_aprovacao !== "aprovado") {
    return (
      <DashboardLayout title="Dashboard do Entregador" userType="entregador">
        <div className="max-w-2xl mx-auto mt-8">
          <DeliveryApprovalStatus profile={deliveryProfile} onRetry={loadDeliveryProfile} />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Dashboard do Entregador" userType="entregador">
      <div className="space-y-6">
        {/* Header estilo iFood */}
        <div className="bg-gradient-to-r from-[#FE9A04] to-[#FF8500] rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Pronto para entregar?</h1>
              <p className="opacity-90">Encontre as melhores entregas da sua região</p>
            </div>
            <Button
              onClick={refreshDeliveries}
              variant="outline"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Disponíveis</p>
                  <p className="text-3xl font-bold text-blue-600">{filteredDeliveries.length}</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#FE9A04]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Em Andamento</p>
                  <p className="text-3xl font-bold text-[#FE9A04]">{activeDeliveries.length}</p>
                </div>
                <Truck className="w-8 h-8 text-[#FE9A04]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Entregues Hoje</p>
                  <p className="text-3xl font-bold text-green-600">{completedToday.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ganhos Hoje</p>
                  <p className="text-3xl font-bold text-purple-600">R$ {totalEarningsToday.toFixed(2)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navegação por abas */}
        <div className="flex gap-4 border-b">
          <button
            onClick={() => setActiveTab("available")}
            className={`pb-2 px-1 font-medium transition-colors ${
              activeTab === "available"
                ? "text-[#FE9A04] border-b-2 border-[#FE9A04]"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Disponíveis ({filteredDeliveries.length})
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`pb-2 px-1 font-medium transition-colors ${
              activeTab === "active"
                ? "text-[#FE9A04] border-b-2 border-[#FE9A04]"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Em Andamento ({activeDeliveries.length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`pb-2 px-1 font-medium transition-colors ${
              activeTab === "completed"
                ? "text-[#FE9A04] border-b-2 border-[#FE9A04]"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Concluídas ({myDeliveries.filter((d) => d.status === "ENTREGUE").length})
          </button>
        </div>

        {/* Filtros para entregas disponíveis */}
        {activeTab === "available" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="w-5 h-5 text-[#FE9A04]" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="distance">Distância máxima (km)</Label>
                  <Input
                    id="distance"
                    type="number"
                    placeholder="Ex: 5"
                    value={filterDistance}
                    onChange={(e) => setFilterDistance(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="value">Valor mínimo (R$)</Label>
                  <Input
                    id="value"
                    type="number"
                    placeholder="Ex: 20"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Conteúdo das abas */}
        {activeTab === "available" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Entregas Disponíveis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse border rounded-lg p-4">
                      <div className="flex justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="bg-gray-200 h-4 rounded w-1/3"></div>
                          <div className="bg-gray-200 h-3 rounded w-2/3"></div>
                          <div className="bg-gray-200 h-3 rounded w-1/2"></div>
                        </div>
                        <div className="bg-gray-200 h-10 w-24 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredDeliveries.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Nenhuma entrega disponível no momento</p>
                  <Button onClick={refreshDeliveries} className="mt-4 bg-[#FE9A04] hover:bg-[#E8890B]">
                    Atualizar Lista
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredDeliveries.map((delivery) => (
                    <div
                      key={delivery.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => openDeliveryDetails(delivery)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">Entrega #{delivery.id}</h3>
                            <Badge className="bg-blue-500">Disponível</Badge>
                          </div>

                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>{delivery.cliente.nome}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>
                                {delivery.endereco.rua}, {delivery.endereco.numero} - {delivery.endereco.cidade}
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{delivery.tempoEstimado}</span>
                              </div>
                              <span>• {delivery.distancia}</span>
                              <span>• R$ {delivery.valorTotal.toFixed(2)}</span>
                            </div>
                            <div>
                              <strong>Itens:</strong>{" "}
                              {delivery.itens.map((item) => `${item.quantidade}x ${item.nome}`).join(", ")}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-[#FE9A04] mb-2">
                            +R$ {(delivery.valorTotal * 0.1).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">Taxa de entrega</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "active" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#FE9A04]" />
                Entregas em Andamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeDeliveries.length === 0 ? (
                <div className="text-center py-12">
                  <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Nenhuma entrega em andamento</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeDeliveries.map((delivery) => (
                    <div
                      key={delivery.id}
                      className="border rounded-lg p-4 bg-orange-50 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => openDeliveryDetails(delivery)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">Entrega #{delivery.id}</h3>
                            <Badge className="bg-yellow-500">Em Trânsito</Badge>
                          </div>

                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>{delivery.cliente.nome}</span>
                              {delivery.cliente.telefone && (
                                <>
                                  <Phone className="w-4 h-4 ml-2" />
                                  <span>{delivery.cliente.telefone}</span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>
                                {delivery.endereco.rua}, {delivery.endereco.numero} - {delivery.endereco.cidade}
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{delivery.tempoEstimado}</span>
                              </div>
                              <span>• {delivery.distancia}</span>
                              <span>• R$ {delivery.valorTotal.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            variant="outline"                            onClick={(e) => {
                              e.stopPropagation()
                              if (typeof window !== 'undefined') {
                                const address = `${delivery.endereco.rua}, ${delivery.endereco.numero}, ${delivery.endereco.cidade}, ${delivery.endereco.estado}`
                                const encodedAddress = encodeURIComponent(address)
                                window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, "_blank")
                              }
                            }}
                          >
                            <Navigation className="w-4 h-4 mr-1" />
                            Maps
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "completed" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Entregas Concluídas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {myDeliveries.filter((d) => d.status === "ENTREGUE").length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Nenhuma entrega concluída ainda</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myDeliveries
                    .filter((d) => d.status === "ENTREGUE")
                    .map((delivery) => (
                      <div
                        key={delivery.id}
                        className="border rounded-lg p-4 bg-green-50 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => openDeliveryDetails(delivery)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">Entrega #{delivery.id}</h3>
                              <Badge className="bg-green-500">Entregue</Badge>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>{delivery.cliente.nome}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>
                                  {delivery.endereco.rua}, {delivery.endereco.numero} - {delivery.endereco.cidade}
                                </span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span>{delivery.distancia}</span>
                                <span>• R$ {delivery.valorTotal.toFixed(2)}</span>
                                <span>• {new Date(delivery.updatedAt).toLocaleDateString("pt-BR")}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="font-semibold text-green-600">
                              + R$ {(delivery.valorTotal * 0.1).toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">Ganho</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Modal de Detalhes da Entrega */}
        <DeliveryDetails
          delivery={selectedDelivery}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          onAccept={acceptDelivery}
          onComplete={completeDelivery}
          showActions={true}
        />
      </div>
    </DashboardLayout>
  )
}
