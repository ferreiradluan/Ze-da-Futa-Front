"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CreditCard, Shield, Clock } from "lucide-react"

function PagamentoProcessandoContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [timeLeft, setTimeLeft] = useState(60) // 60 segundos
  const [dots, setDots] = useState("")

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev === "...") return ""
        return prev + "."
      })
    }, 500)

    const countdownInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Simular redirecionamento após timeout
          const orderId = Math.floor(Math.random() * 10000)
          const success = Math.random() > 0.3 // 70% chance de sucesso
          
          if (success) {
            router.push(`/pagamento/sucesso?order_id=${orderId}`)
          } else {
            router.push('/pagamento/cancelado?motivo=timeout')
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(dotsInterval)
      clearInterval(countdownInterval)
    }
  }, [router])

  const cancelPayment = () => {
    router.push('/pagamento/cancelado?motivo=cancelado_pelo_usuario')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto space-y-6">
        
        {/* Card Principal */}
        <Card className="text-center border-blue-200 bg-white shadow-xl">
          <CardContent className="p-8">
            
            {/* Ícone de Loading */}
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Processando Pagamento{dots}
            </h1>
            
            <p className="text-gray-600 mb-6">
              Aguarde enquanto confirmamos seu pagamento de forma segura
            </p>

            {/* Barra de Progresso Animada */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${((60 - timeLeft) / 60) * 100}%` }}
              />
            </div>

            {/* Tempo Restante */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
              <Clock className="w-4 h-4" />
              <span>Tempo restante: {timeLeft}s</span>
            </div>

          </CardContent>
        </Card>

        {/* Informações de Segurança */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-green-800 mb-2">Transação Segura</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Conexão criptografada SSL</li>
                  <li>• Dados protegidos</li>
                  <li>• Processamento seguro</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Steps */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-sm text-gray-600">Dados verificados</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Loader2 className="w-3 h-3 text-white animate-spin" />
                </div>
                <span className="text-sm text-gray-800 font-medium">Processando pagamento</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-xs">3</span>
                </div>
                <span className="text-sm text-gray-400">Confirmação final</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instruções */}
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <CreditCard className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-orange-800 mb-2">Importante</h3>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Não feche esta página</li>
                  <li>• Não atualize o navegador</li>
                  <li>• Aguarde a confirmação</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botão Cancelar */}
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={cancelPayment}
            className="text-gray-600 hover:text-gray-800"
          >
            Cancelar Pagamento
          </Button>
        </div>        <div className="text-center text-sm text-gray-500">
          <p>© 2024 Zé da Fruta. Transação protegida por SSL</p>
        </div>
      </div>
    </div>
  )
}

export default function PagamentoProcessandoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-700">Carregando...</p>
        </div>
      </div>
    }>
      <PagamentoProcessandoContent />
    </Suspense>
  )
}
