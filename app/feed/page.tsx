"use client"
import { Button } from "@/components/ui/button"
import PostCard from "@/components/post-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PostButton from "@/components/post-button"
import { useFeedItems } from "@/lib/ipfs"

// En una implementación real, estos datos vendrían de una API
const getMockFeed = () => {
  return [
    {
      id: "post1",
      content:
        "Acabo de descubrir este café increíble. Tienen los mejores croissants de la ciudad y un ambiente perfecto para trabajar.",
      image: "/cozy-coffee-shop.png",
      timestamp: "2023-06-15T10:30:00Z",
      likes: 42,
      comments: 8,
      author: {
        name: "María García",
        handle: "maria.lens",
        avatar: "/woman-profile.png",
      },
      place: {
        id: "1",
        name: "Café Blockchain",
        handle: "cafeblockchain.lens",
      },
    },
    {
      id: "post2",
      content:
        "Evento de NFT Art increíble en esta galería. Si estáis por la zona, no os lo perdáis. Estaré aquí hasta las 20h.",
      image: "/placeholder.svg?key=wwbsg",
      timestamp: "2023-06-14T16:45:00Z",
      likes: 28,
      comments: 5,
      author: {
        name: "Carlos Pérez",
        handle: "crypto_carlos.lens",
        avatar: "/placeholder.svg?height=50&width=50&query=man%20profile%20with%20glasses",
      },
      place: {
        id: "2",
        name: "NFT Gallery",
        handle: "nftgallery.lens",
      },
    },
    {
      id: "post3",
      content:
        "Trabajando desde este coworking hoy. Tienen las mejores instalaciones y la comunidad web3 es increíble.",
      image: "/placeholder.svg?height=300&width=400&query=modern%20coworking%20space",
      timestamp: "2023-06-13T09:15:00Z",
      likes: 35,
      comments: 3,
      author: {
        name: "Laura Martínez",
        handle: "laura.lens",
        avatar: "/placeholder.svg?height=50&width=50&query=woman%20profile%20professional",
      },
      place: {
        id: "3",
        name: "Web3 Coworking",
        handle: "web3space.lens",
      },
    },
  ]
}

export default function FeedPage() {
  
  const feed = useFeedItems()
  
  //console.log('feed', feed)

  return (
    <div className="pb-20">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 p-4 border-b dark:border-gray-800">
        <h1 className="text-xl font-bold">Feed</h1>
      </div>

      <Tabs defaultValue="following" className="w-full">
        <TabsList className="grid grid-cols-2 mx-4 mt-2">
          <TabsTrigger value="following">Siguiendo</TabsTrigger>
          <TabsTrigger value="trending">Tendencias</TabsTrigger>
        </TabsList>

        <TabsContent value="following" className="px-4 mt-4">
          {feed.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </TabsContent>

        <TabsContent value="trending" className="px-4 mt-4">
          <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
            <p>Aquí verás los posts más populares de lugares cercanos.</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-4">
        <PostButton />
      </div>
    </div>
  )
}
