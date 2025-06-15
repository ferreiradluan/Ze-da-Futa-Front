"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Search, Plus, Edit, Trash2, Ticket, Calendar, Percent, DollarSign } from "lucide-react"
import type { Coupon, CreateCouponRequest } from "@/lib/admin-api"

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddingCoupon, setIsAddingCoupon] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [newCoupon, setNewCoupon] = useState<CreateCouponRequest>({
    code: "",
    description: "",
    discount: 0,
    discountType: "PERCENTAGE",
    minValue: undefined,
    maxUses: undefined,
    expiresAt: undefined,
  })

  useEffect(() => {
    loadCoupons()
  }, [])

  useEffect(() => {
    const filtered = coupons.filter(
      (coupon) =>
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredCoupons(filtered)
  }, [coupons, searchTerm])

  const loadCoupons = async () => {
    setIsLoading(true)
    // Em produção, usar a API real:
    // const result = await adminApiService.getCoupons()
    // if (result.data) {
    //   setCoupons(result.data)
    // }

    // Por enquanto, lista vazia até dados reais serem implementados
    setCoupons([])
    setIsLoading(false)
  }

  const handleAddCoupon = async () => {
    if (newCoupon.code && newCoupon.description && newCoupon.discount > 0) {
      // Em produção, usar a API real:
      // const result = await adminApiService.createCoupon(newCoupon)
      // if (result.data) {
      //   setCoupons(prev => [...prev, result.data])
      // }

      // Simulação temporária
      const mockCoupon: Coupon = {
        id: Date.now(),
        ...newCoupon,
        currentUses: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
      }

      setCoupons((prev) => [...prev, mockCoupon])
      setNewCoupon({
        code: "",
        description: "",
        discount: 0,
        discountType: "PERCENTAGE",
        minValue: undefined,
        maxUses: undefined,
        expiresAt: undefined,
      })
      setIsAddingCoupon(false)
    }
  }

  const deleteCoupon = async (couponId: number) => {
    // Em produção, usar a API real:
    // const result = await adminApiService.deleteCoupon(couponId)
    // if (result.data) {
    //   setCoupons(prev => prev.filter(c => c.id !== couponId))
    // }

    setCoupons((prev) => prev.filter((c) => c.id !== couponId))
  }

  const toggleCouponStatus = async (couponId: number, isActive: boolean) => {
    // Em produção, usar a API real:
    // const result = await adminApiService.updateCoupon(couponId, { ...coupon, isActive })
    // if (result.data) {
    //   setCoupons(prev => prev.map(c => c.id === couponId ? result.data : c))
    // }

    setCoupons((prev) => prev.map((c) => (c.id === couponId ? { ...c, isActive } : c)))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatDiscount = (discount: number, type: string) => {
    return type === "PERCENTAGE" ? `${discount}%` : `R$ ${discount.toFixed(2)}`
  }

  const stats = {
    total: coupons.length,
    active: coupons.filter((c) => c.isActive).length,
    expired: coupons.filter((c) => c.expiresAt && new Date(c.expiresAt) < new Date()).length,
    used: coupons.reduce((sum, c) => sum + c.currentUses, 0),
  }

  return (
    <AdminLayout title="Gerenciamento de Cupons" activeTab="coupons">
      <div className="space-y-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Cupons</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <Ticket className="w-8 h-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cupons Ativos</p>
                  <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                </div>
                <Percent className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cupons Expirados</p>
                  <p className="text-3xl font-bold text-red-600">{stats.expired}</p>
                </div>
                <Calendar className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Usos</p>
                  <p className="text-3xl font-bold text-[#FE9A04]">{stats.used}</p>
                </div>
                <DollarSign className="w-8 h-8 text-[#FE9A04]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Cupons */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lista de Cupons</CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar cupons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Dialog open={isAddingCoupon} onOpenChange={setIsAddingCoupon}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#FE9A04] hover:bg-[#E8890B]">
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Cupom
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Criar Novo Cupom</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="code">Código do Cupom</Label>
                        <Input
                          id="code"
                          value={newCoupon.code}
                          onChange={(e) => setNewCoupon((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                          placeholder="Ex: DESCONTO10"
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                          id="description"
                          value={newCoupon.description}
                          onChange={(e) => setNewCoupon((prev) => ({ ...prev, description: e.target.value }))}
                          placeholder="Descrição do cupom..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="discountType">Tipo de Desconto</Label>
                          <Select
                            value={newCoupon.discountType}
                            onValueChange={(value: "PERCENTAGE" | "FIXED") =>
                              setNewCoupon((prev) => ({ ...prev, discountType: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PERCENTAGE">Porcentagem</SelectItem>
                              <SelectItem value="FIXED">Valor Fixo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="discount">
                            Desconto {newCoupon.discountType === "PERCENTAGE" ? "(%)" : "(R$)"}
                          </Label>
                          <Input
                            id="discount"
                            type="number"
                            value={newCoupon.discount}
                            onChange={(e) =>
                              setNewCoupon((prev) => ({ ...prev, discount: Number.parseFloat(e.target.value) || 0 }))
                            }
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="minValue">Valor Mínimo (R$)</Label>
                          <Input
                            id="minValue"
                            type="number"
                            value={newCoupon.minValue || ""}
                            onChange={(e) =>
                              setNewCoupon((prev) => ({
                                ...prev,
                                minValue: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                              }))
                            }
                            placeholder="Opcional"
                          />
                        </div>

                        <div>
                          <Label htmlFor="maxUses">Máximo de Usos</Label>
                          <Input
                            id="maxUses"
                            type="number"
                            value={newCoupon.maxUses || ""}
                            onChange={(e) =>
                              setNewCoupon((prev) => ({
                                ...prev,
                                maxUses: e.target.value ? Number.parseInt(e.target.value) : undefined,
                              }))
                            }
                            placeholder="Opcional"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="expiresAt">Data de Expiração</Label>
                        <Input
                          id="expiresAt"
                          type="date"
                          value={newCoupon.expiresAt ? newCoupon.expiresAt.split("T")[0] : ""}
                          onChange={(e) =>
                            setNewCoupon((prev) => ({
                              ...prev,
                              expiresAt: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                            }))
                          }
                        />
                      </div>

                      <Button onClick={handleAddCoupon} className="w-full bg-[#FE9A04] hover:bg-[#E8890B]">
                        Criar Cupom
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse border rounded-lg p-4">
                    <div className="flex justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="bg-gray-200 h-4 rounded w-1/4"></div>
                        <div className="bg-gray-200 h-3 rounded w-1/2"></div>
                      </div>
                      <div className="bg-gray-200 h-6 w-20 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCoupons.length === 0 ? (
              <div className="text-center py-12">
                <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {coupons.length === 0 ? "Nenhum cupom criado ainda" : "Nenhum cupom encontrado"}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  {coupons.length === 0 ? "Crie seu primeiro cupom para começar" : "Tente ajustar sua busca"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCoupons.map((coupon) => (
                  <div key={coupon.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg font-mono">{coupon.code}</h3>
                          <Badge className={coupon.isActive ? "bg-green-500" : "bg-gray-500"}>
                            {coupon.isActive ? "Ativo" : "Inativo"}
                          </Badge>
                          {coupon.expiresAt && new Date(coupon.expiresAt) < new Date() && (
                            <Badge className="bg-red-500">Expirado</Badge>
                          )}
                        </div>

                        <p className="text-gray-600 mb-2">{coupon.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Desconto:</span>
                            <p className="text-[#FE9A04] font-bold">
                              {formatDiscount(coupon.discount, coupon.discountType)}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium">Usos:</span>
                            <p>
                              {coupon.currentUses}
                              {coupon.maxUses && ` / ${coupon.maxUses}`}
                            </p>
                          </div>
                          {coupon.minValue && (
                            <div>
                              <span className="font-medium">Valor mín:</span>
                              <p>R$ {coupon.minValue.toFixed(2)}</p>
                            </div>
                          )}
                          {coupon.expiresAt && (
                            <div>
                              <span className="font-medium">Expira em:</span>
                              <p>{formatDate(coupon.expiresAt)}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={coupon.isActive}
                            onCheckedChange={(checked) => toggleCouponStatus(coupon.id, checked)}
                          />
                          <span className="text-sm text-gray-600">Ativo</span>
                        </div>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteCoupon(coupon.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
