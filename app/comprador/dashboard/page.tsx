"use client"

import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/protected-route"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ShoppingCart,
  MapPin,
  Package,
  User,
  Search,
  Plus,
  Minus,
  Star,
  Clock,
  CheckCircle,
  Truck,
  Heart,
  Filter,
  Eye,
  X,
  Trash2,
} from "lucide-react"
import Image from "next/image"
import { authService } from "@/lib/auth-service"

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

interface Order {
  id: string
  numeroControle: string
  status: string
  valorTotal: number
  dataCreated: string
  dataEntrega?: string
  enderecoEntrega: string
  observacoes?: string
  itens: Array<{
    produtoId: string
    nomeProduto: string
    quantidade: number
    precoUnitario: number
    subtotal: number
  }>
}

interface Category {
  id: string
  nome: string
  descricao: string
  imagemUrl: string
  totalProdutos: number
  ativa: boolean
}

interface UserProfile {
  id: string
  nome: string
  email: string
  telefone?: string
  status: string
  fotoPerfil?: string
  endereco?: {
    logradouro: string
    numero: string
    complemento?: string
    bairro: string
    cidade: string
    estado: string
    cep: string
  }
  preferencias?: {
    notificacoes: boolean
    newsletter: boolean
    temaDark: boolean
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://meu-ze-da-fruta-backend-8c4976f28553.herokuapp.com"

function CompradorDashboard() {
  const { user, userType } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("produtos")
  
  // Estados para produtos
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  
  // Estados para carrinho
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoadingCart, setIsLoadingCart] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  
  // Estados para pedidos
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  
  // Estados para perfil
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      loadInitialData()
    }
  }, [mounted])

  const getAuthHeaders = () => {
    const token = authService.getToken()
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  const loadInitialData = async () => {
    await Promise.all([
      loadProducts(),
      loadCategories(),
      loadCart(),
      loadOrders(),
      loadProfile()
    ])
  }

  const loadProducts = async () => {
    setIsLoadingProducts(true)
    try {
      const response = await fetch(`${API_BASE_URL}/sales/public/products`, {
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

  const loadOrders = async () => {
    setIsLoadingOrders(true)
    try {
      const response = await fetch(`${API_BASE_URL}/pedidos`, {
        headers: getAuthHeaders(),
      })
      if (response.ok) {
        const data = await response.json()
        setOrders(data.pedidos || [])
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error)
    } finally {
      setIsLoadingOrders(false)
    }
  }

  const loadProfile = async () => {
    setIsLoadingProfile(true)
    try {
      const response = await fetch(`${API_BASE_URL}/profile/me`, {
        headers: getAuthHeaders(),
      })
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
    } finally {
      setIsLoadingProfile(false)
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
      console.error('Erro ao atualizar item do carrinho:', error)
    }
  }

  const removeFromCart = async (produtoId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/items/${produtoId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })
      
      if (response.ok) {
        await loadCart()
      }
    } catch (error) {
      console.error('Erro ao remover do carrinho:', error)
    }
  }

  const clearCart = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })
      
      if (response.ok) {
        await loadCart()
      }
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error)
    }
  }

  const checkout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/checkout`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          enderecoEntrega: profile?.endereco ? 
            `${profile.endereco.logradouro}, ${profile.endereco.numero}` : 
            "Endereço não informado",
          observacoes: "Pedido realizado via dashboard",
          formaPagamento: "PIX"
        })
      })
      
      if (response.ok) {
        setIsCheckoutOpen(false)
        await loadCart()
        await loadOrders()
      }
    } catch (error) {
      console.error('Erro no checkout:', error)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.categoria === selectedCategory
    return matchesSearch && matchesCategory && product.disponivel
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'entregue': return 'bg-green-500'
      case 'em_preparacao': return 'bg-yellow-500'
      case 'enviado': return 'bg-blue-500'
      case 'cancelado': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString))
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
              <div className="bg-orange-500 p-2 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Zé da Fruta</h1>
                <p className="text-sm text-gray-600">Dashboard do Comprador</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Carrinho */}
              <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="relative">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Carrinho
                    {cart && cart.quantidadeItens > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-orange-500">
                        {cart.quantidadeItens}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Meu Carrinho</DialogTitle>
                  </DialogHeader>
                  {isLoadingCart ? (
                    <div className="text-center py-8">Carregando carrinho...</div>
                  ) : cart && cart.itens.length > 0 ? (
                    <div className="space-y-4">
                      {cart.itens.map((item) => (
                        <div key={item.produtoId} className="flex items-center gap-4 p-4 border rounded-lg">
                          <Image
                            src={item.imagemUrl || "/placeholder.svg"}
                            alt={item.nomeProduto}
                            width={80}
                            height={80}
                            className="rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.nomeProduto}</h4>
                            <p className="text-sm text-gray-600">{formatPrice(item.preco)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateCartItem(item.produtoId, Math.max(0, item.quantidade - 1))}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantidade}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateCartItem(item.produtoId, item.quantidade + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFromCart(item.produtoId)}
                            >
                              <Trash2 className="w-3 h-3 text-red-500" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatPrice(item.subtotal)}</p>
                          </div>
                        </div>
                      ))}
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span>Subtotal:</span>
                          <span>{formatPrice(cart.valorTotal)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span>Frete:</span>
                          <span>{formatPrice(cart.frete)}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-bold">
                          <span>Total:</span>
                          <span>{formatPrice(cart.valorFinal)}</span>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" onClick={clearCart} className="flex-1">
                            Limpar Carrinho
                          </Button>
                          <Button onClick={checkout} className="flex-1 bg-orange-500 hover:bg-orange-600">
                            Finalizar Pedido
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">Seu carrinho está vazio</p>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              {/* Perfil do usuário */}
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">Olá, {profile?.nome || user?.name || 'Usuário'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="produtos">Produtos</TabsTrigger>
            <TabsTrigger value="pedidos">Meus Pedidos</TabsTrigger>
            <TabsTrigger value="perfil">Meu Perfil</TabsTrigger>
            <TabsTrigger value="favoritos">Favoritos</TabsTrigger>
          </TabsList>

          {/* Tab Produtos */}
          <TabsContent value="produtos" className="space-y-6">
            {/* Filtros */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                      <Input
                        placeholder="Buscar produtos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as categorias</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.nome}>
                          {category.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Produtos */}
            {isLoadingProducts ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p>Carregando produtos...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <Image
                        src={product.imagemUrl || "/placeholder.svg"}
                        alt={product.nome}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      {product.precoPromocional && (
                        <Badge className="absolute top-2 left-2 bg-red-500">
                          Promoção
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{product.nome}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{product.descricao}</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{product.avaliacaoMedia}</span>
                          <span className="text-xs text-gray-500">({product.totalAvaliacoes})</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            {product.precoPromocional ? (
                              <div>
                                <span className="text-lg font-bold text-red-500">
                                  {formatPrice(product.precoPromocional)}
                                </span>
                                <span className="text-sm text-gray-500 line-through ml-2">
                                  {formatPrice(product.preco)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-lg font-bold">{formatPrice(product.preco)}</span>
                            )}
                            <p className="text-xs text-gray-500">por {product.unidade}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {product.estabelecimento}
                          </Badge>
                        </div>
                        <Button
                          className="w-full bg-orange-500 hover:bg-orange-600"
                          onClick={() => addToCart(product)}
                          disabled={!product.disponivel || product.estoque === 0}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab Pedidos */}
          <TabsContent value="pedidos" className="space-y-6">
            {isLoadingOrders ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p>Carregando pedidos...</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Pedido #{order.numeroControle}</CardTitle>
                          <p className="text-sm text-gray-600">
                            Realizado em {formatDate(order.dataCreated)}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <p className="text-lg font-bold mt-1">{formatPrice(order.valorTotal)}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Endereço de entrega:</p>
                            <p className="text-sm text-gray-600">{order.enderecoEntrega}</p>
                          </div>
                          {order.observacoes && (
                            <div>
                              <p className="text-sm font-medium text-gray-700">Observações:</p>
                              <p className="text-sm text-gray-600">{order.observacoes}</p>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Itens do pedido:</p>
                          <div className="space-y-1">
                            {order.itens.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{item.quantidade}x {item.nomeProduto}</span>
                                <span>{formatPrice(item.subtotal)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        {order.dataEntrega && (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm">Entregue em {formatDate(order.dataEntrega)}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Você ainda não fez nenhum pedido</p>
                  <Button 
                    className="mt-4 bg-orange-500 hover:bg-orange-600"
                    onClick={() => setActiveTab("produtos")}
                  >
                    Ver Produtos
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab Perfil */}
          <TabsContent value="perfil" className="space-y-6">
            {isLoadingProfile ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p>Carregando perfil...</p>
              </div>
            ) : profile ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Pessoais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nome</label>
                      <p className="text-sm">{profile.nome}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm">{profile.email}</p>
                    </div>
                    {profile.telefone && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Telefone</label>
                        <p className="text-sm">{profile.telefone}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <Badge className="ml-2">{profile.status}</Badge>
                    </div>
                  </CardContent>
                </Card>

                {profile.endereco && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Endereço</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm">
                        {profile.endereco.logradouro}, {profile.endereco.numero}
                      </p>
                      {profile.endereco.complemento && (
                        <p className="text-sm">{profile.endereco.complemento}</p>
                      )}
                      <p className="text-sm">
                        {profile.endereco.bairro}, {profile.endereco.cidade} - {profile.endereco.estado}
                      </p>
                      <p className="text-sm">CEP: {profile.endereco.cep}</p>
                    </CardContent>
                  </Card>
                )}

                {profile.preferencias && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Preferências</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Notificações</span>
                        <Badge variant={profile.preferencias.notificacoes ? "default" : "secondary"}>
                          {profile.preferencias.notificacoes ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Newsletter</span>
                        <Badge variant={profile.preferencias.newsletter ? "default" : "secondary"}>
                          {profile.preferencias.newsletter ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Tema Escuro</span>
                        <Badge variant={profile.preferencias.temaDark ? "default" : "secondary"}>
                          {profile.preferencias.temaDark ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <User className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Erro ao carregar perfil</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab Favoritos */}
          <TabsContent value="favoritos" className="space-y-6">
            <Card>
              <CardContent className="text-center py-12">
                <Heart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Funcionalidade de favoritos em desenvolvimento</p>
                <p className="text-sm text-gray-500 mt-2">
                  Em breve você poderá salvar seus produtos favoritos                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>    </div>
  )
}

export default function CompradorDashboardPage() {
  return (
    <ProtectedRoute requiredUserType="comprador">
      <CompradorDashboard />
    </ProtectedRoute>
  )
}
