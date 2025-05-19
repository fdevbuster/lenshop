import React, { useEffect, useMemo } from 'react'
import { useLogged, useSession, useSessionClient } from '../session-provider'
import { Button } from './button'
import { Connector, useAccount, useConnect, useWalletClient } from 'wagmi'
import { createAccount, MainUserData } from '@/lib/lens/create-account'
import { createAccountWithUsername } from '@lens-protocol/client/actions'
import { createUserFromWallet, loginAsOwner } from '@/lib/lens/login'
import { MetadataAttributeType } from '@lens-protocol/metadata'
import { signer } from '@/lib/lens/signer'
import { Modal } from './modal'
import ConnectorOption from './connector-option'

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
        console.log('handleSignUpProceed', acc, selectedConnector)
        if(!selectedConnector){
            return 

        }
        //console.log(connectors)
        try{
            
        }catch{

        }
        
        
            const walletResult = await new Promise<{ connected: boolean, address:string, args:any[] }>((resolve, reject)=>{
                connect({ connector: selectedConnector},{ onSuccess: (data, variables)=>{
                    resolve({ connected: true, args:[data, variables], address: data.accounts[0]})
                }, onError: (...args)=>reject({ connected: false, args}) })
            }).catch(err=>console.log(err))
            
        address = walletResult?.address;

           
        if(!address){
          address = wc.data?.account.address
        }
        //if(!address){
            if(!mainUserData || !address || !wc.data){
                console.log('No address or mainUserData', mainUserData, address, wc.data, wc)
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

    useEffect(() => {
        if (isModalOpen) {
            setSelectedConnector(undefined);  
            setMainUserData({ name: '', bio: '', userName: '', attributes:[
                { key: 'account-type', type: MetadataAttributeType.STRING, value: 'business' },
            ] })
        }
    }, [isModalOpen])

    
    return <>
          {isModalOpen && (
                <Modal onClose={() => setModalOpen(false)} title="Create Account">
                  {!selectedConnector && (<>
                    <h2>Choose Wallet Connector</h2>
                  <ul>
                             {connectors.map((connector) => (
                               <li key={connector.id} className='mb-2'>
                                 <Button className='w-full h-fit flex flex-col justify-center items-start' onClick={() => setSelectedConnector(connector)}>
                                   <ConnectorOption {...connector} />
                                 </Button>
                               </li>
                             ))}
                           </ul> 
                  </>)}

                  

                  { selectedConnector && <form
                    className="mt-4 flex flex-col gap-4 w-full mb-2"
                  >
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      Username
                      <input
                        type="text"
                        required
                        disabled={!selectedConnector}
                        placeholder="Enter your username"
                        onChange={(e) =>
                          setMainUserData({ ...mainUserData, userName: e.target.value })
                        }
                        style={{
                          padding: '8px',
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                        }}
                      />
                    </label>

                    <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      Name
                      <input
                        type="text"
                        required
                        disabled={!selectedConnector}
                        placeholder="Enter your name"
                        onChange={(e) =>
                          setMainUserData({ ...mainUserData, name: e.target.value })
                        }
                        style={{
                          padding: '8px',
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                        }}
                      />
                    </label>

                    <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      Bio
                      <input
                        type="text"
                        placeholder="Enter your bio"
                        disabled={!selectedConnector}
                        onChange={(e) =>
                          setMainUserData({ ...mainUserData, bio: e.target.value })
                        }
                        style={{
                          padding: '8px',
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                        }}
                      />
                    </label>
                  </form> }
                  {selectedConnector && (
                <Button onClick={handleSignUpProceed}>Confirm Login with {selectedConnector.name}</Button>
              )}
                  {/* <Button onClick={() => setModalOpen(false)}>Close</Button> */}
                </Modal>
              )}
              { !isLogged && (
                <Button onClick={() => setModalOpen(true)}>Create account</Button>
              )}
            
    </>       
    
}
