"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import AddressManager from "@/components/address-manager"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ShoppingCart,
  Plus,
  Minus,
  Search,
  Star,
  MapPin,
  Package,
  CreditCard,
  Filter,
  Clock,
  Leaf,
  Award,
  Trash2,
  X,
} from "lucide-react"
import Image from "next/image"
import type { Product, Address, Order } from "@/lib/api"

interface CartItem extends Product {
  quantity: number
}

const categories = [
  { id: "frutas", name: "Frutas", icon: "🍎" },
  { id: "verduras", name: "Verduras", icon: "🥬" },
  { id: "legumes", name: "Legumes", icon: "🥕" },
  { id: "organicos", name: "Orgânicos", icon: "🌱" },
  { id: "promocoes", name: "Promoções", icon: "🏷️" },
]

export default function CompradorDashboard() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("todos")
  const [sortBy, setSortBy] = useState<string>("relevancia")
  const [showAddressManager, setShowAddressManager] = useState(false)

  useEffect(() => {
    loadProducts()
    loadOrders()
  }, [])

  const loadProducts = async () => {
    setIsLoading(true)
    // Simulação com produtos de exemplo para demonstração
    const mockProducts: Product[] = [
      {
        id: 1,
        name: "Maçã Gala",
        price: 6.99,
        unit: "kg",
        image: "/placeholder.svg?height=300&width=400",
        rating: 4.8,
        vendor: "Hortifruti São João",
        category: "frutas",
        stock: 50,
        description: "Maçãs frescas e crocantes",
      },
      {
        id: 2,
        name: "Banana Prata",
        price: 4.5,
        unit: "kg",
        image: "/placeholder.svg?height=300&width=400",
        rating: 4.9,
        vendor: "Frutaria Central",
        category: "frutas",
        stock: 30,
      },
      {
        id: 3,
        name: "Alface Americana",
        price: 3.2,
        unit: "unidade",
        image: "/placeholder.svg?height=300&width=400",
        rating: 4.7,
        vendor: "Verduras & Cia",
        category: "verduras",
        stock: 25,
      },
      {
        id: 4,
        name: "Tomate Italiano",
        price: 8.9,
        unit: "kg",
        image: "/placeholder.svg?height=300&width=400",
        rating: 4.6,
        vendor: "Hortifruti São João",
        category: "legumes",
        stock: 40,
      },
      {
        id: 5,
        name: "Cenoura Orgânica",
        price: 7.5,
        unit: "kg",
        image: "/placeholder.svg?height=300&width=400",
        rating: 4.9,
        vendor: "Orgânicos da Terra",
        category: "organicos",
        stock: 15,
      },
      {
        id: 6,
        name: "Laranja Lima",
        price: 5.99,
        unit: "kg",
        image: "/placeholder.svg?height=300&width=400",
        rating: 4.5,
        vendor: "Frutaria Central",
        category: "frutas",
        stock: 60,
      },
      {
        id: 7,
        name: "Abacate",
        price: 9.9,
        unit: "kg",
        image: "/placeholder.svg?height=300&width=400",
        rating: 4.7,
        vendor: "Frutaria Central",
        category: "frutas",
        stock: 20,
      },
      {
        id: 8,
        name: "Brócolis",
        price: 4.5,
        unit: "unidade",
        image: "/placeholder.svg?height=300&width=400",
        rating: 4.6,
        vendor: "Verduras & Cia",
        category: "verduras",
        stock: 15,
      },
      {
        id: 9,
        name: "Morango Orgânico",
        price: 12.9,
        unit: "bandeja",
        image: "/placeholder.svg?height=300&width=400",
        rating: 4.9,
        vendor: "Orgânicos da Terra",
        category: "organicos",
        stock: 10,
      },
      {
        id: 10,
        name: "Batata Doce",
        price: 5.2,
        unit: "kg",
        image: "/placeholder.svg?height=300&width=400",
        rating: 4.4,
        vendor: "Hortifruti São João",
        category: "legumes",
        stock: 35,
      },
      {
        id: 11,
        name: "Manga Palmer",
        price: 7.8,
        unit: "kg",
        image: "/placeholder.svg?height=300&width=400",
        rating: 4.8,
        vendor: "Frutaria Central",
        category: "frutas",
        stock: 25,
      },
      {
        id: 12,
        name: "Couve Orgânica",
        price: 3.99,
        unit: "maço",
        image: "/placeholder.svg?height=300&width=400",
        rating: 4.7,
        vendor: "Orgânicos da Terra",
        category: "organicos",
        stock: 18,
      },
    ]

    const savedProducts = localStorage.getItem("marketplace_products")
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    } else {
      setProducts(mockProducts)
      localStorage.setItem("marketplace_products", JSON.stringify(mockProducts))
    }
    setIsLoading(false)
  }

  const loadOrders = async () => {
    const savedOrders = localStorage.getItem("user_orders")
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    }
  }

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: number) => {
    setCart((prev) => {
      return prev
        .map((item) => (item.id === productId ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item))
        .filter((item) => item.quantity > 0)
    })
  }

  const removeProductFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId))
  }

  const clearCart = () => {
    setCart([])
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const handleCheckout = async () => {
    if (!selectedAddress || cart.length === 0) return

    const newOrder: Order = {
      id: Date.now(),
      userId: 1,
      enderecoId: selectedAddress.id,
      itens: cart.map((item) => ({
        produtoId: item.id,
        quantidade: item.quantity,
        produto: item,
      })),
      total: getCartTotal(),
      status: "Preparando",
      createdAt: new Date().toISOString(),
    }

    const updatedOrders = [newOrder, ...orders]
    setOrders(updatedOrders)
    localStorage.setItem("user_orders", JSON.stringify(updatedOrders))

    setCart([])
    setIsCheckoutOpen(false)
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "todos" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "preco-menor":
        return a.price - b.price
      case "preco-maior":
        return b.price - a.price
      case "avaliacao":
        return b.rating - a.rating
      case "nome":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  return (
    <DashboardLayout title="Zé da Fruta" userType="comprador">
      <div className="min-h-screen bg-gray-50">
        {/* Header da Loja */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            {/* Endereço e Busca */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#FE9A04]" />
                <div>
                  {selectedAddress ? (
                    <div>
                      <p className="font-medium text-sm">Entregar em</p>
                      <button
                        onClick={() => setShowAddressManager(true)}
                        className="text-sm text-gray-600 hover:text-[#FE9A04] transition-colors"
                      >
                        {selectedAddress.rua}, {selectedAddress.numero} - {selectedAddress.cidade}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddressManager(true)}
                      className="text-sm text-[#FE9A04] font-medium hover:underline"
                    >
                      Adicionar endereço de entrega
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Buscar frutas, verduras..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 border-2 focus:border-[#FE9A04] rounded-full"
                  />
                </div>
              </div>

              {/* Carrinho */}
              {cart.length > 0 && (
                <Button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="bg-[#FE9A04] hover:bg-[#E8890B] h-12 px-6 rounded-full font-semibold relative"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Ver Carrinho
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">{getCartItemCount()}</Badge>
                </Button>
              )}
            </div>

            {/* Categorias */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button
                variant={selectedCategory === "todos" ? "default" : "outline"}
                onClick={() => setSelectedCategory("todos")}
                className={`rounded-full whitespace-nowrap ${
                  selectedCategory === "todos" ? "bg-[#FE9A04] hover:bg-[#E8890B]" : ""
                }`}
              >
                Todos
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`rounded-full whitespace-nowrap ${
                    selectedCategory === category.id ? "bg-[#FE9A04] hover:bg-[#E8890B]" : ""
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Banner Promocional */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-gradient-to-r from-green-500 to-[#FE9A04] rounded-2xl p-8 text-white mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">🍊 Frutas Frescas Todos os Dias!</h2>
                <p className="text-lg opacity-90">Entrega rápida • Produtos selecionados • Preços justos</p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Entrega em 30-45min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Leaf className="w-4 h-4" />
                    <span className="text-sm">100% Natural</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    <span className="text-sm">Qualidade Garantida</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros e Ordenação */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              {selectedCategory === "todos"
                ? "Todos os Produtos"
                : categories.find((c) => c.id === selectedCategory)?.name}
              <span className="text-sm font-normal text-gray-500 ml-2">({sortedProducts.length} produtos)</span>
            </h3>

            <div className="flex items-center gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevancia">Relevância</SelectItem>
                  <SelectItem value="preco-menor">Menor Preço</SelectItem>
                  <SelectItem value="preco-maior">Maior Preço</SelectItem>
                  <SelectItem value="avaliacao">Melhor Avaliação</SelectItem>
                  <SelectItem value="nome">Nome A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Grid de Produtos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-0">
                      <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                      <div className="p-4 space-y-3">
                        <div className="bg-gray-200 h-4 rounded"></div>
                        <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                        <div className="bg-gray-200 h-8 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              : sortedProducts.map((product) => {
                  const cartItem = cart.find((item) => item.id === product.id)
                  const quantity = cartItem?.quantity || 0

                  return (
                    <Card
                      key={product.id}
                      className="hover:shadow-xl transition-all duration-300 group border-0 shadow-md overflow-hidden"
                    >
                      <CardContent className="p-0">
                        <div className="relative">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={300}
                            height={200}
                            className="w-full h-48 object-cover"
                          />
                          {product.stock && product.stock < 10 && (
                            <Badge className="absolute top-3 right-3 bg-red-500 text-white">Últimas unidades</Badge>
                          )}
                          <div className="absolute top-3 left-3">
                            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-xs font-medium">{product.rating}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 space-y-3">
                          <div>
                            <h3 className="font-bold text-lg group-hover:text-[#FE9A04] transition-colors line-clamp-1">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-600">{product.vendor}</p>
                          </div>

                          <div className="flex items-end justify-between">
                            <div>
                              <p className="text-2xl font-bold text-[#FE9A04]">R$ {product.price.toFixed(2)}</p>
                              <p className="text-xs text-gray-500">por {product.unit}</p>
                            </div>
                            <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                              {categories.find((c) => c.id === product.category)?.icon}{" "}
                              {categories.find((c) => c.id === product.category)?.name}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2">
                            {quantity === 0 ? (
                              <Button
                                onClick={() => addToCart(product)}
                                className="flex-1 bg-[#FE9A04] hover:bg-[#E8890B] font-semibold rounded-full h-10"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Adicionar
                              </Button>
                            ) : (
                              <div className="flex items-center justify-between flex-1 bg-gray-50 rounded-full p-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFromCart(product.id)}
                                  className="h-8 w-8 rounded-full bg-white shadow-sm hover:bg-gray-100"
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="font-bold text-lg px-3">{quantity}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => addToCart(product)}
                                  className="h-8 w-8 rounded-full bg-white shadow-sm hover:bg-gray-100"
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
          </div>

          {sortedProducts.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum produto encontrado</h3>
              <p className="text-gray-500">Tente buscar por outros termos ou categorias</p>
            </div>
          )}
        </div>

        {/* Modal de Gerenciamento de Endereços */}
        <Dialog open={showAddressManager} onOpenChange={setShowAddressManager}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Gerenciar Endereços</DialogTitle>
            </DialogHeader>
            <AddressManager
              selectedAddress={selectedAddress}
              onAddressSelect={(address) => {
                setSelectedAddress(address)
                setShowAddressManager(false)
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Modal de Checkout */}
        <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-[#FE9A04]" />
                  Seu Carrinho ({getCartItemCount()} itens)
                </div>
                {cart.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Limpar
                  </Button>
                )}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedAddress && (
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#FE9A04] mt-1" />
                    <div>
                      <p className="font-medium text-sm">Entregar em:</p>
                      <p className="text-sm text-gray-700">
                        {selectedAddress.rua}, {selectedAddress.numero}
                      </p>
                      <p className="text-sm text-gray-700">
                        {selectedAddress.cidade}, {selectedAddress.estado}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="font-medium">Itens do Pedido:</h4>
                <div className="max-h-60 overflow-y-auto space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-600">{item.vendor}</p>
                        <p className="text-sm font-medium text-[#FE9A04]">
                          R$ {item.price.toFixed(2)} / {item.unit}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="h-8 w-8 rounded-full bg-white shadow-sm hover:bg-gray-100"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="font-bold text-sm px-2">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addToCart(item)}
                          className="h-8 w-8 rounded-full bg-white shadow-sm hover:bg-gray-100"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">R$ {(item.price * item.quantity).toFixed(2)}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProductFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>R$ {getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxa de entrega:</span>
                    <span className="text-green-600">Grátis</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span className="text-[#FE9A04]">R$ {getCartTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setIsCheckoutOpen(false)} className="flex-1">
                  Continuar Comprando
                </Button>
                <Button
                  onClick={handleCheckout}
                  className="flex-1 bg-[#FE9A04] hover:bg-[#E8890B]"
                  disabled={!selectedAddress}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Finalizar Pedido
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
