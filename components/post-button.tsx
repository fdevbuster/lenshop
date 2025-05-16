"use client"
import React from 'react'
import { Button } from './ui/button'
import { PlusCircle } from 'lucide-react'
import { CreateMemeModal } from './create-meme-modal'
import { ConnectButton, useActiveAccount, useConnect } from 'thirdweb/react'
import { createWallet } from 'thirdweb/wallets'
import { twclient } from '@/lib/bonsai'

export default function PostButton() {
    const [isOpen, setIsOpen] = React.useState(false)

    const acc = useActiveAccount()
    const { connect } = useConnect()

   

    const handlePostButton = ()=>{
        setIsOpen(true)   
    }
  return (
    <>
   <Button
    onClick={()=>handlePostButton()}
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
    >
        <PlusCircle className="h-6 w-6" />
    </Button> 
    { isOpen && <CreateMemeModal onClose={function (): void {
              setIsOpen(false)
          } } /> }
    </>
  )
}
