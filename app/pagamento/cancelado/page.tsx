"use client"

import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { XCircle, ArrowLeft, RefreshCw, MessageCircle, ShoppingCart } from "lucide-react"

function PagamentoCanceladoContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const motivo = searchParams.get('motivo') || 'cancelado_pelo_usuario'

  const getMotivoTexto = (motivo: string) => {
    switch (motivo) {
      case 'cancelado_pelo_usuario':
        return 'Pagamento cancelado pelo usuário'
      case 'erro_cartao':
        return 'Erro no cartão de crédito'
      case 'fundos_insuficientes':
        return 'Fundos insuficientes'
      case 'timeout':
        return 'Tempo limite excedido'
      case 'erro_processamento':
        return 'Erro no processamento'
      default:
        return 'Pagamento não realizado'
    }
  }

  const getDescricaoMotivo = (motivo: string) => {
    switch (motivo) {
      case 'cancelado_pelo_usuario':
        return 'Você cancelou o pagamento. Seus itens foram mantidos no carrinho.'
      case 'erro_cartao':
        return 'Houve um problema com os dados do seu cartão. Verifique as informações e tente novamente.'
      case 'fundos_insuficientes':
        return 'Não há saldo suficiente no cartão. Verifique seu limite ou use outro método de pagamento.'
      case 'timeout':
        return 'O tempo para concluir o pagamento foi excedido. Tente novamente.'
      case 'erro_processamento':
        return 'Ocorreu um erro técnico durante o processamento. Tente novamente em alguns minutos.'
      default:
        return 'Não foi possível processar seu pagamento. Tente novamente.'
    }
  }

  const getSugestoes = (motivo: string) => {
    switch (motivo) {
      case 'erro_cartao':
        return [
          'Verifique se os dados do cartão estão corretos',
          'Confirme se o cartão está ativo e dentro da validade',
          'Tente usar outro cartão'
        ]
      case 'fundos_insuficientes':
        return [
          'Verifique o limite disponível do seu cartão',
          'Use outro cartão com limite suficiente',
          'Considere dividir a compra em mais parcelas'
        ]
      case 'timeout':
        return [
          'Certifique-se de ter uma conexão estável',
          'Tente novamente com calma',
          'Evite navegar para outras páginas durante o pagamento'
        ]
      default:
        return [
          'Tente novamente em alguns minutos',
          'Verifique sua conexão com a internet',
          'Use outro método de pagamento'
        ]
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        
        {/* Header de Cancelamento */}
        <Card className="text-center border-red-200 bg-white shadow-xl">
          <CardContent className="p-8">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Pagamento Não Realizado
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              {getMotivoTexto(motivo)}
            </p>
            
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {getDescricaoMotivo(motivo)}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Sugestões para Resolver */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <MessageCircle className="w-5 h-5" />
              Como Resolver
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {getSugestoes(motivo).map((sugestao, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-orange-700 font-bold text-sm">{index + 1}</span>
                  </div>
                  <p className="text-gray-700">{sugestao}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Informações do Carrinho */}
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingCart className="w-6 h-6 text-orange-600" />
              <div>
                <h3 className="font-semibold text-orange-800">Seus Itens Foram Preservados</h3>
                <p className="text-sm text-orange-700">
                  Todos os produtos do seu carrinho foram mantidos. Você pode finalizar a compra quando quiser.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Métodos de Pagamento Alternativos */}
        <Card>
          <CardHeader>
            <CardTitle>Outras Opções de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <h4 className="font-medium mb-2">PIX</h4>
                <p className="text-sm text-gray-600">Pagamento instantâneo e seguro</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <h4 className="font-medium mb-2">Cartão de Débito</h4>
                <p className="text-sm text-gray-600">Débito direto da sua conta</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <h4 className="font-medium mb-2">Boleto</h4>
                <p className="text-sm text-gray-600">Pague em qualquer banco ou lotérica</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <h4 className="font-medium mb-2">Carteira Digital</h4>
                <p className="text-sm text-gray-600">PayPal, PicPay e outros</p>
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
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.push('/comprador/dashboard')}
            className="flex-1 h-12"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar às Compras
          </Button>
        </div>

        {/* Suporte */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-blue-800 mb-2">Precisa de Ajuda?</h3>
            <p className="text-sm text-blue-700 mb-4">
              Nossa equipe está pronta para ajudar você a resolver qualquer problema com pagamentos.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat Online
              </Button>
              <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                WhatsApp (11) 9999-9999
              </Button>
            </div>
          </CardContent>
        </Card>        <div className="text-center text-sm text-gray-500">
          <p>© 2024 Zé da Fruta. Seus dados estão protegidos e seguros.</p>
        </div>
      </div>
    </div>
  )
}

export default function PagamentoCanceladoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-red-700">Carregando...</p>
        </div>
      </div>
    }>
      <PagamentoCanceladoContent />
    </Suspense>
  )
}
