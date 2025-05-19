"use client"

import { useSession, useSessionClient } from "@/components/session-provider"
import { SessionClient } from "@lens-protocol/client"
import { WalletClient } from "viem"
import { useWalletClient } from "wagmi"
import { getSaveMetaItem, saveBioTask } from "./save-metaitem"
import { SaveItemTask } from "@/components/editable-item"

export type SaveTaskType= 'userBio'|'name'|'coverPicture'|'picture'|''

export const getSaveTask = (type: SaveTaskType, setAccount: (acc:any)=>void, wc:WalletClient|undefined, sessionClient?:SessionClient):SaveItemTask=>{
    if(type == 'userBio'){
        if(!wc || !sessionClient){
            console.log('No session client or wallet client')
           return (value)=>Promise.resolve({ success: true }) 
        }else{

            return (value)=>{
                if(!sessionClient){
                    console.log('No session client')
                    return Promise.resolve({ success: true })
                }
                return saveBioTask(sessionClient, wc, value, setAccount)            
            }
        }

    }else if(type == 'name' || type == 'coverPicture' || type == 'picture'){
        if(!wc || !sessionClient){
            console.log('No session client or wallet client')   
        }else{
            return (value)=>{
                if(!sessionClient){
                    console.log('No session client')
                    return Promise.resolve({ success: true })
                }
                const saveTask = getSaveMetaItem(type)
                return saveTask(sessionClient, wc, value, setAccount)            
            }
        }
    }

    return (value)=>Promise.resolve({ success: true })
}


export const useSaveTasks = ()=>{
    const wc = useWalletClient()
    const sessionClient = useSessionClient()
    const { setAccount } = useSession() as any

    const saveTaskByType = (type:SaveTaskType)=>getSaveTask(type,setAccount, wc.data, sessionClient as any)
    return saveTaskByType
}