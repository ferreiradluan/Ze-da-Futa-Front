"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import ProtectedRoute from "@/components/protected-route"
import ClientOnly from "@/components/client-only"
import { useAuth } from "@/hooks/use-auth"
import { authService } from "@/lib/auth-service"
import { API_CONFIG } from "@/lib/api-config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  Store, 
  Search, 
  MapPin, 
  Phone, 
  ShoppingCart, 
  Plus, 
  Minus, 
  X,
  Star,
  Clock,
  Loader2,
  Package,
  ShoppingBag,
  Filter,
  Heart,
  Bike
} from "lucide-react"

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
  nome: string
  descricao: string
  ativo: boolean
}

interface CartItem {
  id: string
  produtoId: string
  nomeProduto: string
  preco: number
  quantidade: number
  estabelecimentoId: string
  estabelecimentoNome: string
  unidade: string
}

interface Cart {
  id: string
  usuarioId: string
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
  const [currentView, setCurrentView] = useState<'establishments' | 'establishment-products' | 'cart'>('establishments')
  
  // Estados para estabelecimentos
  const [establishments, setEstablishments] = useState<Establishment[]>([])
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null)
  const [isLoadingEstablishments, setIsLoadingEstablishments] = useState(false)
  
  // Estados para produtos
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  
  // Estados para carrinho
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoadingCart, setIsLoadingCart] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && isAuthenticated) {
      console.log('🚀 Iniciando carregamento dos dados...')
      loadEstablishments()
      loadCart()
      loadCategories()
    }
  }, [mounted, isAuthenticated])

  // Função para obter headers com JWT token
  const getAuthHeaders = () => {
    const token = authService.getToken()
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  // Carregar estabelecimentos
  const loadEstablishments = async () => {
    setIsLoadingEstablishments(true)
    try {
      console.log('🏪 Carregando estabelecimentos...')
      const response = await fetch(`${API_BASE_URL}/sales/public/establishments`, {
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      
      const data = await response.json()
      console.log('✅ Dados recebidos:', data)
      
      let estabelecimentos = []
      if (Array.isArray(data)) {
        estabelecimentos = data
      } else if (data.value && Array.isArray(data.value)) {
        estabelecimentos = data.value
      } else if (data.estabelecimentos && Array.isArray(data.estabelecimentos)) {
        estabelecimentos = data.estabelecimentos
      }
      
      if (!estabelecimentos.length) {
        console.log('📦 Usando dados de fallback')
        estabelecimentos = FALLBACK_DATA.estabelecimentos
      }
      
      setEstablishments(estabelecimentos)
      console.log('✅ Estabelecimentos carregados:', estabelecimentos.length)
      
    } catch (error) {
      console.error('❌ Erro ao carregar estabelecimentos:', error)
      setEstablishments(FALLBACK_DATA.estabelecimentos)
    } finally {
      setIsLoadingEstablishments(false)
    }
  }

  // Carregar produtos de um estabelecimento
  const loadProducts = async (estabelecimentoNome: string) => {
    setIsLoadingProducts(true)
    try {
      console.log('🛍️ Carregando produtos de:', estabelecimentoNome)
      
      // Dados mock para demonstração
      const mockProducts: Product[] = [
        {
          id: "prod-1",
          nome: "Maçã Gala",
          preco: 6.99,
          descricao: "Maçãs frescas e crocantes, perfeitas para um lanche saudável",
          imagemUrl: "/placeholder.svg",
          categoria: "Frutas",
          estabelecimento: estabelecimentoNome,
          disponivel: true,
          estoque: 50,
          unidade: "kg",
          avaliacaoMedia: 4.8,
          totalAvaliacoes: 23
        },
        {
          id: "prod-2",
          nome: "Banana Prata",
          preco: 4.50,
          descricao: "Bananas doces e nutritivas, ricas em potássio",
          imagemUrl: "/placeholder.svg",
          categoria: "Frutas",
          estabelecimento: estabelecimentoNome,
          disponivel: true,
          estoque: 30,
          unidade: "kg",
          avaliacaoMedia: 4.9,
          totalAvaliacoes: 15
        },
        {
          id: "prod-3",
          nome: "Alface Americana",
          preco: 3.20,
          descricao: "Alface fresca e crocante, ideal para saladas",
          imagemUrl: "/placeholder.svg",
          categoria: "Verduras",
          estabelecimento: estabelecimentoNome,
          disponivel: true,
          estoque: 25,
          unidade: "unidade",
          avaliacaoMedia: 4.7,
          totalAvaliacoes: 12
        },
        {
          id: "prod-4",
          nome: "Tomate Italiano",
          preco: 8.90,
          precoPromocional: 6.90,
          descricao: "Tomates vermelhos e suculentos, ideais para molhos",
          imagemUrl: "/placeholder.svg",
          categoria: "Legumes",
          estabelecimento: estabelecimentoNome,
          disponivel: true,
          estoque: 40,
          unidade: "kg",
          avaliacaoMedia: 4.6,
          totalAvaliacoes: 18
        },
        {
          id: "prod-5",
          nome: "Cenoura Orgânica",
          preco: 7.50,
          descricao: "Cenouras orgânicas e doces, sem agrotóxicos",
          imagemUrl: "/placeholder.svg",
          categoria: "Legumes",
          estabelecimento: estabelecimentoNome,
          disponivel: true,
          estoque: 15,
          unidade: "kg",
          avaliacaoMedia: 4.9,
          totalAvaliacoes: 25
        }
      ]
      
      setProducts(mockProducts)
      console.log('✅ Produtos carregados:', mockProducts.length)
      
    } catch (error) {
      console.error('❌ Erro ao carregar produtos:', error)
    } finally {
      setIsLoadingProducts(false)
    }
  }

  // Carregar categorias
  const loadCategories = async () => {
    try {
      console.log('📂 Carregando categorias...')
      setCategories(FALLBACK_DATA.categorias)
    } catch (error) {
      console.error('❌ Erro ao carregar categorias:', error)
    }
  }

  // Carregar carrinho
  const loadCart = async () => {
    setIsLoadingCart(true)
    try {
      // Mock do carrinho vazio
      setCart({
        id: "cart-1",
        usuarioId: user?.id?.toString() || "user-1",
        itens: [],
        valorTotal: 0,
        quantidadeItens: 0,
        frete: 5.90,
        valorFinal: 5.90
      })
    } catch (error) {
      console.error('❌ Erro ao carregar carrinho:', error)
    } finally {
      setIsLoadingCart(false)
    }
  }

  // Adicionar produto ao carrinho
  const addToCart = async (product: Product) => {
    if (!cart) return
    
    const existingItem = cart.itens.find(item => item.produtoId === product.id)
    
    if (existingItem) {
      // Atualizar quantidade
      const updatedItems = cart.itens.map(item =>
        item.produtoId === product.id
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      )
      
      const newCart = {
        ...cart,
        itens: updatedItems,
        quantidadeItens: cart.quantidadeItens + 1,
        valorTotal: cart.valorTotal + (product.precoPromocional || product.preco),
        valorFinal: cart.valorTotal + (product.precoPromocional || product.preco) + cart.frete
      }
      
      setCart(newCart)
    } else {
      // Adicionar novo item
      const newItem: CartItem = {
        id: `item-${Date.now()}`,
        produtoId: product.id,
        nomeProduto: product.nome,
        preco: product.precoPromocional || product.preco,
        quantidade: 1,
        estabelecimentoId: selectedEstablishment?.id || "",
        estabelecimentoNome: selectedEstablishment?.nome || "",
        unidade: product.unidade
      }
      
      const newCart = {
        ...cart,
        itens: [...cart.itens, newItem],
        quantidadeItens: cart.quantidadeItens + 1,
        valorTotal: cart.valorTotal + newItem.preco,
        valorFinal: cart.valorTotal + newItem.preco + cart.frete
      }
      
      setCart(newCart)
    }
    
    console.log('✅ Produto adicionado ao carrinho:', product.nome)
  }

  // Entrar em um estabelecimento
  const enterEstablishment = (establishment: Establishment) => {
    console.log('🏪 Entrando no estabelecimento:', establishment.nome)
    setSelectedEstablishment(establishment)
    setCurrentView('establishment-products')
    loadProducts(establishment.nome)
  }

  // Sair do estabelecimento
  const exitEstablishment = () => {
    console.log('🚪 Saindo do estabelecimento')
    setSelectedEstablishment(null)
    setCurrentView('establishments')
    setProducts([])
    setSearchTerm("")
    setSelectedCategory("all")
  }

  // Filtrar produtos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.categoria.toLowerCase() === selectedCategory.toLowerCase()
    
    return matchesSearch && matchesCategory
  })

  // Formatar preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }
  // Não renderizar até estar montado no cliente
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">🔄 Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  // Se não autenticado, não renderizar nada (ProtectedRoute cuidará do redirect)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fixo estilo iFood */}
      <div className="bg-white shadow-md sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {currentView !== 'establishments' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={exitEstablishment}
                  className="flex items-center gap-2 hover:bg-orange-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </Button>
              )}
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentView === 'establishments' && 'Zé da Fruta'}
                  {currentView === 'establishment-products' && selectedEstablishment?.nome}
                </h1>
                <p className="text-sm text-gray-600">
                  {currentView === 'establishments' && `Olá, ${user?.name || 'usuário'}! O que você deseja hoje?`}
                  {currentView === 'establishment-products' && 'Produtos frescos e selecionados'}
                </p>
              </div>
            </div>

            {/* Carrinho */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className="relative bg-orange-500 text-white hover:bg-orange-600 border-orange-500"
              >
                <ShoppingCart className="w-4 h-4" />
                {cart && cart.quantidadeItens > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 px-1 min-w-5 h-5 bg-red-500"
                  >
                    {cart.quantidadeItens}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* View: Lista de Estabelecimentos - Estilo iFood */}
        {currentView === 'establishments' && (
          <div className="space-y-6">
            {/* Barra de busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar estabelecimentos, produtos..."
                className="pl-12 h-12 text-lg border-2 border-gray-200 focus:border-orange-500 rounded-lg"
              />
            </div>

            {/* Categorias horizontais */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              <Badge variant="default" className="bg-orange-500 text-white px-4 py-2 rounded-full">
                <Store className="w-4 h-4 mr-2" />
                Todos
              </Badge>
              <Badge variant="outline" className="px-4 py-2 rounded-full">
                <Bike className="w-4 h-4 mr-2" />
                Entrega rápida
              </Badge>
              <Badge variant="outline" className="px-4 py-2 rounded-full">
                <Star className="w-4 h-4 mr-2" />
                Mais avaliados
              </Badge>
              <Badge variant="outline" className="px-4 py-2 rounded-full">
                <Heart className="w-4 h-4 mr-2" />
                Favoritos
              </Badge>
            </div>

            {/* Banner promocional */}
            <div className="bg-gradient-to-r from-orange-400 to-red-400 rounded-xl p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">🍊 Frutas Frescas Hoje!</h2>
              <p className="text-orange-100 mb-4">Descontos especiais em frutas selecionadas</p>
              <Badge className="bg-white text-orange-500 px-3 py-1">
                Até 30% OFF
              </Badge>
            </div>

            {/* Lista de estabelecimentos */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Estabelecimentos próximos
              </h3>
              
              {isLoadingEstablishments ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-orange-500 mr-2" />
                  <span>Carregando estabelecimentos...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {establishments.map(establishment => (
                    <Card 
                      key={establishment.id} 
                      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 overflow-hidden"
                      onClick={() => enterEstablishment(establishment)}
                    >
                      <div className="aspect-video relative">
                        <Image
                          src={establishment.imagemUrl || '/placeholder.svg'}
                          alt={establishment.nome}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg'
                          }}
                        />
                        {/* Badge de entrega */}
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-green-500 text-white">
                            <Clock className="w-3 h-3 mr-1" />
                            25-35 min
                          </Badge>
                        </div>
                        {/* Badge de avaliação */}
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-white text-gray-800">
                            <Star className="w-3 h-3 mr-1 text-yellow-400" />
                            4.8
                          </Badge>
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg mb-1">{establishment.nome}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {establishment.descricao}
                        </p>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-500">
                            <MapPin className="w-4 h-4" />
                            <span className="line-clamp-1">{establishment.endereco}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-500">
                              <Bike className="w-4 h-4" />
                              <span>Entrega R$ 3,99</span>
                            </div>
                            <Badge variant="outline" className="text-green-600">
                              Aberto
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* View: Produtos do Estabelecimento - Estilo iFood */}
        {currentView === 'establishment-products' && selectedEstablishment && (
          <div className="space-y-6">
            {/* Header do estabelecimento */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 relative">
                  <Image
                    src={selectedEstablishment.imagemUrl || '/placeholder.svg'}
                    alt={selectedEstablishment.nome}
                    fill
                    className="rounded-lg object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg'
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{selectedEstablishment.nome}</h2>
                  <p className="text-gray-600 mb-3">{selectedEstablishment.descricao}</p>
                  
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="font-medium">4.8</span>
                      <span className="text-gray-500">(200+ avaliações)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>25-35 min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bike className="w-4 h-4 text-gray-400" />
                      <span>R$ 3,99</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Barra de busca e filtros */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("all")}
                    className={selectedCategory === "all" ? "bg-orange-500" : ""}
                  >
                    Todos
                  </Button>
                  {categories.map(category => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.nome.toLowerCase() ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.nome.toLowerCase())}
                      className={selectedCategory === category.nome.toLowerCase() ? "bg-orange-500" : ""}
                    >
                      {category.nome}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Grid de produtos */}
            {isLoadingProducts ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500 mr-2" />
                <span>Carregando produtos...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square relative">
                      <Image
                        src={product.imagemUrl || '/placeholder.svg'}
                        alt={product.nome}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg'
                        }}
                      />
                      {product.precoPromocional && (
                        <Badge 
                          variant="destructive" 
                          className="absolute top-2 left-2 bg-red-500"
                        >
                          -{Math.round(((product.preco - product.precoPromocional) / product.preco) * 100)}%
                        </Badge>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-1">{product.nome}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.descricao}</p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          {product.precoPromocional ? (
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-green-600">
                                {formatPrice(product.precoPromocional)}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                {formatPrice(product.preco)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold">
                              {formatPrice(product.preco)}
                            </span>
                          )}
                          <span className="text-sm text-gray-500">/{product.unidade}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm font-medium">{product.avaliacaoMedia}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3 text-sm">
                        <Badge variant="outline" className="text-xs">
                          {product.categoria}
                        </Badge>
                        <span className="text-gray-500">
                          Est: {product.estoque}
                        </span>
                      </div>
                      
                      <Button
                        onClick={() => addToCart(product)}
                        disabled={!product.disponivel || product.estoque === 0}
                        className="w-full bg-orange-500 hover:bg-orange-600"
                        size="sm"
                      >
                        {product.disponivel && product.estoque > 0 ? (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar
                          </>
                        ) : (
                          'Indisponível'
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!isLoadingProducts && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Nenhum produto encontrado</p>
                {(searchTerm || selectedCategory !== "all") && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCategory("all")
                    }}
                    className="mt-4"
                  >
                    Limpar filtros
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal do Carrinho - Estilo iFood */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-orange-500" />
              Seu Carrinho
            </DialogTitle>
          </DialogHeader>
          
          {isLoadingCart ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-orange-500 mr-2" />
              <span>Carregando carrinho...</span>
            </div>
          ) : cart && cart.itens.length > 0 ? (
            <div className="space-y-4">
              {cart.itens.map((item) => (
                <div key={item.produtoId} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-16 h-16 relative">
                    <Image
                      src="/placeholder.svg"
                      alt={item.nomeProduto}
                      fill
                      className="rounded object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.nomeProduto}</h4>
                    <p className="text-gray-600">{formatPrice(item.preco)}/{item.unidade}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-8 h-8"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    
                    <span className="w-8 text-center font-medium">{item.quantidade}</span>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-8 h-8"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold">{formatPrice(item.preco * item.quantidade)}</p>
                  </div>
                </div>
              ))}
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(cart.valorTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxa de entrega</span>
                  <span>{formatPrice(cart.frete)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(cart.valorFinal)}</span>
                </div>
              </div>
              
              <Button className="w-full bg-orange-500 hover:bg-orange-600" size="lg">
                Finalizar Pedido
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">Seu carrinho está vazio</p>
              <p className="text-gray-500 text-sm mb-4">Adicione produtos para continuar</p>
              <Button 
                variant="outline" 
                onClick={() => setIsCartOpen(false)}
                className="mt-4"
              >
                Continuar Comprando
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
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
