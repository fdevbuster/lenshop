"use client"

import { Sparkles } from "lucide-react"

interface BonsaiSmartPostProps {
  memeData: {
    name: string
    symbol: string
    description: string
    imageUrl: string
    initialPrice: number
    slope: number
  }
}

export function BonsaiSmartPost({ memeData }: BonsaiSmartPostProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 flex items-center justify-between">
        <div className="flex items-center">
          <Sparkles className="h-5 w-5 text-white mr-2" />
          <span className="font-medium text-white">Bonsai Smart Post</span>
        </div>
        <div className="text-xs bg-white/20 rounded-full px-2 py-0.5 text-white">Powered by Lens</div>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/3">
            <img
              src={memeData.imageUrl || "/placeholder.svg?height=200&width=200&query=meme%20preview"}
              alt="Meme preview"
              className="w-full aspect-square object-contain rounded-lg border"
            />
          </div>

          <div className="w-full sm:w-2/3 space-y-3">
            <div>
              <h3 className="font-bold text-lg">{memeData.name || "Meme Name"}</h3>
              <p className="text-sm font-medium">${memeData.symbol || "SYMBOL"}</p>
            </div>

            <p className="text-sm text-muted-foreground">{memeData.description || "No description provided"}</p>

            <div className="bg-muted p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm">Initial Price:</span>
                <span className="font-medium">{memeData.initialPrice.toFixed(4)} ETH</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm">Curve Type:</span>
                <span className="font-medium">Linear ({memeData.slope.toFixed(2)})</span>
              </div>
            </div>

            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg p-3 text-center cursor-pointer"
             
            >
              <Sparkles className="inline-block mr-2 h-4 w-4" />
              Collect Now
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
