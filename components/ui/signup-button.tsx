import React, { useMemo } from 'react'
import { useLogged, useSession, useSessionClient } from '../session-provider'
import { Button } from './button'
import { Connector, useAccount, useConnect, useWalletClient } from 'wagmi'
import { createAccount, MainUserData } from '@/lib/lens/create-account'
import { createAccountWithUsername } from '@lens-protocol/client/actions'
import { createUserFromWallet, loginAsOwner } from '@/lib/lens/login'
import { MetadataAttributeType } from '@lens-protocol/metadata'
import { signer } from '@/lib/lens/signer'
import { Modal } from './modal'

export default function SignupButton() {

    const [mainUserData, setMainUserData] = React.useState<MainUserData>({
        name: '', bio: '', userName: '', attributes:[
            { key: 'account-type', type: MetadataAttributeType.STRING, value: 'business' },
        ]
    })
      const [isModalOpen, setModalOpen] = React.useState(false);
      const [selectedConnector, setSelectedConnector] = React.useState<Connector>();
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
        if(!selectedConnector){
            return 

        }
        //console.log(connectors)
        try{
            selectedConnector.disconnect()
        }catch{

        }
        
        
            const walletResult = await new Promise<{ connected: boolean, address:string, args:any[] }>((resolve, reject)=>{
                connect({ connector: selectedConnector},{ onSuccess: (data, variables)=>{
                    resolve({ connected: true, args:[data, variables], address: data.accounts[0]})
                }, onError: (...args)=>reject({ connected: false, args}) })
            }).catch(err=>console.log(err))
            
        address = walletResult?.address;

           
        
        //if(!address){
            if(!mainUserData || !address || !wc.data){
                return false
            }
        createUserFromWallet(wc.data,address as `0x${string}`,mainUserData).then(result=>{
            //createUserFromWallet(wc.data,address as `0x${string}`,mainUserData).then(result=>{
            console.log('result', result)
            setSessionClient(result as any)
            setOpenForm(false)
           // loginAsOwner(acc)
        })

        
    }


    
    return <>
          {isModalOpen && (
                <Modal onClose={() => setModalOpen(false)}>
                  <h2>Choose Wallet Connector</h2>
                  <ul>
                    {connectors.map((connector) => (
                      <li key={connector.id}>
                        <Button onClick={() => setSelectedConnector(connector)}>{connector.name}</Button>
                      </li>
                    ))}
                  </ul>

                  <input type="text" required placeholder="Username" onChange={(e)=>setMainUserData({ ...mainUserData, userName: e.target.value })} />
                    <input type="text" required placeholder="Name" onChange={(e)=>setMainUserData({ ...mainUserData, name: e.target.value })} />
                <input type="text" placeholder="Bio" onChange={(e)=>setMainUserData({ ...mainUserData, bio: e.target.value })} />
                
    
                  {selectedConnector && (
                <Button onClick={handleSignUpProceed}>Confirm Login with {selectedConnector.name}</Button>
              )}
                  <Button onClick={() => setModalOpen(false)}>Close</Button>
                </Modal>
              )}
              { !isLogged && (
                <Button onClick={() => setModalOpen(true)}>Create account</Button>
              )}
            
    </>       
    
}
