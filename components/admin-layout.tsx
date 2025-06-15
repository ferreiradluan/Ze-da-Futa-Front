"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutDashboard, Users, Store, Truck, ShoppingBag, DollarSign, Ticket, LogOut, Shield } from "lucide-react"
import Image from "next/image"

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
  activeTab?: string
}

interface AdminUser {
  name: string
  email: string
  role: string
}

export default function AdminLayout({ children, title, activeTab }: AdminLayoutProps) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    const savedUser = localStorage.getItem("admin_user")

    if (!token || !savedUser) {
      router.push("/admin")
      return
    }

    setUser(JSON.parse(savedUser))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    localStorage.removeItem("admin_user")
    router.push("/admin")
  }

  if (!user) return null

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { id: "users", label: "Usuários", icon: Users, href: "/admin/users" },
    { id: "establishments", label: "Estabelecimentos", icon: Store, href: "/admin/establishments" },
    { id: "deliverers", label: "Entregadores", icon: Truck, href: "/admin/deliverers" },
    { id: "orders", label: "Pedidos", icon: ShoppingBag, href: "/admin/orders" },
    { id: "financial", label: "Financeiro", icon: DollarSign, href: "/admin/financial" },
    { id: "coupons", label: "Cupons", icon: Ticket, href: "/admin/coupons" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#FE9A04] rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <Image src="/logo.png" alt="Zé da Fruta" width={120} height={48} priority />
              <span className="text-sm text-gray-500 font-medium">Admin</span>
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg" alt={user.name} />
                    <AvatarFallback className="bg-[#FE9A04] text-white">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-4rem)] border-r border-gray-200">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon
              const isActive = activeTab === item.id

              return (
                <Button
                  key={item.id}
                  type="button"
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    isActive
                      ? "bg-[#FE9A04] hover:bg-[#E8890B] text-white"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  onClick={() => router.push(item.href)}
                >
                  <IconComponent className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
