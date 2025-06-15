const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

interface ApiResponse<T> {
  data?: T
  error?: string
}

class AdminApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem("admin_token")
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

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        ...(body && { body: JSON.stringify(body) }),
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

  // Métodos específicos do Admin
  async adminLogin(email: string, senha: string) {
    return this.post<{ token: string }>("/auth/login", { email, senha })
  }

  async getDashboard() {
    return this.get<AdminDashboard>("/admin/dashboard")
  }

  async getAllUsers() {
    return this.get<User[]>("/admin/usuarios")
  }

  async updateUserStatus(userId: number, status: string) {
    return this.put(`/admin/usuarios/${userId}/status`, { status })
  }

  async getPendingEstablishments() {
    return this.get<Establishment[]>("/admin/estabelecimentos/pendentes")
  }

  async approveEstablishment(establishmentId: number, status: string) {
    return this.put(`/admin/estabelecimentos/${establishmentId}/status`, { status })
  }

  async getPendingDeliverers() {
    return this.get<DeliveryProfile[]>("/admin/entregadores/pendentes")
  }

  async approveDeliverer(profileId: number, status: string) {
    return this.put(`/admin/entregadores/${profileId}/status`, { status_aprovacao: status })
  }

  async getAllOrders() {
    return this.get<AdminOrder[]>("/admin/pedidos")
  }

  async refundOrder(orderId: number) {
    return this.post(`/admin/pedidos/${orderId}/reembolso`)
  }

  async getFinancialReports() {
    return this.get<FinancialReport>("/admin/financeiro/relatorios")
  }

  async getCoupons() {
    return this.get<Coupon[]>("/admin/cupons")
  }

  async createCoupon(coupon: CreateCouponRequest) {
    return this.post<Coupon>("/admin/cupons", coupon)
  }

  async updateCoupon(couponId: number, coupon: UpdateCouponRequest) {
    return this.put<Coupon>(`/admin/cupons/${couponId}`, coupon)
  }

  async deleteCoupon(couponId: number) {
    return this.delete(`/admin/cupons/${couponId}`)
  }
}

export const adminApiService = new AdminApiService()

// Interfaces
export interface AdminDashboard {
  totalUsers: number
  totalOrders: number
  totalRevenue: number
  pendingApprovals: number
  recentActivity: Activity[]
}

export interface Activity {
  id: number
  type: string
  description: string
  timestamp: string
}

export interface User {
  id: number
  name: string
  email: string
  status: "ATIVO" | "INATIVO" | "SUSPENSO"
  profile: "user" | "vendedor" | "entregador"
  createdAt: string
  lastLogin?: string
}

export interface Establishment {
  id: number
  name: string
  owner: string
  email: string
  status: "PENDENTE" | "APROVADO" | "REJEITADO"
  address: string
  phone?: string
  createdAt: string
}

export interface DeliveryProfile {
  id: number
  userId: number
  userName: string
  email: string
  status_aprovacao: "pendente" | "aprovado" | "rejeitado"
  veiculo?: string
  cnh?: string
  createdAt: string
}

export interface AdminOrder {
  id: number
  userId: number
  userName: string
  total: number
  status: string
  createdAt: string
  items: {
    name: string
    quantity: number
    price: number
  }[]
}

export interface FinancialReport {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  monthlyRevenue: {
    month: string
    revenue: number
  }[]
  topProducts: {
    name: string
    sales: number
    revenue: number
  }[]
}

export interface Coupon {
  id: number
  code: string
  description: string
  discount: number
  discountType: "PERCENTAGE" | "FIXED"
  minValue?: number
  maxUses?: number
  currentUses: number
  expiresAt?: string
  isActive: boolean
  createdAt: string
}

export interface CreateCouponRequest {
  code: string
  description: string
  discount: number
  discountType: "PERCENTAGE" | "FIXED"
  minValue?: number
  maxUses?: number
  expiresAt?: string
}

export interface UpdateCouponRequest extends CreateCouponRequest {
  isActive: boolean
}
