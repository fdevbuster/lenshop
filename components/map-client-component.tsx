"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

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

interface MapClientProps {
  places: Place[]
  userLocation: [number, number] | null
  mapCenter: [number, number]
  onMarkerClick: (placeId: string) => void
}

// Fix Leaflet icon issues
function fixLeafletIcons() {
  // Fix Leaflet's default icon paths
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
}

// Component to recenter map when user location changes
function RecenterAutomatically({ position }: { position: [number, number] | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);
  
  return null;
}

// Custom marker icon for places
const createPlaceIcon = (category: string, hasRewards: boolean) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="${hasRewards ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-700'} w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
            <span class="text-xs font-bold text-white">${category.charAt(0).toUpperCase()}</span>
            ${hasRewards ? '<div class="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white"></div>' : ''}
          </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

// User location marker icon
const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: `<div class="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg">
          <div class="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export default function MapClientComponent({ places, userLocation, mapCenter, onMarkerClick }: MapClientProps) {
  const [initialized, setInitialized] = useState(false);

  // Initialize Leaflet icons
  useEffect(() => {
    fixLeafletIcons();
    setInitialized(true);
  }, []);

  if (!initialized) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <MapContainer 
      center={mapCenter} 
      zoom={15} 
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {places.map((place) => (
        <Marker 
          key={place.id} 
          position={[place.lat, place.lng]}
          icon={createPlaceIcon(place.category, place.hasRewards)}
          eventHandlers={{
            click: () => onMarkerClick(place.id),
          }}
        >
          <Popup>
            <div className="text-sm font-bold">{place.name}</div>
            <div className="text-xs text-gray-500 mb-1">{place.lensHandle}</div>
          </Popup>
        </Marker>
      ))}
      
      {userLocation && (
        <Marker position={userLocation} icon={userLocationIcon} />
      )}
      
      <RecenterAutomatically position={mapCenter} />
    </MapContainer>
  );
}