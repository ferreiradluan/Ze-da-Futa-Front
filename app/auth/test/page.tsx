"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authService } from '@/lib/auth-service'

export default function AuthTestPage() {
  const [token, setToken] = useState('')
  const [userType, setUserType] = useState('comprador')
  const [result, setResult] = useState<any>(null)

  const simulateCallback = () => {
    try {
      // Simular URL de callback
      const testUrl = `${window.location.origin}/auth/test?token=${token}&type=${userType}`
      window.history.pushState({}, '', testUrl)
      
      // Processar callback
      const callbackResult = authService.handleOAuthCallback()
      setResult(callbackResult)
      
      console.log('Resultado do callback:', callbackResult)    } catch (error) {
      console.error('Erro:', error)
      setResult({ success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' })
    }
  }

  const clearAuth = () => {
    authService.logout()
    setResult(null)
    window.location.reload()
  }

  const checkAuth = () => {
    const isAuth = authService.isAuthenticated()
    const userData = authService.getUserData()
    const token = authService.getToken()
    
    setResult({
      isAuthenticated: isAuth,
      userData,
      token: token ? token.substring(0, 20) + '...' : null
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🧪 Teste de Autenticação OAuth</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="token">Token JWT (simulado)</Label>
              <Input
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="font-mono text-sm"
              />
            </div>

            <div>
              <Label htmlFor="userType">Tipo de Usuário</Label>
              <select
                id="userType"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="comprador">Comprador</option>
                <option value="vendedor">Vendedor</option>
                <option value="entregador">Entregador</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button onClick={simulateCallback} disabled={!token}>
                🚀 Simular Callback
              </Button>
              <Button onClick={checkAuth} variant="outline">
                🔍 Verificar Auth
              </Button>
              <Button onClick={clearAuth} variant="destructive">
                🗑️ Limpar Auth
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>📋 Resultado</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>📚 URLs de Teste</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">            <div>
              <strong>Backend URLs:</strong>
              <ul className="list-disc ml-6 space-y-1 text-sm font-mono">
                <li>OAuth Google: {process.env.NEXT_PUBLIC_API_URL}/auth/user/google</li>
              </ul>
            </div>
              <div>
              <strong>Callback URL esperada:</strong>
              <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                {typeof window !== 'undefined' ? window.location.origin : 'https://seu-dominio.com'}/auth/callback?token=JWT_TOKEN&type=comprador
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🔧 Exemplo de Token JWT</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-2">Use este token de exemplo para testar:</p>
            <div className="bg-gray-100 p-2 rounded text-xs font-mono break-all">
              eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvYW8gU2lsdmEiLCJlbWFpbCI6ImpvYW9AZXhhbXBsZS5jb20iLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6OTk5OTk5OTk5OX0.Twf-CX_CzJFJUj9bW_92F0GpR4vdFs82TvPP2rX-NJs
            </div>
            <Button 
              onClick={() => setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvYW8gU2lsdmEiLCJlbWFpbCI6ImpvYW9AZXhhbXBsZS5jb20iLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6OTk5OTk5OTk5OX0.Twf-CX_CzJFJUj9bW_92F0GpR4vdFs82TvPP2rX-NJs')}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Usar Token de Exemplo
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
