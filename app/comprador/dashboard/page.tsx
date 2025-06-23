"use client"

import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/protected-route"
import ClientOnly from "@/components/client-only"
import { useAuth } from "@/hooks/use-auth"
import { authService } from "@/lib/auth-service"
import { API_CONFIG } from "@/lib/api-config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Store, Search, MapPin, Phone } from "lucide-react"

// Interfaces exatas conforme o backend retorna
interface Establishment {
  id: string
  nome: string
  endereco: string
  telefone: string
  descricao: string
  imagemUrl: string | null
}

interface Product {
  id: string
  nome: string
  preco: number
  precoPromocional?: number
  descricao: string
  imagemUrl: string
  categoria: string
  estabelecimento: string
  disponivel: boolean
  estoque: number
  unidade: string
  avaliacaoMedia?: number
  totalAvaliacoes?: number
}

interface Category {
  id: string
  createdAt: string
  updatedAt: string
  nome: string
  descricao: string
  ativo: boolean
  estabelecimentoId: string | null
  domainEvents: any[]
}

interface CartItem {
  produtoId: string
  nomeProduto: string
  preco: number
  quantidade: number
  subtotal: number
  imagemUrl: string
}

interface Cart {
  itens: CartItem[]
  valorTotal: number
  quantidadeItens: number
  frete: number
  valorFinal: number
}

// Usar configuração centralizada
const API_BASE_URL = API_CONFIG.FETCH_URL

const FALLBACK_DATA = {
  estabelecimentos: [
    { id: "05b24fbe-3d20-433a-864b-0f6949ce7264", nome: "Frutaria do Bairro", endereco: "Rua Local, 789 - Bairro Residencial, São Paulo/SP", telefone: "(11) 2233-4455", descricao: "Frutaria de bairro com variedade de frutas frescas", imagemUrl: null },
    { id: "8e1dd81b-70f4-4340-9ff9-5cc810849c31", nome: "Frutaria do Bairro", endereco: "Rua Local, 789 - Bairro Residencial, São Paulo/SP", telefone: "(11) 2233-4455", descricao: "Frutaria de bairro com variedade de frutas frescas", imagemUrl: null },
    { id: "fdbba1b7-baa2-4ced-90db-ab093e99818f", nome: "Hortifruti Central", endereco: "Rua das Frutas, 123 - Centro, São Paulo/SP", telefone: "(11) 3456-7890", descricao: "Hortifruti com produtos frescos e selecionados", imagemUrl: null },
    { id: "373bfdff-a37c-486b-811b-042941212ef4", nome: "Hortifruti Central", endereco: "Rua das Frutas, 123 - Centro, São Paulo/SP", telefone: "(11) 3456-7890", descricao: "Hortifruti com produtos frescos e selecionados", imagemUrl: null },
    { id: "82b027d5-ed99-45cc-b666-cd2d22c8d2c2", nome: "Verduras & Legumes Premium", endereco: "Avenida dos Vegetais, 456 - Vila Nova, São Paulo/SP", telefone: "(11) 9876-5432", descricao: "Verduras e legumes orgânicos de alta qualidade", imagemUrl: null },
    { id: "4abff503-2b97-41ee-9828-e66b600eff56", nome: "Verduras & Legumes Premium", endereco: "Avenida dos Vegetais, 456 - Vila Nova, São Paulo/SP", telefone: "(11) 9876-5432", descricao: "Verduras e legumes orgânicos de alta qualidade", imagemUrl: null }
  ],
  categorias: [
    { id: "baed779f-1387-4417-b15c-f9b0f5b3f3dc", nome: "Frutas", descricao: "Frutas frescas e variadas", ativo: true },
    { id: "6d3adfff-651b-422a-8539-58a866c907d8", nome: "Legumes", descricao: "Legumes frescos e nutritivos", ativo: true },
    { id: "d4cb8408-a5b8-44ee-b052-6b2e50c52e1e", nome: "Temperos", descricao: "Temperos e ervas aromáticas", ativo: true },
    { id: "9a7cc78d-f6a1-43e3-8740-b7f201db78f9", nome: "Verduras", descricao: "Verduras orgânicas e convencionais", ativo: true }
  ]
}

function CompradorDashboard() {
  const { user, isAuthenticated } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [establishments, setEstablishments] = useState<Establishment[]>([])
  const [isLoadingEstablishments, setIsLoadingEstablishments] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (mounted && isAuthenticated) {
      loadEstablishments()
    }
  }, [mounted, isAuthenticated])

  const loadEstablishments = async () => {
    setIsLoadingEstablishments(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/sales/public/establishments`, { headers: { 'Content-Type': 'application/json' } })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      let estabelecimentos = []
      if (Array.isArray(data)) {
        estabelecimentos = data
      } else if (data.value && Array.isArray(data.value)) {
        estabelecimentos = data.value
      } else if (data.estabelecimentos && Array.isArray(data.estabelecimentos)) {
        estabelecimentos = data.estabelecimentos
      }
      if (!estabelecimentos.length) throw new Error('Nenhum estabelecimento encontrado')
      setEstablishments(estabelecimentos)
    } catch (err: any) {
      setError('Erro ao carregar estabelecimentos. Exibindo dados de fallback.')
      setEstablishments(FALLBACK_DATA.estabelecimentos)
    } finally {
      setIsLoadingEstablishments(false)
    }
  }

  if (!mounted) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Estabelecimentos</h1>
        <p className="mb-2">Olá, {user?.name || 'usuário'}! Bem-vindo ao marketplace.</p>
        <div className="mb-4">
          <Button onClick={loadEstablishments} disabled={isLoadingEstablishments}>
            🔄 Testar API
          </Button>
        </div>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {establishments.map(estab => (
            <Card key={estab.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{estab.nome}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 text-gray-700">{estab.descricao}</div>
                <div className="mb-1 flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" /> {estab.endereco}
                </div>
                <div className="mb-1 flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" /> {estab.telefone}
                </div>
                {estab.imagemUrl && <img src={estab.imagemUrl} alt={estab.nome} className="w-full h-32 object-cover rounded mt-2" />}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function CompradorDashboardPage() {
  return (
    <ProtectedRoute requiredUserType="comprador">
      <ClientOnly>
        <CompradorDashboard />
      </ClientOnly>
    </ProtectedRoute>
  )
}
