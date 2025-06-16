"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, MapPin, Clock, ArrowRight } from "lucide-react"

export default function PagamentoSucessoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [orderDetails, setOrderDetails] = useState<any>(null)

  useEffect(() => {
    // Simular carregamento dos detalhes do pedido
    const orderId = searchParams.get('order_id')
    if (orderId) {
      // Em produção, buscar dados reais da API
      setOrderDetails({
        id: orderId,
        total: 85.50,
        items: [
          { name: "Maçã Gala", quantity: 2, price: 8.90 },
          { name: "Banana Prata", quantity: 3, price: 6.00 },
          { name: "Tomate Cereja", quantity: 1, price: 12.50 }
        ],
        estimatedDelivery: "30-45 minutos",
        address: "Rua das Flores, 123 - São Paulo, SP"
      })
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        
        {/* Header de Sucesso */}
        <Card className="text-center border-green-200 bg-white shadow-xl">
          <CardContent className="p-8">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Pagamento Realizado com Sucesso!
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              Seu pedido foi confirmado e está sendo preparado
            </p>
            
            {orderDetails && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-green-700 font-medium">Pedido #{orderDetails.id}</p>
                <p className="text-2xl font-bold text-green-800">
                  R$ {orderDetails.total.toFixed(2)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detalhes do Pedido */}
        {orderDetails && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#FE9A04]" />
                Detalhes do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Status de Entrega */}
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-[#FE9A04]" />
                  <div>
                    <p className="font-medium text-[#FE9A04]">Tempo Estimado de Entrega</p>
                    <p className="text-sm text-gray-600">{orderDetails.estimatedDelivery}</p>
                  </div>
                </div>
              </div>

              {/* Endereço de Entrega */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium">Endereço de Entrega</p>
                  <p className="text-sm text-gray-600">{orderDetails.address}</p>
                </div>
              </div>

              {/* Itens do Pedido */}
              <div>
                <h4 className="font-medium mb-3">Itens do Pedido</h4>
                <div className="space-y-2">
                  {orderDetails.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="font-medium">R$ {(item.quantity * item.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-2 mt-3">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-[#FE9A04]">R$ {orderDetails.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Próximos Passos */}
        <Card>
          <CardHeader>
            <CardTitle>Próximos Passos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-[#FE9A04] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <div>
                  <p className="font-medium">Preparação do Pedido</p>
                  <p className="text-sm text-gray-600">Nossos parceiros estão separando seus produtos</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <div>
                  <p className="font-medium">Saiu para Entrega</p>
                  <p className="text-sm text-gray-600">Um entregador irá buscar e levar até você</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <div>
                  <p className="font-medium">Entregue</p>
                  <p className="text-sm text-gray-600">Pedido entregue no endereço informado</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => router.push('/comprador/dashboard')}
            className="flex-1 bg-[#FE9A04] hover:bg-[#E8890B] h-12"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Voltar às Compras
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.push('/comprador/pedidos')}
            className="flex-1 h-12"
          >
            Acompanhar Pedido
          </Button>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Você receberá atualizações por WhatsApp sobre o status do seu pedido</p>
        </div>
      </div>
    </div>
  )
}
