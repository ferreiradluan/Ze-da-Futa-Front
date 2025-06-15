"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react"
import type { DeliveryProfile } from "@/lib/api"

interface DeliveryApprovalStatusProps {
  profile: DeliveryProfile | null
  onRetry?: () => void
}

export default function DeliveryApprovalStatus({ profile, onRetry }: DeliveryApprovalStatusProps) {
  if (!profile) return null

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "aprovado":
        return {
          icon: CheckCircle,
          color: "bg-green-500",
          title: "Perfil Aprovado!",
          description: "Você já pode começar a aceitar entregas.",
          showRetry: false,
        }
      case "pendente":
        return {
          icon: Clock,
          color: "bg-yellow-500",
          title: "Aguardando Aprovação",
          description: "Seu perfil está sendo analisado pela nossa equipe. Isso pode levar até 24 horas.",
          showRetry: false,
        }
      case "rejeitado":
        return {
          icon: XCircle,
          color: "bg-red-500",
          title: "Perfil Rejeitado",
          description: "Infelizmente seu perfil não foi aprovado. Entre em contato conosco para mais informações.",
          showRetry: true,
        }
      default:
        return {
          icon: AlertCircle,
          color: "bg-gray-500",
          title: "Status Desconhecido",
          description: "Entre em contato com o suporte.",
          showRetry: false,
        }
    }
  }

  const statusInfo = getStatusInfo(profile.status_aprovacao)
  const IconComponent = statusInfo.icon

  return (
    <Card className="border-l-4" style={{ borderLeftColor: statusInfo.color.replace("bg-", "#") }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${statusInfo.color}`}>
            <IconComponent className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold">{statusInfo.title}</h3>
            <Badge className={statusInfo.color}>
              {profile.status_aprovacao.charAt(0).toUpperCase() + profile.status_aprovacao.slice(1)}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{statusInfo.description}</p>

        {profile.veiculo && (
          <div className="text-sm text-gray-500 mb-2">
            <strong>Veículo:</strong> {profile.veiculo}
          </div>
        )}

        {profile.cnh && (
          <div className="text-sm text-gray-500 mb-4">
            <strong>CNH:</strong> {profile.cnh}
          </div>
        )}

        {statusInfo.showRetry && onRetry && (
          <Button onClick={onRetry} variant="outline" className="w-full">
            Tentar Novamente
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
