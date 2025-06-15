"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Package, TrendingUp, Edit, Trash2, DollarSign, Star } from "lucide-react"
import Image from "next/image"

interface Product {
  id: number
  name: string
  price: number
  unit: string
  stock: number
  image: string
  category: string
  description: string
  vendor: string
  rating: number
}

export default function VendedorDashboard() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    // Carregar produtos do localStorage
    const savedProducts = localStorage.getItem("marketplace_products")
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    } else {
      // Produtos iniciais apenas se não houver nada salvo
      const initialProducts = [
        {
          id: 1,
          name: "Manga Tommy",
          price: 8.9,
          unit: "kg",
          stock: 50,
          image: "/placeholder.svg?height=200&width=200&text=Manga",
          category: "Frutas",
          description: "Mangas doces e suculentas, colhidas no ponto ideal",
          vendor: "Frutas do João",
          rating: 4.8,
        },
        {
          id: 2,
          name: "Tomate Cereja",
          price: 12.5,
          unit: "kg",
          stock: 25,
          image: "/placeholder.svg?height=200&width=200&text=Tomate",
          category: "Verduras",
          description: "Tomates cereja frescos, ideais para saladas",
          vendor: "Frutas do João",
          rating: 4.6,
        },
      ]
      setProducts(initialProducts)
      localStorage.setItem("marketplace_products", JSON.stringify(initialProducts))
    }
  }, [])

  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("marketplace_products", JSON.stringify(products))
    }
  }, [products])

  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    unit: "kg",
    stock: "",
    category: "",
    description: "",
    imageUrl: "", // Adicione esta linha
  })

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.stock) {
      const product: Product = {
        id: Date.now(),
        name: newProduct.name,
        price: Number.parseFloat(newProduct.price),
        unit: newProduct.unit,
        stock: Number.parseInt(newProduct.stock),
        image: newProduct.imageUrl || "/placeholder.svg?height=200&width=200&text=" + newProduct.name,
        category: newProduct.category,
        description: newProduct.description,
        vendor: "Frutas do João", // Nome do vendedor logado
        rating: 4.5, // Rating inicial
      }

      setProducts((prev) => [...prev, product])
      setNewProduct({
        name: "",
        price: "",
        unit: "kg",
        stock: "",
        category: "",
        description: "",
        imageUrl: "",
      })
      setIsAddingProduct(false)
    }
  }

  const deleteProduct = (id: number) => {
    const updatedProducts = products.filter((p) => p.id !== id)
    setProducts(updatedProducts)
    localStorage.setItem("marketplace_products", JSON.stringify(updatedProducts))
  }

  const totalProducts = products.length
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0)

  return (
    <DashboardLayout title="Dashboard do Vendedor" userType="vendedor">
      <div className="space-y-6">
        {/* Estatísticas estilo iFood */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-medium mb-4">Resumo do dia</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-[#FE9A04]">
              <p className="text-sm text-gray-600">Produtos</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-2xl font-bold text-gray-800">{totalProducts}</p>
                <Package className="w-6 h-6 text-[#FE9A04]" />
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
              <p className="text-sm text-gray-600">Estoque</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-2xl font-bold text-gray-800">{totalStock}</p>
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
              <p className="text-sm text-gray-600">Vendas (R$)</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-2xl font-bold text-gray-800">{totalValue.toFixed(2)}</p>
                <DollarSign className="w-6 h-6 text-blue-500" />
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
              <p className="text-sm text-gray-600">Avaliação</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-2xl font-bold text-gray-800">4.8</p>
                <Star className="w-6 h-6 text-purple-500 fill-current" />
              </div>
            </div>
          </div>
        </div>

        {/* Produtos */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Meus Produtos</CardTitle>
              <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
                <DialogTrigger asChild>
                  <Button className="bg-[#FE9A04] hover:bg-[#E8890B]">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Produto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Novo Produto</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome do Produto</Label>
                      <Input
                        id="name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex: Manga Tommy"
                      />
                    </div>

                    <div>
                      <Label htmlFor="image">Imagem do Produto</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="imageUrl"
                          value={newProduct.imageUrl}
                          onChange={(e) => setNewProduct((prev) => ({ ...prev, imageUrl: e.target.value }))}
                          placeholder="URL da imagem ou deixe em branco para imagem padrão"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-shrink-0"
                          onClick={() => {
                            // Aqui poderia abrir um seletor de arquivos em uma implementação real
                            alert("Em uma implementação completa, isso abriria um seletor de arquivos")
                          }}
                        >
                          Procurar
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Formatos aceitos: JPG, PNG. Tamanho máximo: 5MB</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Preço</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct((prev) => ({ ...prev, price: e.target.value }))}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="unit">Unidade</Label>
                        <select
                          id="unit"
                          value={newProduct.unit}
                          onChange={(e) => setNewProduct((prev) => ({ ...prev, unit: e.target.value }))}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="kg">kg</option>
                          <option value="unidade">unidade</option>
                          <option value="maço">maço</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="stock">Estoque</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct((prev) => ({ ...prev, stock: e.target.value }))}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Categoria</Label>
                        <Input
                          id="category"
                          value={newProduct.category}
                          onChange={(e) => setNewProduct((prev) => ({ ...prev, category: e.target.value }))}
                          placeholder="Ex: Frutas"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Descreva seu produto..."
                      />
                    </div>

                    <Button onClick={handleAddProduct} className="w-full bg-[#FE9A04] hover:bg-[#E8890B]">
                      Adicionar Produto
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={200}
                        height={200}
                        className="w-full h-40 object-cover rounded-lg"
                      />

                      <div>
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.description}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xl font-bold text-[#FE9A04]">R$ {product.price.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">por {product.unit}</p>
                        </div>
                        <Badge variant="secondary">{product.category}</Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Estoque</p>
                          <p className="font-semibold">
                            {product.stock} {product.unit}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => deleteProduct(product.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vendas Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Vendas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: "#001",
                  product: "Manga Tommy",
                  quantity: "2 kg",
                  value: 17.8,
                  buyer: "João Silva",
                  status: "Entregue",
                },
                {
                  id: "#002",
                  product: "Tomate Cereja",
                  quantity: "1 kg",
                  value: 12.5,
                  buyer: "Maria Santos",
                  status: "Preparando",
                },
                {
                  id: "#003",
                  product: "Manga Tommy",
                  quantity: "3 kg",
                  value: 26.7,
                  buyer: "Pedro Costa",
                  status: "A caminho",
                },
              ].map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold">{sale.product}</p>
                    <p className="text-sm text-gray-600">
                      {sale.quantity} - {sale.buyer}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">R$ {sale.value.toFixed(2)}</p>
                    <Badge
                      variant={sale.status === "Entregue" ? "default" : "secondary"}
                      className={sale.status === "Entregue" ? "bg-green-500" : ""}
                    >
                      {sale.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
