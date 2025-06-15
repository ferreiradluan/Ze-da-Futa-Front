"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MapPin, Plus, Edit, Trash2 } from "lucide-react"
import type { Address, CreateAddressRequest } from "@/lib/api"

interface AddressManagerProps {
  selectedAddress: Address | null
  onAddressSelect: (address: Address) => void
}

export default function AddressManager({ selectedAddress, onAddressSelect }: AddressManagerProps) {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [newAddress, setNewAddress] = useState<CreateAddressRequest>({
    rua: "",
    numero: "",
    cidade: "",
    estado: "",
    cep: "",
  })

  useEffect(() => {
    // Carregar endereços salvos do localStorage (simulando API)
    const savedAddresses = localStorage.getItem("user_addresses")
    if (savedAddresses) {
      const parsedAddresses = JSON.parse(savedAddresses)
      setAddresses(parsedAddresses)
      if (!selectedAddress && parsedAddresses.length > 0) {
        onAddressSelect(parsedAddresses[0])
      }
    }
  }, [selectedAddress, onAddressSelect])

  const handleAddAddress = async () => {
    if (newAddress.rua && newAddress.numero && newAddress.cidade && newAddress.estado && newAddress.cep) {
      // Simular criação via API
      const mockAddress: Address = {
        id: Date.now(),
        ...newAddress,
      }

      const updatedAddresses = [...addresses, mockAddress]
      setAddresses(updatedAddresses)
      localStorage.setItem("user_addresses", JSON.stringify(updatedAddresses))

      if (!selectedAddress) {
        onAddressSelect(mockAddress)
      }

      setNewAddress({
        rua: "",
        numero: "",
        cidade: "",
        estado: "",
        cep: "",
      })
      setIsAddingAddress(false)

      // Em produção, usar a API real:
      // const result = await apiService.createAddress(newAddress)
      // if (result.data) {
      //   setAddresses(prev => [...prev, result.data])
      // }
    }
  }

  const deleteAddress = (id: number) => {
    const updatedAddresses = addresses.filter((addr) => addr.id !== id)
    setAddresses(updatedAddresses)
    localStorage.setItem("user_addresses", JSON.stringify(updatedAddresses))

    if (selectedAddress?.id === id && updatedAddresses.length > 0) {
      onAddressSelect(updatedAddresses[0])
    } else if (updatedAddresses.length === 0) {
      onAddressSelect(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#FE9A04]" />
            Endereços de Entrega
          </CardTitle>
          <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Endereço</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="rua">Rua</Label>
                    <Input
                      id="rua"
                      value={newAddress.rua}
                      onChange={(e) => setNewAddress((prev) => ({ ...prev, rua: e.target.value }))}
                      placeholder="Nome da rua"
                    />
                  </div>
                  <div>
                    <Label htmlFor="numero">Número</Label>
                    <Input
                      id="numero"
                      value={newAddress.numero}
                      onChange={(e) => setNewAddress((prev) => ({ ...prev, numero: e.target.value }))}
                      placeholder="123"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      value={newAddress.cep}
                      onChange={(e) => setNewAddress((prev) => ({ ...prev, cep: e.target.value }))}
                      placeholder="00000-000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      value={newAddress.cidade}
                      onChange={(e) => setNewAddress((prev) => ({ ...prev, cidade: e.target.value }))}
                      placeholder="São Paulo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="estado">Estado</Label>
                    <Input
                      id="estado"
                      value={newAddress.estado}
                      onChange={(e) => setNewAddress((prev) => ({ ...prev, estado: e.target.value }))}
                      placeholder="SP"
                      maxLength={2}
                    />
                  </div>
                </div>
                <Button onClick={handleAddAddress} className="w-full bg-[#FE9A04] hover:bg-[#E8890B]">
                  Salvar Endereço
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {addresses.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Nenhum endereço cadastrado</p>
        ) : (
          <div className="space-y-3">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedAddress?.id === address.id
                    ? "border-[#FE9A04] bg-orange-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => onAddressSelect(address)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">
                      {address.rua}, {address.numero}
                    </p>
                    <p className="text-sm text-gray-600">
                      {address.cidade}, {address.estado} - {address.cep}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteAddress(address.id)
                      }}
                    >
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
  )
}
