"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import UserMenu from "@/components/user-menu"
import { useAuth } from "@/hooks/use-auth"
import Image from "next/image"

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  userType: "comprador" | "vendedor" | "entregador"
}

export default function DashboardLayout({ children, title, userType }: DashboardLayoutProps) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Image src="/logo.png" alt="Zé da Fruta" width={120} height={40} priority />
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}
