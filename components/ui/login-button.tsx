"use client"
import React from 'react'
import { useLogged, useSession, useSessionClient } from '../session-provider'
import { Button } from './button'
import { getAccount, loginAsOwner } from '@/lib/lens/login'
import { useAccount, useConnect, useSignMessage, useWalletClient } from 'wagmi'
import { client } from '@/lib/lens/client'
import { APP_ID } from '@/config/lens'
import { handleOperationWith, signMessageWith } from "@lens-protocol/client/viem";
import { addAppSigners } from '@lens-protocol/client/actions'
import { evmAddress } from '@lens-protocol/client'
export default function LoginButton() {

  const { setSessionClient} = useSession()
  const isLogged = useLogged()
  const acc = useAccount()
 const wc = useWalletClient()
    const { connect, connectors } = useConnect()
  const handleLogin = async ()=>{ 
    
    if(acc.address){
      let walletResults = []
      for(const conn of connectors){
        const walletResult = await new Promise<{ connected: boolean, address:string, args:any[] }>((resolve, reject)=>{
            connect({ connector: connectors[0]},{ onSuccess: (data, variables)=>{
                resolve({ connected: true, args:[data, variables], address: data.accounts[0]})
            }, onError: (...args)=>reject({ connected: false, args}) })
        }).catch(err=>console.log(err))
        walletResults.push(walletResult)
    }
    console.log(walletResults)
    let wr = walletResults.find(wr=>wr?.connected)
      if(wc.data){
        // const authenticated = await client.login({
        //         accountOn: {
        //           //app: APP_ID ,
        //           //wallet: wc.data.account?.address,
        //           //address: account,
        //           address: evmAddress(wc.data.account?.address),
        //         },
        //         signMessage: (...args)=>{
        //             console.log('signing message', args)
        //             return signMessageWith(wc.data)(...args); 
        //         },
        //       });
              
        //       if (authenticated.isErr()) {
        //         return console.error(authenticated.error);
        //       }
        //       //const walletClient = getWalletClient();
        //       // SessionClient: { ... }
        //       const sessionClient = authenticated.value;
        //       if(sessionClient && sessionClient.isSessionClient()){
        //           const result = await addAppSigners(sessionClient as any, {
        //             app: evmAddress(APP_ID),
        //             signers: [evmAddress(wr.address)],
        //           })
        //             .andThen(handleOperationWith(wc.data))
        //             .andThen(sessionClient.waitForTransaction);

        //             console.log('result', result)
                  // const account = await getAccount(wr,sessionClient as any)
                  // console.log('Acc ', account)
                  const session = await loginAsOwner(wc.data.account, wc.data)
                  if(session){
                    setSessionClient(session as any)
                  }
                  
            // }
      }
        
      // if(!walletResult.connected){
      //     return false
      // }
    }
    
  }
  
  return <>
    { !!acc.address && !isLogged && <Button onClick={handleLogin}>Login</Button> }
  </>
}
