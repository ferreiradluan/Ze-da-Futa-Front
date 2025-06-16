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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Heart,
  ShoppingBag,
  X,
  Loader2,
} from "lucide-react"
import Image from "next/image"

// Interfaces conforme estrutura real do backend
interface Establishment {
  id: string
  nome: string
  endereco: string // No backend é string simples, não objeto
  telefone?: string
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
  avaliacaoMedia: number
  totalAvaliacoes: number
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

// URL exata do seu backend
const API_BASE_URL = "https://meu-ze-da-fruta-backend-8c4976f28553.herokuapp.com"

function CompradorDashboard() {
  const { user, isAuthenticated } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [currentView, setCurrentView] = useState<'establishments' | 'establishment-products' | 'cart' | 'orders'>('establishments')
  
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
      console.log('👤 Usuário autenticado:', user)
      console.log('🔑 Token JWT:', authService.getToken() ? 'Presente' : 'Ausente')
      
      loadEstablishments()
      loadCart()
      loadCategories()
    }
  }, [mounted, isAuthenticated])

  // Função para obter headers com JWT token
  const getAuthHeaders = () => {
    const token = authService.getToken()
    console.log('🔑 Preparando headers com token:', token ? `${token.substring(0, 20)}...` : 'Sem token')
    
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  // Carregar estabelecimentos usando endpoint exato da documentação
  const loadEstablishments = async () => {
    setIsLoadingEstablishments(true)
    try {
      console.log('🏪 Carregando estabelecimentos do endpoint: /sales/public/establishments')
      
      const response = await fetch(`${API_BASE_URL}/sales/public/establishments`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      console.log('📡 Resposta do servidor:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Dados recebidos (estabelecimentos):', data)
          // Backend retorna { value: [...], Count: number }
        const establishments = data.value || []
        console.log('🏪 Estabelecimentos processados:', establishments.length)
        
        setEstablishments(establishments)
      } else {
        const errorText = await response.text()
        console.error('❌ Erro na resposta:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        })
      }
    } catch (error) {
      console.error('❌ Erro de rede ao carregar estabelecimentos:', error)
    } finally {
      setIsLoadingEstablishments(false)
    }
  }

  // Carregar produtos de um estabelecimento específico
  const loadProducts = async (estabelecimentoNome?: string) => {
    setIsLoadingProducts(true)
    try {
      let url = `${API_BASE_URL}/sales/public/products`
      
      // Se tem estabelecimento selecionado, filtrar por ele
      if (estabelecimentoNome) {
        url += `?estabelecimento=${encodeURIComponent(estabelecimentoNome)}`
      }
      
      console.log('🛍️ Carregando produtos do endpoint:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      console.log('📡 Resposta do servidor (produtos):', {
        status: response.status,
        statusText: response.statusText
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Dados recebidos (produtos):', data)
        
        // Conforme documentação, pode vir como data.produtos ou data direto
        const products = data.produtos || data || []
        console.log('🛍️ Produtos processados:', products.length)
        
        setProducts(products)
      } else {
        const errorText = await response.text()
        console.error('❌ Erro na resposta (produtos):', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        })
      }
    } catch (error) {
      console.error('❌ Erro de rede ao carregar produtos:', error)
    } finally {
      setIsLoadingProducts(false)
    }
  }

  // Carregar categorias
  const loadCategories = async () => {
    try {
      console.log('📂 Carregando categorias do endpoint: /sales/public/categories')
      
      const response = await fetch(`${API_BASE_URL}/sales/public/categories`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Categorias recebidas:', data)
          // Backend retorna { value: [...], Count: number }
        const categories = data.value || []
        setCategories(categories)
      } else {
        console.error('❌ Erro ao carregar categorias:', response.status)
      }
    } catch (error) {
      console.error('❌ Erro de rede ao carregar categorias:', error)
    }
  }

  // Carregar carrinho usando endpoint com autenticação
  const loadCart = async () => {
    setIsLoadingCart(true)
    try {
      console.log('🛒 Carregando carrinho do endpoint: /cart')
      
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })

      console.log('📡 Resposta do carrinho:', {
        status: response.status,
        statusText: response.statusText
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Carrinho recebido:', data)
        setCart(data)
      } else if (response.status === 404) {
        // Carrinho vazio é normal
        console.log('📝 Carrinho vazio (404 é normal)')
        setCart({
          itens: [],
          valorTotal: 0,
          quantidadeItens: 0,
          frete: 0,
          valorFinal: 0
        })
      } else {
        const errorText = await response.text()
        console.error('❌ Erro ao carregar carrinho:', {
          status: response.status,
          body: errorText
        })
      }
    } catch (error) {
      console.error('❌ Erro de rede ao carregar carrinho:', error)
    } finally {
      setIsLoadingCart(false)
    }
  }

  // Adicionar produto ao carrinho usando endpoint com autenticação
  const addToCart = async (product: Product) => {
    try {
      console.log('🛒 Adicionando produto ao carrinho:', product.nome)
      
      const response = await fetch(`${API_BASE_URL}/cart/items`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          produtoId: product.id,
          quantidade: 1
        })
      })

      console.log('📡 Resposta da adição ao carrinho:', {
        status: response.status,
        statusText: response.statusText
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Produto adicionado:', data)
        
        // Recarregar carrinho após adicionar
        await loadCart()
        
        // Feedback visual
        alert(`${product.nome} adicionado ao carrinho!`)
      } else {
        const errorText = await response.text()
        console.error('❌ Erro ao adicionar ao carrinho:', {
          status: response.status,
          body: errorText
        })
        alert('Erro ao adicionar produto ao carrinho')
      }
    } catch (error) {
      console.error('❌ Erro de rede ao adicionar ao carrinho:', error)
      alert('Erro de conexão ao adicionar produto')
    }
  }

  // Atualizar quantidade de item no carrinho
  const updateCartItem = async (produtoId: string, quantidade: number) => {
    try {
      console.log('🔄 Atualizando quantidade do produto:', produtoId, 'para:', quantidade)
      
      const response = await fetch(`${API_BASE_URL}/cart/items/${produtoId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          quantidade: quantidade
        })
      })

      if (response.ok) {
        console.log('✅ Quantidade atualizada')
        await loadCart() // Recarregar carrinho
      } else {
        console.error('❌ Erro ao atualizar quantidade:', response.status)
      }
    } catch (error) {
      console.error('❌ Erro de rede ao atualizar quantidade:', error)
    }
  }

  // Remover produto do carrinho
  const removeFromCart = async (produtoId: string) => {
    try {
      console.log('🗑️ Removendo produto do carrinho:', produtoId)
      
      const response = await fetch(`${API_BASE_URL}/cart/items/${produtoId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        console.log('✅ Produto removido do carrinho')
        await loadCart() // Recarregar carrinho
      } else {
        console.error('❌ Erro ao remover do carrinho:', response.status)
      }
    } catch (error) {
      console.error('❌ Erro de rede ao remover do carrinho:', error)
    }
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
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {currentView !== 'establishments' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={exitEstablishment}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </Button>
              )}
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentView === 'establishments' && 'Estabelecimentos'}
                  {currentView === 'establishment-products' && selectedEstablishment?.nome}
                  {currentView === 'cart' && 'Meu Carrinho'}
                  {currentView === 'orders' && 'Meus Pedidos'}
                </h1>
                <p className="text-sm text-gray-600">
                  Olá, {user?.name || 'usuário'}! Bem-vindo ao marketplace.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Contador do carrinho */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className="relative"
              >
                <ShoppingCart className="w-4 h-4" />
                {cart && cart.quantidadeItens > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 px-1 min-w-5 h-5">
                    {cart.quantidadeItens}
                  </Badge>
                )}
              </Button>

              {/* Debug info */}
              <div className="text-xs text-gray-500">
                Token: {authService.getToken() ? '✅' : '❌'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* View: Lista de Estabelecimentos */}
        {currentView === 'establishments' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Escolha um estabelecimento</h2>
              
              {isLoadingEstablishments ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                  <span className="ml-2">Carregando estabelecimentos...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {establishments.map(establishment => (
                    <Card 
                      key={establishment.id} 
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => enterEstablishment(establishment)}
                    >
                      <div className="aspect-video relative">
                        <Image
                          src={establishment.imagemUrl || '/placeholder.svg'}
                          alt={establishment.nome}
                          fill
                          className="object-cover rounded-t-lg"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg'
                          }}
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{establishment.nome}</h3>
                        <p className="text-gray-600 text-sm mb-3">{establishment.descricao}</p>
                          <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{establishment.endereco}</span>
                          </div>
                          
                          {establishment.telefone && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">📞</span>
                              <span>{establishment.telefone}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <Badge variant="default">
                              Disponível
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {!isLoadingEstablishments && establishments.length === 0 && (
                <div className="text-center py-12">
                  <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhum estabelecimento encontrado</p>
                  <Button 
                    variant="outline" 
                    onClick={loadEstablishments}
                    className="mt-4"
                  >
                    Tentar novamente
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* View: Produtos do Estabelecimento */}
        {currentView === 'establishment-products' && selectedEstablishment && (
          <div>
            {/* Cabeçalho do estabelecimento */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <div className="flex items-start gap-4">
                <Image
                  src={selectedEstablishment.imagemUrl || '/placeholder.svg'}
                  alt={selectedEstablishment.nome}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg'
                  }}
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{selectedEstablishment.nome}</h2>
                  <p className="text-gray-600 mb-3">{selectedEstablishment.descricao}</p>
                    <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{selectedEstablishment.endereco}</span>
                    </div>
                    
                    {selectedEstablishment.telefone && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">📞</span>
                        <span>{selectedEstablishment.telefone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Filtros de produtos */}
            <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar produtos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">Todas as categorias</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.nome.toLowerCase()}>
                      {category.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid de produtos */}
            {isLoadingProducts ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                <span className="ml-2">Carregando produtos...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <Card key={product.id} className="overflow-hidden">
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
                        <Badge variant="destructive" className="absolute top-2 left-2">
                          Promoção
                        </Badge>
                      )}
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{product.nome}</h3>
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
                          <span className="text-sm">{product.avaliacaoMedia}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3 text-sm">
                        <Badge variant="outline">{product.categoria}</Badge>
                        <span className="text-gray-500">
                          Estoque: {product.estoque}
                        </span>
                      </div>
                      
                      <Button
                        onClick={() => addToCart(product)}
                        disabled={!product.disponivel || product.estoque === 0}
                        className="w-full"
                        size="sm"
                      >
                        {product.disponivel && product.estoque > 0 ? (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar ao Carrinho
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
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum produto encontrado</p>
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

      {/* Modal do Carrinho */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Meu Carrinho
            </DialogTitle>
          </DialogHeader>
          
          {isLoadingCart ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Carregando carrinho...</span>
            </div>
          ) : cart && cart.itens.length > 0 ? (
            <div className="space-y-4">
              {cart.itens.map((item) => (
                <div key={item.produtoId} className="flex items-center gap-4 p-4 border rounded-lg">
                  <Image
                    src={item.imagemUrl || '/placeholder.svg'}
                    alt={item.nomeProduto}
                    width={60}
                    height={60}
                    className="rounded object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg'
                    }}
                  />
                  
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.nomeProduto}</h4>
                    <p className="text-gray-600">{formatPrice(item.preco)} cada</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateCartItem(item.produtoId, Math.max(1, item.quantidade - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    
                    <span className="w-8 text-center">{item.quantidade}</span>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateCartItem(item.produtoId, item.quantidade + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeFromCart(item.produtoId)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(item.subtotal)}</p>
                  </div>
                </div>
              ))}
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(cart.valorTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete:</span>
                  <span>{formatPrice(cart.frete)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{formatPrice(cart.valorFinal)}</span>
                </div>
              </div>
              
              <Button className="w-full" size="lg">
                Finalizar Pedido
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Seu carrinho está vazio</p>
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
