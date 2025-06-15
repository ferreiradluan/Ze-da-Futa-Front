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
import { LogOut } from "lucide-react"
import Image from "next/image"

interface DashboardLayoutUser {
  name: string
  email: string
  photo: string
}

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  userType: "comprador" | "vendedor" | "entregador"
}

export default function DashboardLayout({ children, title, userType }: DashboardLayoutProps) {
  const [user, setUser] = useState<DashboardLayoutUser | null>(null)
  const router = useRouter()

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    const savedUserType = localStorage.getItem("userType")

    if (!savedUser || savedUserType !== userType) {
      router.push("/")
      return
    }

    setUser(JSON.parse(savedUser))
  }, [router, userType])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("userType")
    router.push("/")
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center justify-center py-2">
              <Image src="/logo.png" alt="Zé da Fruta" width={100} height={40} priority className="object-contain" />
            </div>

            {/* Título */}

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.photo || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
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
                <DropdownMenuItem>
                  {/* User icon and label */}
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {/* Settings icon and label */}
                  <span>Configurações</span>
                </DropdownMenuItem>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}
