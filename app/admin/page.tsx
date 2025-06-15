"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Eye, EyeOff } from "lucide-react"
import Image from "next/image"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Em produção, usar a API real:
      // const result = await adminApiService.adminLogin(email, senha)
      // if (result.data) {
      //   localStorage.setItem("admin_token", result.data.token)
      //   router.push("/admin/dashboard")
      // } else {
      //   setError(result.error || "Erro ao fazer login")
      // }

      // Simulação para desenvolvimento
      if (email === "admin@zedafruta.com" && senha === "Zedafruta@2025") {
        localStorage.setItem("admin_token", "mock_admin_token_123")
        localStorage.setItem(
          "admin_user",
          JSON.stringify({
            name: "Administrador",
            email: "admin@zedafruta.com",
            role: "admin",
          }),
        )
        router.push("/admin/dashboard")
      } else {
        setError("Credenciais inválidas")
      }
    } catch (error) {
      setError("Erro ao conectar com o servidor")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="mx-auto w-16 h-16 bg-[#FE9A04] rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <Image src="/logo.png" alt="Zé da Fruta" width={200} height={80} className="mx-auto mb-4" priority />
              <CardTitle className="text-2xl font-bold text-gray-800">Painel Administrativo</CardTitle>
              <p className="text-gray-600">Acesso restrito para administradores</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@zedafruta.com"
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <div className="relative">
                  <Input
                    id="senha"
                    type={showPassword ? "text" : "password"}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="h-12 pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#FE9A04] hover:bg-[#E8890B] text-white font-semibold"
              >
                {isLoading ? "Entrando..." : "Entrar no Painel"}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-500">
              <p>Credenciais de teste:</p>
              <p className="font-mono text-xs mt-1">admin@zedafruta.com / Zedafruta@2025</p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-gray-400 text-sm">
          <p>© 2024 Zé da Fruta. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  )
}
