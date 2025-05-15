"use client"
import React from 'react'
import { useLogged, useSessionClient } from '../session-provider'
import { useAccount } from 'wagmi'
import { Button } from './button'

export default function LogoutButton() {
 const isLogged = useLogged()
   const acc = useAccount()
 
   const sessionClient = useSessionClient()
   const handleLogout = ()=>{
    if(sessionClient){
     sessionClient.logout()
    }
   }
   
   return <>
     { acc.address && isLogged && <Button onClick={handleLogout}>Login</Button> }
   </>
 }
 