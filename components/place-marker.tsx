"use client"

// This component is no longer used directly in the map view
// It's kept for reference or potential future use with custom marker implementations

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
  
  return (
    <div
      className="cursor-pointer"
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
              <Badge variant="outline">{place.category}</Badge>
              {place.hasRewards && (
                <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
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
