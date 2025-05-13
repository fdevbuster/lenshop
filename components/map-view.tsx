"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Compass, Locate } from "lucide-react"
import PlaceMarker from "./place-marker"

// Tipos para los lugares
interface Place {
  id: string
  name: string
  lensHandle: string
  lat: number
  lng: number
  category: string
  hasRewards: boolean
}

export default function MapView() {
  const mapRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [places, setPlaces] = useState<Place[]>([])
  const [mapLoaded, setMapLoaded] = useState(false)

  // Simular lugares cercanos
  useEffect(() => {
    // En una implementación real, estos datos vendrían de una API
    const mockPlaces: Place[] = [
      {
        id: "1",
        name: "Café Blockchain",
        lensHandle: "cafeblockchain.lens",
        lat: 41.3851,
        lng: 2.1734,
        category: "café",
        hasRewards: true,
      },
      {
        id: "2",
        name: "NFT Gallery",
        lensHandle: "nftgallery.lens",
        lat: 41.3861,
        lng: 2.1744,
        category: "galería",
        hasRewards: false,
      },
      {
        id: "3",
        name: "Web3 Coworking",
        lensHandle: "web3space.lens",
        lat: 41.3871,
        lng: 2.1724,
        category: "coworking",
        hasRewards: true,
      },
    ]

    setPlaces(mockPlaces)
  }, [])

  // Simular carga del mapa
  useEffect(() => {
    // En una implementación real, aquí cargaríamos la API de mapas
    setTimeout(() => {
      setMapLoaded(true)
      // Simular obtener la ubicación del usuario
      setUserLocation({ lat: 41.3851, lng: 2.1734 })
    }, 1000)
  }, [])

  const handleMarkerClick = (placeId: string) => {
    router.push(`/place/${placeId}`)
  }

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }

  return (
    <div className="h-full w-full bg-gray-100 dark:bg-gray-800 relative">
      {/* Mapa simulado */}
      <div ref={mapRef} className="h-full w-full bg-[url('/city-map-streets.png')] bg-cover bg-center">
        {mapLoaded ? (
          <>
            {/* Marcadores de lugares */}
            {places.map((place) => (
              <PlaceMarker key={place.id} place={place} onClick={() => handleMarkerClick(place.id)} />
            ))}

            {/* Marcador de ubicación del usuario */}
            {userLocation && (
              <div
                className="absolute w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            )}
          </>
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}
      </div>

      {/* Controles del mapa */}
      <div className="absolute bottom-24 right-4 flex flex-col gap-2">
        <Button variant="secondary" size="icon" className="rounded-full shadow-lg" onClick={handleLocateMe}>
          <Locate className="h-5 w-5" />
        </Button>
        <Button variant="secondary" size="icon" className="rounded-full shadow-lg">
          <Compass className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
