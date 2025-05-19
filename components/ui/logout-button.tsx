"use client"
import React from 'react'
import { useLogged, useSession, useSessionClient } from '../session-provider'
import { useAccount } from 'wagmi'
import { Button } from './button'

export default function LogoutButton() {
 const isLogged = useLogged()
   const acc = useAccount()
 
   const sessionClient = useSessionClient()
   const { setSessionClient } = useSession()
   const handleLogout = ()=>{
    if(sessionClient){
     sessionClient.logout()
     setSessionClient(undefined)
    }
   }
   
   return <>
     { acc.address && isLogged && <Button onClick={handleLogout}>Logout</Button> }
   </>
 }
 