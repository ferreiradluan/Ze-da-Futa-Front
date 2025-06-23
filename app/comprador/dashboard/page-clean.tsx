"use client"

import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/protected-route"
import ClientOnly from "@/components/client-only"
import { useAuth } from "@/hooks/use-auth"
import { authService } from "@/lib/auth-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ShoppingCart,
  Plus,
  Minus,
  Search,
  Star,
  MapPin,
  Package,
  Clock,
  Store,
  ArrowLeft,
  User,
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

const API_BASE_URL = "https://meu-ze-da-fruta-backend-8c4976f28553.herokuapp.com"

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

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && isAuthenticated) {
      loadEstablishments()
      loadCategories()
      loadCart()
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
      console.log('🚀 Carregando estabelecimentos...')
      const response = await fetch(`${API_BASE_URL}/sales/public/establishments`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const establishments: Establishment[] = await response.json()
      console.log('✅ Estabelecimentos carregados:', establishments)
      
      setEstablishments(establishments)
    } catch (error) {
      console.error('❌ Erro ao carregar estabelecimentos:', error)
      setEstablishments([])
    } finally {
      setIsLoadingEstablishments(false)
    }
  }

  // Carregar categorias
  const loadCategories = async () => {
    try {
      console.log('🏷️ Carregando categorias...')
      const response = await fetch(`${API_BASE_URL}/sales/public/categories`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const categories: Category[] = await response.json()
      console.log('✅ Categorias carregadas:', categories)
      
      setCategories(categories)
    } catch (error) {
      console.error('❌ Erro ao carregar categorias:', error)
      setCategories([])
    }
  }

  // Carregar produtos (mock por enquanto)
  const loadProducts = async (estabelecimentoNome?: string) => {
    setIsLoadingProducts(true)
    try {
      console.log('🛍️ Carregando produtos para:', estabelecimentoNome)
      
      // Por enquanto usando produtos mock até ter endpoint específico
      const mockProducts: Product[] = [
        {
          id: "1",
          nome: "Maçã Gala",
          preco: 6.99,
          descricao: "Maçãs frescas e crocantes",
          imagemUrl: "/placeholder.svg",
          categoria: "Frutas",
          estabelecimento: estabelecimentoNome || "",
          disponivel: true,
          estoque: 50,
          unidade: "kg",
          avaliacaoMedia: 4.8,
          totalAvaliacoes: 23
        },
        {
          id: "2",
          nome: "Banana Prata",
          preco: 4.5,
          descricao: "Bananas doces e nutritivas",
          imagemUrl: "/placeholder.svg",
          categoria: "Frutas",
          estabelecimento: estabelecimentoNome || "",
          disponivel: true,
          estoque: 30,
          unidade: "kg",
          avaliacaoMedia: 4.9,
          totalAvaliacoes: 15
        }
      ]
      
      setProducts(mockProducts)
    } catch (error) {
      console.error('❌ Erro ao carregar produtos:', error)
      setProducts([])
    } finally {
      setIsLoadingProducts(false)
    }
  }

  // Carregar carrinho
  const loadCart = async () => {
    setIsLoadingCart(true)
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: getAuthHeaders(),
      })
      
      if (response.ok) {
        const cart: Cart = await response.json()
        setCart(cart)
      }
    } catch (error) {
      console.error('❌ Erro ao carregar carrinho:', error)
    } finally {
      setIsLoadingCart(false)
    }
  }

  // Adicionar ao carrinho
  const addToCart = async (product: Product) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/items`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          produtoId: product.id,
          quantidade: 1
        })
      })

      if (response.ok) {
        console.log('✅ Produto adicionado ao carrinho')
        loadCart() // Recarregar carrinho
      }
    } catch (error) {
      console.error('❌ Erro ao adicionar ao carrinho:', error)
    }
  }

  // Entrar no estabelecimento
  const enterEstablishment = (establishment: Establishment) => {
    setSelectedEstablishment(establishment)
    setCurrentView('establishment-products')
    loadProducts(establishment.nome)
  }

  // Sair do estabelecimento
  const exitEstablishment = () => {
    setSelectedEstablishment(null)
    setCurrentView('establishments')
    setProducts([])
    setSearchTerm("")
    setSelectedCategory("all")
  }

  // Filtrar produtos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Obter categorias únicas
  const uniqueCategories = Array.from(new Set(categories.map(cat => cat.nome)))

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {currentView !== 'establishments' && (
                <Button 
                  variant="ghost" 
                  onClick={exitEstablishment}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </Button>
              )}
              <h1 className="text-2xl font-bold text-gray-900">
                {currentView === 'establishments' ? 'Estabelecimentos' : selectedEstablishment?.nome}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">
                  Olá, {user?.name || 'usuário'}!
                </span>
              </div>
              
              {cart && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentView('cart')}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Carrinho ({cart.quantidadeItens})
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* View: Lista de Estabelecimentos */}
        {currentView === 'establishments' && (
          <div>
            <div className="mb-6">
              <p className="text-gray-600 mb-4">Bem-vindo ao marketplace.</p>
              <p className="text-sm text-gray-500">
                Estabelecimentos: {establishments.length} | 
                Loading: {isLoadingEstablishments ? '✅' : '❌'}
              </p>
            </div>

            {isLoadingEstablishments ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                <span className="ml-3">Carregando estabelecimentos...</span>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-4">Escolha um estabelecimento</h2>
                
                {establishments.length === 0 ? (
                  <div className="text-center py-12">
                    <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Nenhum estabelecimento encontrado</p>
                    <Button onClick={loadEstablishments} variant="outline">
                      Tentar novamente
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {establishments.map((establishment) => (
                      <Card 
                        key={establishment.id} 
                        className="cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => enterEstablishment(establishment)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{establishment.nome}</h3>
                              <p className="text-sm text-gray-600 mb-2">{establishment.descricao}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{establishment.endereco}</span>
                            </div>
                            
                            {establishment.telefone && (
                              <div className="flex items-center gap-2">
                                <span>📞</span>
                                <span>{establishment.telefone}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-4">
                            <Badge variant="secondary">Disponível</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* View: Produtos do Estabelecimento */}
        {currentView === 'establishment-products' && selectedEstablishment && (
          <div>
            {/* Header do Estabelecimento */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-2">{selectedEstablishment.nome}</h2>
              <p className="text-gray-600 mb-4">{selectedEstablishment.descricao}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedEstablishment.endereco}</span>
                </div>
                {selectedEstablishment.telefone && (
                  <div className="flex items-center gap-2">
                    <span>📞</span>
                    <span>{selectedEstablishment.telefone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">Todas as categorias</option>
                  {uniqueCategories.map(category => (
                    <option key={category} value={category.toLowerCase()}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid de Produtos */}
            {isLoadingProducts ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                <span className="ml-3">Carregando produtos...</span>
              </div>
            ) : (
              <div>
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum produto encontrado</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <Card key={product.id} className="overflow-hidden">
                        <div className="aspect-square bg-gray-100 relative">
                          {/* Placeholder para imagem */}
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package className="w-12 h-12" />
                          </div>
                        </div>
                        
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">{product.nome}</h3>
                          <p className="text-sm text-gray-600 mb-3">{product.descricao}</p>
                          
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="text-lg font-bold text-green-600">
                                {formatPrice(product.preco)}
                              </span>
                              <span className="text-sm text-gray-500">/{product.unidade}</span>
                            </div>
                            
                            {product.avaliacaoMedia && (
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">{product.avaliacaoMedia}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between mb-3">
                            <Badge variant="outline">{product.categoria}</Badge>
                            <span className="text-sm text-gray-500">
                              {product.estoque} disponível
                            </span>
                          </div>
                          
                          <Button 
                            className="w-full"
                            onClick={() => addToCart(product)}
                            disabled={!product.disponivel || product.estoque === 0}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Adicionar ao Carrinho
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
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
