import { ArrowLeft, MapPin, Calendar, Users, Gift } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CheckInButton from "@/components/check-in-button"
import PostCard from "@/components/post-card"

// En una implementación real, estos datos vendrían de una API
const getMockPlace = (id: string) => {
  return {
    id,
    name: "Café Blockchain",
    lensHandle: "cafeblockchain.lens",
    avatar: "/coffee-shop-logo.png",
    coverImage: "/modern-coffee-shop.png",
    address: "Carrer de València 123, Barcelona",
    description:
      "Café especializado con eventos Web3 semanales. Aceptamos crypto y tenemos NFTs exclusivos para clientes habituales.",
    category: "café",
    hasRewards: true,
    posts: [
      {
        id: "post1",
        content: "Nuevo menú de verano disponible ahora. ¡Ven a probarlo!",
        image: "/placeholder.svg?key=50gm4",
        timestamp: "2023-06-15T10:30:00Z",
        likes: 24,
        comments: 5,
      },
      {
        id: "post2",
        content: "Evento de NFT Art este viernes a las 19h. Entrada libre con consumición.",
        image: "/placeholder.svg?key=ssaks",
        timestamp: "2023-06-10T16:45:00Z",
        likes: 42,
        comments: 12,
      },
    ],
    recommendations: [
      {
        id: "rec1",
        userHandle: "maria.lens",
        userAvatar: "/woman-profile.png",
        content: "El mejor café de especialidad de la zona. Los croissants son increíbles.",
        timestamp: "2023-06-12T09:15:00Z",
        likes: 18,
      },
      {
        id: "rec2",
        userHandle: "crypto_juan.lens",
        userAvatar: "/man-profile.png",
        content: "Ambiente perfecto para trabajar. WiFi rápido y enchufes en todas las mesas.",
        timestamp: "2023-06-08T14:20:00Z",
        likes: 15,
      },
    ],
    events: [
      {
        id: "event1",
        title: "Workshop: Introducción a Web3",
        date: "2023-06-20T18:00:00Z",
        attendees: 15,
      },
      {
        id: "event2",
        title: "Cata de cafés de especialidad",
        date: "2023-06-25T11:00:00Z",
        attendees: 8,
      },
    ],
  }
}

export default function PlacePage({ params }: { params: { id: string } }) {
  const place = getMockPlace(params.id)

  return (
    <div className="pb-20">
      {/* Cover Image */}
      <div className="relative h-48 w-full">
        <Image src={place.coverImage || "/placeholder.svg"} alt={place.name} fill className="object-cover" />
        <Link href="/" className="absolute top-4 left-4 bg-black/30 rounded-full p-2">
          <ArrowLeft className="h-5 w-5 text-white" />
        </Link>
      </div>

      {/* Place Info */}
      <div className="relative px-4 pb-4">
        <div className="flex justify-between items-end -mt-10">
          <div className="relative h-20 w-20 rounded-full border-4 border-white dark:border-gray-900 overflow-hidden bg-white">
            <Image src={place.avatar || "/placeholder.svg"} alt={place.name} fill className="object-cover" />
          </div>
          <CheckInButton placeId={place.id} />
        </div>

        <div className="mt-2">
          <h1 className="text-2xl font-bold">{place.name}</h1>
          <div className="text-sm text-gray-500 dark:text-gray-400">{place.lensHandle}</div>

          <div className="flex items-center gap-1 mt-1 text-sm text-gray-600 dark:text-gray-300">
            <MapPin className="h-4 w-4" />
            <span>{place.address}</span>
          </div>

          <div className="flex gap-2 mt-2">
            <Badge variant="outline">{place.category}</Badge>
            {place.hasRewards && (
              <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                Recompensas
              </Badge>
            )}
          </div>

          <p className="mt-3 text-sm">{place.description}</p>

          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" className="flex gap-1">
              <Users className="h-4 w-4" />
              <span>Seguir</span>
            </Button>
            <Button variant="outline" size="sm" className="flex gap-1">
              <Gift className="h-4 w-4" />
              <span>Recompensas</span>
            </Button>
            <Button variant="outline" size="sm" className="flex gap-1">
              <Calendar className="h-4 w-4" />
              <span>Eventos</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid grid-cols-3 mx-4">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="px-4 mt-4">
          {place.posts.map((post) => (
            <PostCard
              key={post.id}
              post={{
                id: post.id,
                content: post.content,
                image: post.image,
                timestamp: post.timestamp,
                likes: post.likes,
                comments: post.comments,
                author: {
                  name: place.name,
                  handle: place.lensHandle,
                  avatar: place.avatar,
                },
              }}
            />
          ))}
        </TabsContent>

        <TabsContent value="recommendations" className="px-4 mt-4">
          {place.recommendations.map((rec) => (
            <div key={rec.id} className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="relative h-8 w-8 rounded-full overflow-hidden">
                  <Image
                    src={rec.userAvatar || "/placeholder.svg"}
                    alt={rec.userHandle}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-medium">{rec.userHandle}</div>
                  <div className="text-xs text-gray-500">{new Date(rec.timestamp).toLocaleDateString()}</div>
                </div>
              </div>
              <p className="text-sm">{rec.content}</p>
              <div className="mt-2 text-xs text-gray-500">{rec.likes} me gusta</div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="events" className="px-4 mt-4">
          {place.events.map((event) => (
            <div key={event.id} className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h3 className="font-medium">{event.title}</h3>
              <div className="flex items-center gap-1 mt-1 text-sm text-gray-600 dark:text-gray-300">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(event.date).toLocaleDateString()} -{" "}
                  {new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-sm text-gray-600 dark:text-gray-300">
                <Users className="h-4 w-4" />
                <span>{event.attendees} asistentes</span>
              </div>
              <Button variant="outline" size="sm" className="mt-2 w-full">
                Asistir
              </Button>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
