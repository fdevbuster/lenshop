"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, Trophy, Clock, MessageSquare, Settings, ExternalLink } from "lucide-react"
import EditableItem from "@/components/editable-item"
import { useSaveTasks } from "@/lib/lens/save-item-task"
import { useSession } from "@/components/session-provider"

// Mock data for user profile
const userProfile = {
  name: "Usuario Weegitb3",
  lensHandle: "usuario.lens",
  walletAddress: "0x1a2...3b4c",
  bio: "Explorador de lugares Web3 en Barcelona",
  level: 3,
  points: 250,
  missionsCompleted: 5,
  placesVisited: 12,
  followers: 48,
  following: 32,
  avatar: "/placeholder-user.jpg",
  coverImage: "/placeholder.jpg",
}

// Mock data for user activity
const userActivity = [
  {
    id: "1",
    type: "check-in",
    place: "Café Blockchain",
    date: "Hoy, 10:30",
    image: "/coffee-shop-logo.png",
  },
  {
    id: "2",
    type: "mission-completed",
    mission: "Explorador de cafeterías",
    date: "Ayer, 18:45",
    reward: "NFT Explorador Nivel 1",
    image: "/placeholder.svg?height=100&width=100&query=coffee%20explorer%20badge",
  },
  {
    id: "3",
    type: "check-in",
    place: "NFT Gallery",
    date: "Hace 2 días, 14:20",
    image: "/placeholder-logo.png",
  },
]

// Mock data for user rewards
const userRewards = [
  {
    id: "1",
    name: "Explorador de cafeterías",
    description: "Visita 3 cafeterías diferentes",
    image: "/placeholder.svg?height=100&width=100&query=coffee%20explorer%20badge",
    date: "Obtenido hace 1 día",
  },
  {
    id: "2",
    name: "Primera visita",
    description: "Primer check-in en la app",
    image: "/placeholder.svg?height=100&width=100&query=first%20visit%20badge",
    date: "Obtenido hace 1 semana",
  },
  {
    id: "3",
    name: "Descuento 10%",
    description: "Café Blockchain - Válido hasta 30/06",
    image: "/placeholder.svg?height=100&width=100&query=discount%20coupon",
    date: "Obtenido hace 3 días",
  },
]

export default function ProfilePage() {

  const getSaveTask = useSaveTasks()
  const { account } = useSession()

  const metadata = account?.metadata

  console.log('account meta', metadata)
  return (
    <div className="pb-20">
      {/* Header with cover image */}
      <EditableItem type="image" pos={[10,10]} initialValue={null} saveTask={getSaveTask('coverPicture')}>
        <div className="relative h-40 w-full">
          <Image
            src={metadata?.coverPicture}
            alt="Cover image"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
      </EditableItem>
      

      {/* Profile info */}
      <div className="relative px-4 pb-4 -mt-16">
        <div className="flex justify-between">
        <EditableItem type={'image'} initialValue={null}  saveTask={getSaveTask('picture')}>
          <div className="relative h-24 w-24 rounded-full border-4 border-white dark:border-gray-900 overflow-hidden">
          
            <Image
              src={metadata?.picture}
              alt={metadata?.name}
              fill
              className="object-cover"
            />
            
            
          </div>
          </EditableItem>
          {/* <Button variant="outline" size="sm" className="mt-16 flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span>Editar</span>
          </Button> */}
        </div>

        <div className="mt-2">
          <EditableItem type="text" initialValue={metadata?.name}  saveTask={getSaveTask('name')}> 
          <h1 className="text-xl font-bold">{metadata?.name}</h1>
          </EditableItem>
     
          <p className="text-sm text-gray-500 dark:text-gray-400">{userProfile.lensHandle}</p>
          <EditableItem type="text" initialValue={metadata?.bio}  saveTask={getSaveTask('userBio')}>
            <p className="mt-1 text-sm">{metadata?.bio}</p>
          </EditableItem>
          

          <div className="mt-3 flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Wallet className="h-3 w-3" />
              <span className="text-xs">{userProfile.walletAddress}</span>
              <ExternalLink className="h-3 w-3 ml-1" />
            </Badge>
          </div>

          <div className="mt-4 flex justify-between">
            <div className="text-center">
              <p className="font-bold">{userProfile.placesVisited}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Lugares</p>
            </div>
            <div className="text-center">
              <p className="font-bold">{userProfile.followers}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Seguidores</p>
            </div>
            <div className="text-center">
              <p className="font-bold">{userProfile.following}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Siguiendo</p>
            </div>
            <div className="text-center">
              <p className="font-bold">{userProfile.points}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Puntos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="activity" className="w-full">
        <div className="border-b dark:border-gray-800">
          <TabsList className="w-full justify-start px-4 h-12">
            <TabsTrigger value="activity" className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none">
              Actividad
            </TabsTrigger>
            <TabsTrigger value="rewards" className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none">
              Recompensas
            </TabsTrigger>
            <TabsTrigger value="wallet" className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none">
              Wallet
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Activity Tab */}
        <TabsContent value="activity" className="p-4 space-y-4">
          {userActivity.map((activity) => (
            <Card key={activity.id} className="p-4">
              <div className="flex gap-3">
                <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Image
                    src={activity.image}
                    alt={(activity.type === 'check-in' ? activity.place : activity.mission) ?? ''}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  {activity.type === 'check-in' ? (
                    <>
                      <p className="font-medium">Check-in en {activity.place}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{activity.date}</p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium">Completaste la misión: {activity.mission}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{activity.date}</p>
                      <Badge variant="outline" className="mt-1 flex items-center gap-1 w-fit">
                        <Trophy className="h-3 w-3" />
                        <span className="text-xs">{activity.reward}</span>
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {userRewards.map((reward) => (
              <Card key={reward.id} className="p-4">
                <div className="flex flex-col items-center text-center">
                  <div className="relative h-20 w-20 mb-2">
                    <Image
                      src={reward.image}
                      alt={reward.name}
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="font-medium text-sm">{reward.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{reward.description}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{reward.date}</p>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Wallet Tab */}
        <TabsContent value="wallet" className="p-4">
          <Card className="p-4">
            <div className="flex flex-col items-center justify-center py-6">
              <Wallet className="h-12 w-12 text-purple-500 mb-4" />
              <h3 className="font-bold text-lg">Wallet conectada</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{userProfile.walletAddress}</p>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">
                  Ver en Explorer
                </Button>
                <Button variant="destructive" size="sm">
                  Desconectar
                </Button>
              </div>
            </div>
          </Card>

          <div className="mt-6">
            <h3 className="font-bold mb-3">Tokens</h3>
            <Card className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <span className="font-bold text-purple-500">L</span>
                  </div>
                  <div>
                    <p className="font-medium">LENS</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Lens Protocol</p>
                  </div>
                </div>
                <p className="font-bold">25.5</p>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}