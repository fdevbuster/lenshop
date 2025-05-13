"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface Place {
  id: string
  name: string
  lensHandle: string
  category: string
  hasRewards: boolean
}

interface PlaceMarkerProps {
  place: Place
  onClick: () => void
}

export default function PlaceMarker({ place, onClick }: PlaceMarkerProps) {
  const [showPreview, setShowPreview] = useState(false)

  // Posiciones aleatorias para la demostración
  const left = `${Math.floor(Math.random() * 80) + 10}%`
  const top = `${Math.floor(Math.random() * 70) + 15}%`

  return (
    <div
      className="absolute cursor-pointer"
      style={{ left, top }}
      onClick={onClick}
      onMouseEnter={() => setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
    >
      <div className="relative">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${place.hasRewards ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-gray-700"}`}
        >
          <span className="text-xs font-bold text-white">{place.category.charAt(0).toUpperCase()}</span>
        </div>

        {place.hasRewards && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white"></div>
        )}

        {showPreview && (
          <Card className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-48 p-2 z-10">
            <div className="text-sm font-bold">{place.name}</div>
            <div className="text-xs text-gray-500 mb-1">{place.lensHandle}</div>
            <div className="flex gap-1">
              <Badge variant="outline" className="text-xs">
                {place.category}
              </Badge>
              {place.hasRewards && (
                <Badge variant="secondary" className="text-xs">
                  Recompensas
                </Badge>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
