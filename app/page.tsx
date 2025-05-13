import MapView from "@/components/map-view"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"

export default function Home() {
  return (
    <div className="relative h-screen w-full">
      <MapView />

      {/* Search and Filter Overlay */}
      <div className="absolute top-4 left-0 right-0 px-4 z-30">
        <div className="bg-white dark:bg-gray-900 rounded-full shadow-lg p-2 flex items-center">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search className="h-5 w-5" />
          </Button>
          <input
            type="text"
            placeholder="Buscar lugares cerca..."
            className="flex-1 bg-transparent border-none focus:outline-none px-2"
          />
          <Button variant="ghost" size="icon" className="rounded-full">
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="absolute top-20 left-0 right-0 px-4 z-30 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <Button variant="outline" size="sm" className="rounded-full bg-white/80 dark:bg-gray-800/80 whitespace-nowrap">
          Mis suscriptores recomiendan
        </Button>
        <Button variant="outline" size="sm" className="rounded-full bg-white/80 dark:bg-gray-800/80 whitespace-nowrap">
          Eventos Web3 cerca
        </Button>
        <Button variant="outline" size="sm" className="rounded-full bg-white/80 dark:bg-gray-800/80 whitespace-nowrap">
          Negocios con recompensas
        </Button>
      </div>
    </div>
  )
}
