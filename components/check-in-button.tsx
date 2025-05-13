"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface CheckInButtonProps {
  placeId: string
}

export default function CheckInButton({ placeId }: CheckInButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleCheckIn = async () => {
    setIsLoading(true)

    // Simular verificación de ubicación y minteo de NFT
    setTimeout(() => {
      setIsLoading(false)
      setIsCheckedIn(true)

      toast({
        title: "¡Check-in exitoso!",
        description: "Has recibido un NFT como prueba de tu visita.",
      })

      // Cerrar el diálogo después de un momento
      setTimeout(() => {
        setIsDialogOpen(false)
      }, 2000)
    }, 2000)
  }

  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
      >
        <MapPin className="h-4 w-4 mr-1" />
        Check-in
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Check-in en este lugar</DialogTitle>
            <DialogDescription>
              Haz check-in para recibir un NFT como prueba de tu visita y desbloquear recompensas.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center py-4">
            {isCheckedIn ? (
              <>
                <div className="relative w-40 h-40 mb-4">
                  <Image src="/placeholder.svg?key=4ixf3" alt="Check-in NFT" fill className="object-contain" />
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-green-500 mb-2">
                    <Check className="h-5 w-5" />
                    <span className="font-medium">¡Check-in completado!</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Este NFT se ha añadido a tu colección. Vuelve pronto para subir de nivel.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="relative w-40 h-40 mb-4 opacity-70">
                  <Image src="/placeholder.svg?key=cox8s" alt="Check-in NFT Preview" fill className="object-contain" />
                </div>
                <p className="text-sm text-center text-gray-500 mb-4">
                  Debes estar físicamente en el lugar para hacer check-in. Esto mintea un NFT como prueba de tu visita.
                </p>
              </>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-2">
            {!isCheckedIn && (
              <Button
                onClick={handleCheckIn}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    <span>Verificando ubicación...</span>
                  </div>
                ) : (
                  <span>Hacer Check-in</span>
                )}
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full">
              {isCheckedIn ? "Cerrar" : "Cancelar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
