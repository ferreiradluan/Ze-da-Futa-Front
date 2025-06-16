"use client"

import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/protected-route"
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
} from "lucide-react"
import Image from "next/image"

// Interfaces para a API
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

interface Establishment {
  id: string
  nome: string
  descricao: string
  endereco: {
    logradouro: string
    numero: string
    bairro: string
    cidade: string
    cep: string
  }
  telefone?: string
  email?: string
  imagemUrl: string
  horarioFuncionamento: Record<string, string>
  avaliacaoMedia: number
  totalAvaliacoes: number
  totalProdutos: number
  ativo: boolean
  tempoEntregaEstimado: string
  taxaEntrega: number
}

interface Category {
  id: string
  nome: string
  descricao: string
  imagemUrl: string
  totalProdutos: number
  ativa: boolean
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://meu-ze-da-fruta-backend-8c4976f28553.herokuapp.com"

function CompradorDashboard() {
  const { user } = useAuth()
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
    if (mounted) {
      loadEstablishments()
      loadCart()
    }
  }, [mounted])

  const getAuthHeaders = () => {
    const token = authService.getToken()
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  const loadEstablishments = async () => {
    setIsLoadingEstablishments(true)
    try {
      const response = await fetch(`${API_BASE_URL}/sales/public/establishments`, {
        headers: getAuthHeaders(),
      })
      if (response.ok) {
        const data = await response.json()
        setEstablishments(data.estabelecimentos || [])
      }
    } catch (error) {
      console.error('Erro ao carregar estabelecimentos:', error)
    } finally {
      setIsLoadingEstablishments(false)
    }
  }

  const loadProducts = async (estabelecimento?: string) => {
    setIsLoadingProducts(true)
    try {
      let url = `${API_BASE_URL}/sales/public/products`
      if (estabelecimento) {
        url += `?estabelecimento=${encodeURIComponent(estabelecimento)}`
      }
      
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      })
      if (response.ok) {
        const data = await response.json()
        setProducts(data.produtos || [])
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
    } finally {
      setIsLoadingProducts(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sales/public/categories`, {
        headers: getAuthHeaders(),
      })
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categorias || [])
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  const loadCart = async () => {
    setIsLoadingCart(true)
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: getAuthHeaders(),
      })
      if (response.ok) {
        const data = await response.json()
        setCart(data)
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error)
    } finally {
      setIsLoadingCart(false)
    }
  }

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
        await loadCart() // Recarregar carrinho
      }
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error)
    }
  }

  const updateCartItem = async (produtoId: string, quantidade: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/items/${produtoId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ quantidade })
      })
      
      if (response.ok) {
        await loadCart()
      }
    } catch (error) {
      console.error('Erro ao atualizar carrinho:', error)
    }
  }

  const removeFromCart = async (produtoId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/items/${produtoId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      
      if (response.ok) {
        await loadCart()
      }
    } catch (error) {
      console.error('Erro ao remover do carrinho:', error)
    }
  }

  const enterEstablishment = (establishment: Establishment) => {
    setSelectedEstablishment(establishment)
    setCurrentView('establishment-products')
    loadProducts(establishment.nome)
    loadCategories()
  }

  const exitEstablishment = () => {
    setSelectedEstablishment(null)
    setCurrentView('establishments')
    setProducts([])
    setCategories([])
    setSearchTerm("")
    setSelectedCategory("all")
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.categoria === selectedCategory
    return matchesSearch && matchesCategory && product.disponivel
  })

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">🔄 Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentView !== 'establishments' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={exitEstablishment}
                  className="mr-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <div className="bg-orange-500 p-2 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Zé da Fruta</h1>
                <p className="text-sm text-gray-600">
                  {currentView === 'establishments' ? 'Escolha um estabelecimento' : 
                   currentView === 'establishment-products' ? selectedEstablishment?.nome : 'Carrinho'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className="relative"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Carrinho
                {cart && cart.quantidadeItens > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-orange-500">
                    {cart.quantidadeItens}
                  </Badge>
                )}
              </Button>
              
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">Olá, {user?.name || 'Usuário'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {currentView === 'establishments' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Estabelecimentos Próximos
              </h2>
              <p className="text-gray-600">
                Escolha um estabelecimento para ver os produtos disponíveis
              </p>
            </div>

            {isLoadingEstablishments ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {establishments.map((establishment) => (
                  <Card key={establishment.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative h-48">
                      <Image
                        src={establishment.imagemUrl || "/placeholder.svg?height=200&width=400"}
                        alt={establishment.nome}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-white/90">
                          <Clock className="w-3 h-3 mr-1" />
                          {establishment.tempoEntregaEstimado}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg">{establishment.nome}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{establishment.avaliacaoMedia}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {establishment.descricao}
                      </p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {establishment.endereco.bairro}, {establishment.endereco.cidade}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{establishment.totalProdutos} produtos</span>
                          <span>Taxa: {formatPrice(establishment.taxaEntrega)}</span>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full mt-3 bg-orange-500 hover:bg-orange-600"
                        onClick={() => enterEstablishment(establishment)}
                      >
                        <Store className="w-4 h-4 mr-2" />
                        Entrar na loja
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {currentView === 'establishment-products' && selectedEstablishment && (
          <div>
            {/* Establishment Header */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Store className="w-8 h-8 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedEstablishment.nome}</h2>
                  <p className="text-gray-600">{selectedEstablishment.descricao}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{selectedEstablishment.avaliacaoMedia} ({selectedEstablishment.totalAvaliacoes} avaliações)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{selectedEstablishment.tempoEntregaEstimado}</span>
                    </div>
                    <div>Taxa de entrega: {formatPrice(selectedEstablishment.taxaEntrega)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Categories */}
            <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-4">
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
                
                <div className="flex gap-2 overflow-x-auto">
                  <Button
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("all")}
                    className="whitespace-nowrap"
                  >
                    Todos
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.nome ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.nome)}
                      className="whitespace-nowrap"
                    >
                      {category.nome}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {isLoadingProducts ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => {
                  const cartItem = cart?.itens.find(item => item.produtoId === product.id)
                  const isInCart = !!cartItem
                  
                  return (
                    <Card key={product.id} className="hover:shadow-lg transition-shadow">
                      <div className="relative h-48">
                        <Image
                          src={product.imagemUrl || "/placeholder.svg?height=200&width=200"}
                          alt={product.nome}
                          fill
                          className="object-cover"
                        />
                        {product.precoPromocional && (
                          <Badge className="absolute top-2 left-2 bg-red-500">
                            Oferta
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <CardContent className="p-4">
                        <h3 className="font-medium text-gray-900 mb-1">{product.nome}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.descricao}</p>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600">{product.avaliacaoMedia}</span>
                          </div>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-600">{product.estoque} {product.unidade} disponível</span>
                        </div>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            {product.precoPromocional ? (
                              <div>
                                <span className="text-sm text-gray-500 line-through">
                                  {formatPrice(product.preco)}
                                </span>
                                <span className="text-lg font-bold text-red-600 ml-2">
                                  {formatPrice(product.precoPromocional)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-lg font-bold text-gray-900">
                                {formatPrice(product.preco)}
                              </span>
                            )}
                            <span className="text-sm text-gray-500 ml-1">/{product.unidade}</span>
                          </div>
                        </div>
                        
                        {isInCart ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateCartItem(product.id, cartItem!.quantidade - 1)}
                                disabled={cartItem!.quantidade <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-8 text-center">{cartItem!.quantidade}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateCartItem(product.id, cartItem!.quantidade + 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeFromCart(product.id)}
                            >
                              Remover
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            className="w-full bg-orange-500 hover:bg-orange-600"
                            onClick={() => addToCart(product)}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            {filteredProducts.length === 0 && !isLoadingProducts && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
                <p className="text-gray-600">Tente ajustar os filtros de busca</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cart Dialog */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Seu Carrinho</DialogTitle>
          </DialogHeader>
          
          {cart && cart.itens.length > 0 ? (
            <div className="space-y-4">
              {cart.itens.map((item) => (
                <div key={item.produtoId} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Image
                    src={item.imagemUrl || "/placeholder.svg?height=60&width=60"}
                    alt={item.nomeProduto}
                    width={60}
                    height={60}
                    className="rounded object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.nomeProduto}</h4>
                    <p className="text-sm text-gray-600">{formatPrice(item.preco)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateCartItem(item.produtoId, item.quantidade - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantidade}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateCartItem(item.produtoId, item.quantidade + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.produtoId)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              
              <div className="border-t pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Subtotal:</span>
                  <span>{formatPrice(cart.valorTotal)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Frete:</span>
                  <span>{formatPrice(cart.frete)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{formatPrice(cart.valorFinal)}</span>
                </div>
                
                <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Finalizar Pedido
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Carrinho vazio</h3>
              <p className="text-gray-600">Adicione produtos para começar</p>
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
      <CompradorDashboard />
    </ProtectedRoute>
  )
}
