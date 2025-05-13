"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Compass, Locate } from "lucide-react"
import dynamic from "next/dynamic"

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

// Create a client-side only Map component
const ClientSideMap = dynamic(
  () => import('./map-client-component'),
  { ssr: false }
)



export default function MapView() {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([41.3851, 2.1734]); // Barcelona by default

  // Set map as loaded when on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      setMapLoaded(true);
    }
  }, []);

  // Load mock places
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
    ];

    setPlaces(mockPlaces);
  }, []);

  // Get user location on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      handleLocateMe();
    }
  }, []);

  const handleMarkerClick = (placeId: string) => {
    router.push(`/place/${placeId}`);
  };

  const handleLocateMe = () => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserLocation(newLocation);
          setMapCenter(newLocation);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  if (!mapLoaded) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gray-100 dark:bg-gray-800 relative z-0">
      <ClientSideMap
        places={places}
        userLocation={userLocation}
        mapCenter={mapCenter}
        onMarkerClick={handleMarkerClick}
      />

      {/* Controles del mapa */}
      <div className="absolute bottom-24 right-4 flex flex-col gap-2 z-[1000]">
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
