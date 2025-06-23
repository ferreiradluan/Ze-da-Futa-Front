"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

import { API_CONFIG } from "@/lib/api-config"

// Usar configuração centralizada
const API_BASE_URL = API_CONFIG.FETCH_URL

export default function ApiTestPage() {
  const [result, setResult] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const testApi = async () => {
    setLoading(true)
    setResult("Testando...")
    
    try {
      console.log("🧪 Iniciando teste da API...")
      
      const url = `${API_BASE_URL}/sales/public/establishments`
      console.log("🔗 URL:", url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        cache: 'no-cache'
      })
      
      console.log("📡 Status:", response.status)
      console.log("📡 Headers:", Object.fromEntries(response.headers.entries()))
      
      const text = await response.text()
      console.log("📄 Resposta bruta:", text)
      
      if (response.ok) {
        try {
          const json = JSON.parse(text)
          console.log("✅ JSON válido:", json)
          
          setResult(`✅ Sucesso!
Status: ${response.status}
Dados: ${JSON.stringify(json, null, 2)}`)
        } catch (parseError) {
          console.error("❌ Erro de parse:", parseError)
          setResult(`❌ JSON inválido:
Status: ${response.status}
Resposta: ${text}`)
        }
      } else {
        setResult(`❌ Erro HTTP:
Status: ${response.status}
Resposta: ${text}`)
      }
      
    } catch (error) {
      console.error("❌ Erro de rede:", error)
      setResult(`❌ Erro de rede: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Teste da API</h1>
      
      <div className="space-y-4">
        <div>
          <p><strong>URL da API:</strong> {API_BASE_URL}</p>
          <p><strong>Endpoint:</strong> /sales/public/establishments</p>
        </div>
        
        <Button onClick={testApi} disabled={loading}>
          {loading ? "Testando..." : "🧪 Testar API"}
        </Button>
        
        {result && (
          <div className="bg-gray-100 p-4 rounded border">
            <h3 className="font-semibold mb-2">Resultado:</h3>
            <pre className="whitespace-pre-wrap text-sm">{result}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
