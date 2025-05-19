import React, { useEffect, useState } from 'react';
import { useLogged, useSession, useSessionClient } from '../session-provider';
import { Button } from './button';
import { getAccounts, loginAsOwner } from '@/lib/lens/login';
import { Connector, useAccount, useConnect, useSignMessage, useWalletClient } from 'wagmi';

import { Modal } from './modal';
import ConnectorOption from './connector-option';

export default function LoginButton() {
  const { setSessionClient, setAccount } = useSession();
  const isLogged = useLogged();
  const acc = useAccount();
  const wc = useWalletClient();
  const { connect, connectors } = useConnect();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedConnector, setSelectedConnector] = useState<Connector>();
  const [selectedAccount, setSelectedAccount] = useState<any>();
  const [accounts, setAccounts] = useState<any[]>([] as any[]);
  
  const handleConnectorConfirm = async () => {
    if (selectedConnector) {
      try{
        selectedConnector.disconnect();
      }catch(e){

      }
      const walletResult = await new Promise<{ connected: boolean; address: string; args: any[] }>((resolve, reject) => {
        connect(
          { connector: selectedConnector },
          {
            onSuccess: (data, variables) => {
              resolve({ connected: true, args: [data, variables], address: data.accounts[0] });
            },
            onError: (...args) => {

              setAccounts([])
              setSelectedConnector(undefined)
              if(args[0].name == 'ConnectorAlreadyConnectedError'){
                resolve({ connected: true, address: (wc.data?.account.address ?? ''), args })
              }else{
                reject({ connected: false, args }) 
              }
              
            },
          }
        );
      }).catch((err) => console.log(err));

      
      console.log('walletResult', walletResult)
      if (walletResult?.connected && wc.data) {
        const accounts = await getAccounts(walletResult, wc.data);
        if(accounts && accounts.length){
          console.log('accounts', accounts)
          setAccounts(accounts);

        }
      }
    }
  }


  const handleLogin = async () => {
    
      if (wc.data) {
        const session = await loginAsOwner(selectedAccount, wc.data);
        if (session) {
          setAccount(selectedAccount);
          setSessionClient(session as any);
        }
      }
  
  };

  useEffect(() => {
    if (isModalOpen) {
      setSelectedConnector(undefined);
      setAccounts([])
      setSelectedAccount(undefined)
    }    
  },[isModalOpen])

  useEffect(() => {
    setSelectedAccount(undefined)
  },[accounts])


  useEffect(() => {
    if (isLogged) {
      setModalOpen(false);
    
    }
  }, [isLogged]);

  return (
    <>
      {isModalOpen && (
        <Modal onClose={() => setModalOpen(false)} title='Login'>
          <h2>Choose Wallet Connector</h2>
          {!selectedConnector && !accounts.length && <ul>
            {connectors.map((connector) => (
              <li key={connector.id} className='mb-2'>
                <Button className='w-full h-fit flex flex-col justify-center items-start' onClick={() => setSelectedConnector(connector)}>
                  <ConnectorOption {...connector} />
                </Button>
              </li>
            ))}
          </ul> }

          {!selectedAccount && selectedConnector && (
        <Button onClick={handleConnectorConfirm}>Confirm Login with {selectedConnector.name}</Button>

            
          )}
      <h2>Choose an Account</h2>
          {!selectedAccount && <ul>
            {(accounts as any[]).map((account:any) => (
              <li key={account.address}>
                <Button onClick={() => setSelectedAccount(account)}>{account.username?.localName}</Button>
              </li>
            ))}
          </ul> }

          {selectedAccount && (
        <Button onClick={handleLogin}>Confirm with {selectedAccount.username?.localName}</Button>

            
          )}
          <Button onClick={() => setModalOpen(false)}>Close</Button>
        </Modal>
      )}
      {!!acc.address && !isLogged && (
        <Button onClick={() => setModalOpen(true)}>Login</Button>
      )}
    
    </>
  );
}