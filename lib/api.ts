const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

interface ApiResponse<T> {
  data?: T
  error?: string
}

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem("access_token")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { data }
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { data }
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { data }
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { data }
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  // Métodos específicos da API
  async getProducts() {
    return this.get<Product[]>("/products")
  }

  async searchProduct(name: string) {
    return this.get<Product>(`/products/${name}`)
  }

  async createAddress(address: CreateAddressRequest) {
    return this.post<Address>("/enderecos", address)
  }

  async createOrder(order: CreateOrderRequest) {
    return this.post<Order>("/pedidos", order)
  }

  async getMyOrders(userId: number) {
    return this.get<Order[]>(`/pedidos?usuarioId=${userId}`)
  }

  async rateProduct(productName: string, rating: number) {
    return this.put(`/products/${productName}/rating`, { rating })
  }

  async deleteAccount() {
    return this.delete("/auth/minha-conta")
  }

  async setUserProfile(profile: string) {
    return this.post("/perfil-usuario", { perfil: profile })
  }

  // Métodos específicos do Entregador
  async getAvailableDeliveries() {
    return this.get<Delivery[]>("/entregas?status=AGUARDANDO_COLETA")
  }

  async getMyDeliveries(entregadorId: number) {
    return this.get<Delivery[]>(`/entregas?entregadorId=${entregadorId}`)
  }

  async getDeliveryDetails(deliveryId: number) {
    return this.get<Delivery>(`/entregas/${deliveryId}`)
  }

  async acceptDelivery(deliveryId: number) {
    return this.put<Delivery>(`/entregas/${deliveryId}`, { status: "EM_TRANSITO" })
  }

  async completeDelivery(deliveryId: number) {
    return this.put<Delivery>(`/entregas/${deliveryId}`, { status: "ENTREGUE" })
  }

  async setActiveProfile(profile: string) {
    return this.put("/auth/perfil-ativo", { perfil: profile })
  }

  async getDeliveryProfile() {
    return this.get<DeliveryProfile>("/perfil-entregador")
  }
}

export const apiService = new ApiService()

// Interfaces
export interface Product {
  id: number
  name: string
  price: number
  unit: string
  image: string
  rating: number
  vendor: string
  category: string
  stock?: number
  description?: string
}

export interface Address {
  id: number
  rua: string
  numero: string
  cidade: string
  estado: string
  cep: string
}

export interface CreateAddressRequest {
  rua: string
  numero: string
  cidade: string
  estado: string
  cep: string
}

export interface Order {
  id: number
  userId: number
  enderecoId: number
  itens: OrderItem[]
  total: number
  status: string
  createdAt: string
}

export interface OrderItem {
  produtoId: number
  quantidade: number
  produto?: Product
}

export interface CreateOrderRequest {
  userId: number
  enderecoId: number
  itens: {
    produtoId: number
    quantidade: number
  }[]
}

// Interfaces para Entregador
export interface Delivery {
  id: number
  pedidoId: number
  entregadorId?: number
  status: "AGUARDANDO_COLETA" | "EM_TRANSITO" | "ENTREGUE" | "CANCELADA"
  endereco: {
    rua: string
    numero: string
    cidade: string
    estado: string
    cep: string
  }
  cliente: {
    nome: string
    telefone?: string
  }
  itens: {
    nome: string
    quantidade: number
    preco: number
  }[]
  valorTotal: number
  distancia?: string
  tempoEstimado?: string
  observacoes?: string
  createdAt: string
  updatedAt: string
}

export interface DeliveryProfile {
  id: number
  userId: number
  status_aprovacao: "pendente" | "aprovado" | "rejeitado"
  veiculo?: string
  cnh?: string
  createdAt: string
}
