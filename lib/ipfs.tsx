"use client"
import React, { useContext, useEffect, useMemo } from "react"
import { useAccount } from "wagmi"
import { PinataSDK } from "pinata";
import { PINATA_GATEWAY, PINATA_JWT } from "@/config/pinata";
import { ThirdwebProvider, useActiveAccount } from "thirdweb/react";
import { isLoggedIn, login } from "./lens/login";
import { Context, SessionClient } from "@lens-protocol/client";
import { createImagePost } from "./lens/create-post";
//import { ThirdwebProvider } from "thirdweb/react";
// let jwt = process.env.PINATA_JWT
// let gwy = process.env.PINATA_GATEWAY 

// console.log('PINATA', jwt, gwy)
const pinata = new PinataSDK({
        pinataJwt: PINATA_JWT,
        pinataGateway: PINATA_GATEWAY
    });
export const IPFSContext = React.createContext<{ 
    publishImage: (metadata?: { [k:string]: any})=>Promise<any>,
    uploadFile: (file:File, metadata?: { [k:string]: any})=>Promise<any>,
    updateFile: (fileId:string, metadata?: { [k:string]: any})=>Promise<any>,
    canUpload: boolean 
}>({ uploadFile: (file:File)=>Promise.resolve(''), publishImage: (metadata)=>Promise.resolve(''), updateFile: (id)=>Promise.resolve(''), canUpload: false })

const IPFSCore = ({ children }:any)=>{


    const [sessionClient, setSessionClient] = React.useState<any>()

    const acc = useActiveAccount()
    const uploadFile = async (file:File, metadata?: { [k:string]:any})=>{

        if(!isLoggedIn()){
                await login(acc?.address as any).then((sessionClient)=>{
                    console.log(sessionClient)
                })
        }
        if(!acc?.address){
            return 
        }
        const groups = await pinata.groups.public.list().name(acc.address)
        const group = groups.groups.find(g=>g.name === acc.address)

        let groupId = group?.id
        if(!groupId){
             const group = await pinata.groups.public.create({
                name: acc.address,
            });
            groupId = group.id
        }
        let keyvals:any = {
            address: acc.address
        }

        if(metadata){
            Object.keys(metadata).forEach(k=>{
                keyvals[k] = metadata[k]
            })
        }

        const upload = await pinata.upload.public.file(file).group(groupId).keyvalues(keyvals)
        

        return upload
    }

    const updateFile = async (id:string, metadata?:{ [k:string]:any})=>{
        if(metadata)
        pinata.files.public.update({
          id,
          keyvalues: {
            ...metadata
          }
        })
    }

    const publishImage = async (metadata?:{ [k:string]:any})=>{
        if(sessionClient){
           const result = await createImagePost(sessionClient, metadata?.title, metadata?.fileName, metadata?.url, metadata?.description)
           console.log('post-result',result)
        }
    }
    const loggedIn = isLoggedIn()

    useEffect(()=>{

        if(!loggedIn){
    
            if(acc?.address){
                login(acc.address as any).then((sessionClient)=>{
                    console.log('sessionClient',sessionClient)
                    if(sessionClient){
                        setSessionClient(sessionClient)
                    }
                    
                })
            }
        }
    },[loggedIn, acc?.address])
    
    return /*<ThirdwebProvider>*/    <IPFSContext.Provider value={{ uploadFile, updateFile, publishImage, canUpload: !!acc?.address }}>
        { !loggedIn && 'Not logged in'}
        {children}
    </IPFSContext.Provider>
    /*</ThirdwebProvider> */
        
}

export const IPFS = ({ children }:any)=><ThirdwebProvider>
    <IPFSCore>
        {children}
    </IPFSCore>
</ThirdwebProvider>

export const useIpfs = ()=>useContext(IPFSContext)