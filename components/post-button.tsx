"use client"
import React, { useState } from 'react'
import { Button } from './ui/button'
import { PlusCircle } from 'lucide-react'
import { CreateMemeModal } from './create-meme-modal'
import { ConnectButton, useActiveAccount, useConnect } from 'thirdweb/react'
import { createWallet } from 'thirdweb/wallets'
import { twclient } from '@/lib/bonsai'
import { useLogged } from './session-provider'
import { Modal } from './ui/modal'
import LoginButton from './ui/login-button'
import SignupButton from './ui/signup-button'

export default function PostButton() {
    const [sessionModal, setSessionModalOpen] = useState<any>(false)
    const [isOpen, setIsOpen] = React.useState(false)


    const loggedIn = useLogged()

    const handlePostButton = ()=>{
        if(!loggedIn){
            setSessionModalOpen(true)
            return
        }else{
          setIsOpen(true)   
        }
        
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
    { !loggedIn && sessionModal && <Modal onClose={() => setSessionModalOpen(false)} title="Connect your wallet" >
                <LoginButton />
                <SignupButton />
            </Modal> }
    { isOpen && loggedIn && <CreateMemeModal onClose={function (): void {
              setIsOpen(false)
          } } /> }
    </>
  )
}
