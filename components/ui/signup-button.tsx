import React, { useMemo } from 'react'
import { useLogged, useSession, useSessionClient } from '../session-provider'
import { Button } from './button'
import { useAccount, useConnect, useWalletClient } from 'wagmi'
import { createAccount, MainUserData } from '@/lib/lens/create-account'
import { createAccountWithUsername } from '@lens-protocol/client/actions'
import { createUserFromWallet, loginAsOwner } from '@/lib/lens/login'
import { MetadataAttributeType } from '@lens-protocol/metadata'
import { signer } from '@/lib/lens/signer'

export default function SignupButton() {

    const [mainUserData, setMainUserData] = React.useState<MainUserData>({
        name: '', bio: '', userName: '', attributes:[
            { key: 'account-type', type: MetadataAttributeType.STRING, value: 'business' },
        ]
    })
    const [openForm, setOpenForm] = React.useState(false)
    const acc = useAccount()
    const sessionClient = useSessionClient()
    const { setSessionClient } = useSession()
    const isLogged = useLogged()
    const wacc = useAccount()
    const wc = useWalletClient()
    const { connect, connectors } = useConnect()

    const handleSignUpProceed = async () => {
        let address= acc.address
        console.log(connectors)
        //if(!address){
            const walletResults = []
            for(const conn of connectors.slice(1)){
                const walletResult = await new Promise<{ connected: boolean, address:string, args:any[] }>((resolve, reject)=>{
                    connect({ connector: conn},{ onSuccess: (data, variables)=>{
                        resolve({ connected: true, args:[data, variables], address: data.accounts[0]})
                    }, onError: (...args)=>reject({ connected: false, args}) })
                }).catch(err=>console.log(err))
                walletResults.push(walletResult)
            }
            console.log(walletResults)
            // if(!walletResult.connected){
            //     return false
            // }
            address = walletResults.find(wr=>wr?.connected)?.address
        //}

        if(!wc.data || !mainUserData || !address){
            return false
        }
        createUserFromWallet(wc.data,signer.address as `0x${string}`,mainUserData).then(result=>{
            //createUserFromWallet(wc.data,address as `0x${string}`,mainUserData).then(result=>{
            console.log('result', result)
            setSessionClient(result as any)
            setOpenForm(false)
           // loginAsOwner(acc)
        })

        
    }


    
    return <>
        { !isLogged && <>
            <Button onClick={()=>setOpenForm(true)}>Sign up</Button> 
            {openForm && <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center">
                <div className="bg-white p-4 rounded">
                    <h2>Sign up</h2>
                    <input type="text" required placeholder="Username" onChange={(e)=>setMainUserData({ ...mainUserData, userName: e.target.value })} />
                    <input type="text" required placeholder="Name" onChange={(e)=>setMainUserData({ ...mainUserData, name: e.target.value })} />
                    <input type="text" placeholder="Bio" onChange={(e)=>setMainUserData({ ...mainUserData, bio: e.target.value })} />
                    <Button onClick={handleSignUpProceed}>Proceed</Button>
                </div></div>}
        </>}
    </>       
    
}
