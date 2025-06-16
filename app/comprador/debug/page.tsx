"use client"

import { useAuth } from "@/hooks/use-auth"
import { useEffect, useState } from "react"

export default function DebugPage() {
  const { user, isAuthenticated, loading, userType } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div>Mounting...</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
      <div className="space-y-2">
        <p><strong>Mounted:</strong> {mounted ? 'Yes' : 'No'}</p>
        <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
        <p><strong>User Type:</strong> {userType || 'null'}</p>
        <p><strong>User Data:</strong></p>
        <pre className="bg-gray-100 p-2 rounded text-sm">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </div>
  )
}
