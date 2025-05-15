"use client"
import { Context, SessionClient } from '@lens-protocol/client'
import React, { useMemo } from 'react'
import LoginButton from './ui/login-button'
import LogoutButton from './ui/logout-button'
import SignupButton from './ui/signup-button'

export const SessionContext = React.createContext<{ sessionClient:SessionClient<Context>|undefined, setSessionClient: (session:SessionClient<Context>|undefined)=>void, isLogged: boolean}>({ sessionClient: undefined, isLogged: false, setSessionClient: (sessionClient) => {} })


export default function SessionProvider({ children }: { children: React.ReactNode }) {

    const [sessionClient, setSessionClient] = React.useState<SessionClient>()
    const isLogged = useMemo(()=>{

        console.log('isLogged', sessionClient)
        if(sessionClient){
            
            return sessionClient.isSessionClient() && sessionClient.getAuthenticatedUser().isOk()
        }else{
            return false
        }
     
        
    }, [sessionClient])
  
    return <SessionContext.Provider value={{ sessionClient, isLogged, setSessionClient }}>
        <div className="session-buttons">
            <LoginButton />
            <LogoutButton />
            <SignupButton />
        </div>
        {children}

    </SessionContext.Provider>
}



export function useSessionClient() {
    const { sessionClient } = React.useContext(SessionContext)
    return sessionClient
}

export function useSession() {
    const session = React.useContext(SessionContext)
    return session
}

export function useLogged() {
    const { isLogged } = React.useContext(SessionContext)
    return isLogged
}