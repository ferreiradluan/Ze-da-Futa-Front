"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, MoreHorizontal, UserCheck, UserX, Shield } from "lucide-react"
import type { User } from "@/lib/admin-api"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.profile.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredUsers(filtered)
  }, [users, searchTerm])

  const loadUsers = async () => {
    setIsLoading(true)

    // Em produção, usar a API real:
    // const result = await adminApiService.getAllUsers()
    // if (result.data) {
    //   setUsers(result.data)
    // }

    // Por enquanto, lista vazia até API real ser implementada
    setUsers([])
    setIsLoading(false)
  }

  const updateUserStatus = async (userId: number, newStatus: "ATIVO" | "INATIVO" | "SUSPENSO") => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ATIVO":
        return <Badge className="bg-green-500">Ativo</Badge>
      case "INATIVO":
        return <Badge variant="secondary">Inativo</Badge>
      case "SUSPENSO":
        return <Badge className="bg-red-500">Suspenso</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getProfileBadge = (profile: string) => {
    switch (profile) {
      case "user":
        return <Badge variant="outline">Comprador</Badge>
      case "vendedor":
        return <Badge className="bg-blue-500">Vendedor</Badge>
      case "entregador":
        return <Badge className="bg-purple-500">Entregador</Badge>
      default:
        return <Badge variant="outline">{profile}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "ATIVO").length,
    suspended: users.filter((u) => u.status === "SUSPENSO").length,
    inactive: users.filter((u) => u.status === "INATIVO").length,
  }

  return (
    <AdminLayout title="Gerenciamento de Usuários" activeTab="users">
      <div className="space-y-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Usuários</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <Shield className="w-8 h-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Usuários Ativos</p>
                  <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                </div>
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Usuários Suspensos</p>
                  <p className="text-3xl font-bold text-red-600">{stats.suspended}</p>
                </div>
                <UserX className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Usuários Inativos</p>
                  <p className="text-3xl font-bold text-gray-600">{stats.inactive}</p>
                </div>
                <UserX className="w-8 h-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nome, email ou perfil..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={loadUsers} variant="outline">
                Atualizar
              </Button>
            </div>

            {/* Tabela de Usuários */}
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="animate-pulse border rounded-lg p-4">
                    <div className="flex justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="bg-gray-200 h-4 rounded w-1/3"></div>
                        <div className="bg-gray-200 h-3 rounded w-1/2"></div>
                      </div>
                      <div className="bg-gray-200 h-6 w-20 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cadastro</TableHead>
                    <TableHead>Último Login</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getProfileBadge(user.profile)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>{user.lastLogin ? formatDate(user.lastLogin) : "Nunca"}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => updateUserStatus(user.id, "ATIVO")}
                              disabled={user.status === "ATIVO"}
                            >
                              Ativar Usuário
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateUserStatus(user.id, "SUSPENSO")}
                              disabled={user.status === "SUSPENSO"}
                            >
                              Suspender Usuário
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateUserStatus(user.id, "INATIVO")}
                              disabled={user.status === "INATIVO"}
                            >
                              Desativar Usuário
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {filteredUsers.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Nenhum usuário encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
