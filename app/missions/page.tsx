import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Trophy, MapPin, Clock } from "lucide-react"
import Image from "next/image"

// En una implementación real, estos datos vendrían de una API
const getMockMissions = () => {
  return [
    {
      id: "mission1",
      title: "Explorador de cafeterías",
      description: "Visita 3 cafeterías diferentes en el Born",
      progress: 2,
      total: 3,
      reward: "NFT Explorador Nivel 1",
      rewardImage: "/placeholder.svg?height=100&width=100&query=coffee%20explorer%20badge",
      expiresAt: "2023-07-15T23:59:59Z",
      places: [
        { id: "1", name: "Café Blockchain", completed: true },
        { id: "2", name: "Crypto Coffee", completed: true },
        { id: "3", name: "Web3 Café", completed: false },
      ],
    },
    {
      id: "mission2",
      title: "Amante del arte",
      description: "Visita 2 galerías de arte en una semana",
      progress: 1,
      total: 2,
      reward: "50 puntos de reputación",
      rewardImage: "/placeholder.svg?height=100&width=100&query=art%20lover%20badge",
      expiresAt: "2023-06-30T23:59:59Z",
      places: [
        { id: "4", name: "NFT Gallery", completed: true },
        { id: "5", name: "Crypto Art Space", completed: false },
      ],
    },
    {
      id: "mission3",
      title: "Networker Web3",
      description: "Asiste a 3 eventos en espacios de coworking",
      progress: 0,
      total: 3,
      reward: "NFT Networker + 10% descuento",
      rewardImage: "/placeholder.svg?height=100&width=100&query=web3%20networker%20badge",
      expiresAt: "2023-07-20T23:59:59Z",
      places: [
        { id: "6", name: "Web3 Coworking", completed: false },
        { id: "7", name: "Blockchain Hub", completed: false },
        { id: "8", name: "Crypto Space", completed: false },
      ],
    },
  ]
}

export default function MissionsPage() {
  const missions = getMockMissions()

  return (
    <div className="pb-20">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 p-4 border-b dark:border-gray-800">
        <h1 className="text-xl font-bold">Misiones</h1>
      </div>

      {/* User Stats */}
      <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 rounded-full border-2 border-white overflow-hidden">
            <Image
              src="/placeholder.svg?height=100&width=100&query=profile%20avatar%20web3"
              alt="User avatar"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-bold text-lg">Nivel 3</h2>
            <p className="text-sm opacity-90">5 misiones completadas</p>
            <div className="mt-1 flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span className="text-sm">250 puntos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Missions */}
      <div className="p-4">
        <h2 className="font-bold text-lg mb-4">Misiones activas</h2>

        {missions.map((mission) => (
          <div key={mission.id} className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold">{mission.title}</h3>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span className="text-xs">
                    {new Date(mission.expiresAt) > new Date()
                      ? `${Math.ceil((new Date(mission.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} días`
                      : "Expirado"}
                  </span>
                </Badge>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{mission.description}</p>

              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>
                    Progreso: {mission.progress}/{mission.total}
                  </span>
                  <span>{Math.round((mission.progress / mission.total) * 100)}%</span>
                </div>
                <Progress value={(mission.progress / mission.total) * 100} className="h-2" />
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="relative h-10 w-10">
                    <Image
                      src={mission.rewardImage || "/placeholder.svg"}
                      alt={mission.reward}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Recompensa</div>
                    <div className="text-sm font-medium">{mission.reward}</div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={mission.progress < mission.total}
                  className={
                    mission.progress >= mission.total
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none"
                      : ""
                  }
                >
                  {mission.progress >= mission.total ? "Reclamar" : "En progreso"}
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-4 border-t dark:border-gray-700">
              <div className="text-xs font-medium mb-2">Lugares para visitar:</div>
              <div className="space-y-2">
                {mission.places.map((place) => (
                  <div key={place.id} className="flex items-center gap-2">
                    <div
                      className={`h-4 w-4 rounded-full flex items-center justify-center ${place.completed ? "bg-green-500" : "border border-gray-300 dark:border-gray-600"}`}
                    >
                      {place.completed && (
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm ${place.completed ? "line-through text-gray-500" : ""}`}>
                      {place.name}
                    </span>
                    <Button variant="ghost" size="sm" className="ml-auto h-6 text-xs">
                      <MapPin className="h-3 w-3 mr-1" />
                      Ver
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
