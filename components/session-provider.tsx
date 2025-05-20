"use client"
import { Context, evmAddress, SessionClient } from '@lens-protocol/client'
import React, { useEffect, useMemo } from 'react'
import LoginButton from './ui/login-button'
import LogoutButton from './ui/logout-button'
import SignupButton from './ui/signup-button'
import { ConnectKitButton } from "connectkit";
import { getClient } from '@/lib/lens/client'
import { currentSession, lastLoggedInAccount } from '@lens-protocol/client/actions'
export const SessionContext = React.createContext<{ sessionClient:SessionClient<Context>|undefined, 
    account: any, setAccount: (account:any)=>void,
    setSessionClient: (session:SessionClient<Context>|undefined)=>void, isLogged: boolean}>({ sessionClient: undefined, isLogged: false, setSessionClient: (sessionClient) => {}, account: {}, setAccount: (account:any)=>{} })


export default function SessionProvider({ children }: { children: React.ReactNode }) {

    const [sessionClient, setSessionClient] = React.useState<SessionClient>()
    const [account, setAccount] = React.useState<any>()
    const isLogged = !!(sessionClient && sessionClient.isSessionClient() && sessionClient.getAuthenticatedUser().isOk())


    useEffect(()=>{
        const load = async ()=>{
            const client = getClient()
            const resumed = await client.resumeSession();

            if (resumed.isErr()) {
            return console.error(resumed.error);
            }

            // SessionClient: { ... }
            const sessionClient = resumed.value;
            if(sessionClient.isSessionClient() && sessionClient.getAuthenticatedUser().isOk()){
                setSessionClient(sessionClient as any)
                const currSess = await currentSession(sessionClient as any);
               
                if (currSess.isErr()) {
                return console.error(currSess.error);
                }else{
                    console.log('Curr sess', currSess.value)
                    const lastAcc = await lastLoggedInAccount(sessionClient as any, {
                        address: evmAddress(currSess.value.signer),
                      });
                    if(lastAcc.isOk()){
                        console.log('last acc', lastAcc.value)
                        setAccount(lastAcc.value)
                    }
                      
                }
            }
                
        }
        load()
    },[])
  
    return <SessionContext.Provider value={{ sessionClient, isLogged, setSessionClient, account, setAccount }}>
        <div className="session-buttons">
            <LoginButton />
            <LogoutButton />
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