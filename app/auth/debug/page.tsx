"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { authService } from '@/lib/auth-service'

export default function DebugCallbackPage() {
  const [tokenData, setTokenData] = useState<any>(null)
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    setCurrentUrl(window.location.href)
    
    // Testar com o token real do seu backend
    const realToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxY2U1OTY0My01ZTEzLTQyZmQtYTU1OS1hY2E0MTBhNWY3NWEiLCJlbWFpbCI6ImhlbnJpbHVhbjlAZ21haWwuY29tIiwibm9tZSI6Ikx1YW4gSGVucmlxdWUiLCJ0eXBlIjoidXN1YXJpbyIsImlhdCI6MTc1MDA4ODQ4NCwiZXhwIjoxNzUwMTc0ODg0fQ.fjdg4bQ3ANbZPhcqbQhKkmRp9nxPEEZWLD0LT_0PMu4"
    
    try {
      // Decodificar o token
      const payload = realToken.split('.')[1]
      const decoded = JSON.parse(atob(payload))
        setTokenData({
        decoded,
        isValid: decoded.exp > Math.floor(Date.now() / 1000),
        mappedType: 'comprador'
      })
    } catch (error) {
      setTokenData({ error: error instanceof Error ? error.message : 'Erro desconhecido' })
    }
  }, [])

  const testCallback = () => {
    // Simular a URL do seu backend
    const testUrl = `${window.location.origin}/auth/google/callback?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxY2U1OTY0My01ZTEzLTQyZmQtYTU1OS1hY2E0MTBhNWY3NWEiLCJlbWFpbCI6ImhlbnJpbHVhbjlAZ21haWwuY29tIiwibm9tZSI6Ikx1YW4gSGVucmlxdWUiLCJ0eXBlIjoidXN1YXJpbyIsImlhdCI6MTc1MDA4ODQ4NCwiZXhwIjoxNzUwMTc0ODg0fQ.fjdg4bQ3ANbZPhcqbQhKkmRp9nxPEEZWLD0LT_0PMu4`
    
    window.location.href = testUrl
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🔍 Debug - Callback do Google OAuth</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <strong>URL Atual:</strong>
              <div className="bg-gray-100 p-2 rounded text-sm font-mono break-all">
                {currentUrl}
              </div>
            </div>

            <Button onClick={testCallback} className="w-full">
              🧪 Testar Callback Real do Backend
            </Button>
          </CardContent>
        </Card>

        {tokenData && (
          <Card>
            <CardHeader>
              <CardTitle>📋 Dados do Token JWT</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
                {JSON.stringify(tokenData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>✅ O que acontece agora:</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>1. ✅ Seu backend redireciona para: <code className="bg-gray-100 px-1">/auth/google/callback</code></p>
            <p>2. ✅ Frontend captura o token automaticamente</p>
            <p>3. ✅ Mapeia <code className="bg-gray-100 px-1">type: "usuario"</code> → <code className="bg-gray-100 px-1">userType: "comprador"</code></p>
            <p>4. ✅ Salva dados no localStorage</p>
            <p>5. ✅ Redireciona para <code className="bg-gray-100 px-1">/comprador/dashboard</code></p>
            <p>6. ✅ URL fica limpa, usuário não vê o token</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
