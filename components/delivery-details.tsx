"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MapPin, Clock, Package, Phone, User, Navigation } from "lucide-react"
import type { Delivery } from "@/lib/api"

interface DeliveryDetailsProps {
  delivery: Delivery | null
  isOpen: boolean
  onClose: () => void
  onAccept?: (deliveryId: number) => void
  onComplete?: (deliveryId: number) => void
  showActions?: boolean
}

export default function DeliveryDetails({
  delivery,
  isOpen,
  onClose,
  onAccept,
  onComplete,
  showActions = true,
}: DeliveryDetailsProps) {
  if (!delivery) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AGUARDANDO_COLETA":
        return "bg-blue-500"
      case "EM_TRANSITO":
        return "bg-yellow-500"
      case "ENTREGUE":
        return "bg-green-500"
      case "CANCELADA":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "AGUARDANDO_COLETA":
        return "Aguardando Coleta"
      case "EM_TRANSITO":
        return "Em Trânsito"
      case "ENTREGUE":
        return "Entregue"
      case "CANCELADA":
        return "Cancelada"
      default:
        return status
    }
  }

  const openMaps = () => {
    const address = `${delivery.endereco.rua}, ${delivery.endereco.numero}, ${delivery.endereco.cidade}, ${delivery.endereco.estado}`
    const encodedAddress = encodeURIComponent(address)
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, "_blank")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Entrega #{delivery.id}</span>
            <Badge className={getStatusColor(delivery.status)}>{getStatusText(delivery.status)}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações do Cliente */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-[#FE9A04]" />
                Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <p className="font-medium">{delivery.cliente.nome}</p>
                {delivery.cliente.telefone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{delivery.cliente.telefone}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Endereço de Entrega */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FE9A04]" />
                Endereço de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <p className="font-medium">
                  {delivery.endereco.rua}, {delivery.endereco.numero}
                </p>
                <p className="text-sm text-gray-600">
                  {delivery.endereco.cidade}, {delivery.endereco.estado}
                </p>
                <p className="text-sm text-gray-600">CEP: {delivery.endereco.cep}</p>

                <Button variant="outline" size="sm" onClick={openMaps} className="w-full mt-2">
                  <Navigation className="w-4 h-4 mr-2" />
                  Abrir no Maps
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Informações da Entrega */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Package className="w-4 h-4 text-[#FE9A04]" />
                Detalhes da Entrega
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {delivery.distancia && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Distância:</span>
                    <span className="font-medium">{delivery.distancia}</span>
                  </div>
                )}

                {delivery.tempoEstimado && (
                  <div className="flex items-center justify-between">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Tempo estimado:</span>
                    <span className="font-medium">{delivery.tempoEstimado}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Valor total:</span>
                  <span className="font-bold text-[#FE9A04] text-lg">R$ {delivery.valorTotal.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Itens do Pedido */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Itens do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {delivery.itens.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.nome}</p>
                      <p className="text-xs text-gray-600">
                        {item.quantidade}x R$ {item.preco.toFixed(2)}
                      </p>
                    </div>
                    <span className="font-medium">R$ {(item.quantidade * item.preco).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Observações */}
          {delivery.observacoes && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Observações</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600">{delivery.observacoes}</p>
              </CardContent>
            </Card>
          )}

          {/* Ações */}
          {showActions && (
            <div className="flex gap-2 pt-4">
              {delivery.status === "AGUARDANDO_COLETA" && onAccept && (
                <Button onClick={() => onAccept(delivery.id)} className="flex-1 bg-[#FE9A04] hover:bg-[#E8890B]">
                  Aceitar Entrega
                </Button>
              )}

              {delivery.status === "EM_TRANSITO" && onComplete && (
                <Button onClick={() => onComplete(delivery.id)} className="flex-1 bg-green-600 hover:bg-green-700">
                  Marcar como Entregue
                </Button>
              )}

              <Button variant="outline" onClick={onClose} className="flex-1">
                Fechar
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
