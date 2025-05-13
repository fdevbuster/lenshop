import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Compass, MapPin, Star, Clock, Trophy, Filter } from "lucide-react"

// Mock data for categories and places
const categories = [
  { id: "1", name: "Cafés", icon: "☕" },
  { id: "2", name: "Galerías", icon: "🖼️" },
  { id: "3", name: "Coworking", icon: "💻" },
  { id: "4", name: "Eventos", icon: "🎉" },
  { id: "5", name: "Tiendas", icon: "🛍️" },
]

const popularPlaces = [
  {
    id: "1",
    name: "Café Blockchain",
    category: "café",
    rating: 4.8,
    reviewCount: 124,
    image: "/placeholder.svg?height=200&width=300&query=coffee%20shop",
    lensHandle: "cafeblockchain.lens",
    hasRewards: true,
    distance: "0.5km",
  },
  {
    id: "2",
    name: "NFT Gallery",
    category: "galería",
    rating: 4.6,
    reviewCount: 89,
    image: "/placeholder.svg?height=200&width=300&query=art%20gallery",
    lensHandle: "nftgallery.lens",
    hasRewards: false,
    distance: "1.2km",
  },
  {
    id: "3",
    name: "Web3 Coworking",
    category: "coworking",
    rating: 4.9,
    reviewCount: 210,
    image: "/placeholder.svg?height=200&width=300&query=coworking%20space",
    lensHandle: "web3space.lens",
    hasRewards: true,
    distance: "0.8km",
  },
  {
    id: "4",
    name: "Crypto Café",
    category: "café",
    rating: 4.5,
    reviewCount: 76,
    image: "/placeholder.svg?height=200&width=300&query=modern%20cafe",
    lensHandle: "cryptocafe.lens",
    hasRewards: true,
    distance: "1.5km",
  },
]

const upcomingEvents = [
  {
    id: "1",
    name: "Web3 Meetup",
    date: "Mañana, 18:00",
    location: "Web3 Coworking",
    image: "/placeholder.svg?height=150&width=300&query=tech%20meetup",
  },
  {
    id: "2",
    name: "NFT Exhibition",
    date: "Sábado, 12:00",
    location: "NFT Gallery",
    image: "/placeholder.svg?height=150&width=300&query=nft%20exhibition",
  },
]

export default function ExplorarPage() {
  return (
    <div className="pb-20">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 p-4 border-b dark:border-gray-800">
        <h1 className="text-xl font-bold">Explorar</h1>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-2 flex items-center">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Compass className="h-5 w-5" />
          </Button>
          <input
            type="text"
            placeholder="Buscar lugares, eventos, categorías..."
            className="flex-1 bg-transparent border-none focus:outline-none px-2"
          />
          <Button variant="ghost" size="icon" className="rounded-full">
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mb-6">
        <h2 className="font-bold text-lg mb-3">Categorías</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="outline"
              className="rounded-full bg-white dark:bg-gray-800 flex-shrink-0 border shadow-sm"
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Popular Places */}
      <div className="px-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-lg">Lugares populares</h2>
          <Button variant="link" className="text-sm p-0 h-auto">Ver todos</Button>
        </div>
        
        <div className="space-y-4">
          {popularPlaces.map((place) => (
            <Card key={place.id} className="overflow-hidden">
              <div className="flex">
                <div className="relative h-24 w-24 flex-shrink-0">
                  <Image
                    src={place.image}
                    alt={place.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3 flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{place.name}</h3>
                    <Badge variant="outline" className="h-6">
                      {place.distance}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{place.rating}</span>
                    <span className="text-xs text-gray-500">({place.reviewCount})</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {place.category}
                    </Badge>
                    {place.hasRewards && (
                      <Badge variant="outline" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none text-xs">
                        <Trophy className="h-3 w-3 mr-1" />
                        Recompensas
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="px-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-lg">Eventos próximos</h2>
          <Button variant="link" className="text-sm p-0 h-auto">Ver todos</Button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {upcomingEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <div className="relative h-24 w-full">
                <Image
                  src={event.image}
                  alt={event.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm">{event.name}</h3>
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                  <MapPin className="h-3 w-3" />
                  <span>{event.location}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recommended by Followers */}
      <div className="px-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-lg">Recomendado por tus seguidores</h2>
          <Button variant="link" className="text-sm p-0 h-auto">Ver todos</Button>
        </div>
        
        <div className="space-y-4">
          {popularPlaces.slice(0, 2).map((place) => (
            <Card key={place.id} className="overflow-hidden">
              <div className="flex">
                <div className="relative h-24 w-24 flex-shrink-0">
                  <Image
                    src={place.image}
                    alt={place.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3 flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{place.name}</h3>
                    <Badge variant="outline" className="h-6">
                      {place.distance}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{place.rating}</span>
                    <span className="text-xs text-gray-500">({place.reviewCount})</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1">
                    <div className="relative h-5 w-5 rounded-full overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=50&width=50&query=profile%20avatar"
                        alt="User avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs text-gray-500">Recomendado por <span className="font-medium">{place.lensHandle}</span></span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}