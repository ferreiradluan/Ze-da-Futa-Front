"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Star } from "lucide-react"

interface ProductRatingProps {
  productName: string
  currentRating: number
  onRatingUpdate: (newRating: number) => void
}

export default function ProductRating({ productName, currentRating, onRatingUpdate }: ProductRatingProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedRating, setSelectedRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleSubmitRating = async () => {
    if (selectedRating > 0) {
      // Em produção, usar a API real:
      // const result = await apiService.rateProduct(productName, selectedRating)
      // if (result.data) {
      //   onRatingUpdate(selectedRating)
      // }

      // Simulação:
      onRatingUpdate(selectedRating)
      setIsOpen(false)
      setSelectedRating(0)
      setHoveredRating(0)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Star className="w-4 h-4" />
          Avaliar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Avaliar Produto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-center">
          <p className="text-gray-600">Como você avalia este produto?</p>
          <p className="font-medium">{productName}</p>

          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="p-1 transition-colors"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setSelectedRating(star)}
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoveredRating || selectedRating) ? "text-yellow-500 fill-current" : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button
              onClick={handleSubmitRating}
              disabled={selectedRating === 0}
              className="flex-1 bg-[#FE9A04] hover:bg-[#E8890B]"
            >
              Enviar Avaliação
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
