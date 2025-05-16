import React, { useEffect, useState } from 'react';
import { useLogged, useSession, useSessionClient } from '../session-provider';
import { Button } from './button';
import { getAccounts, loginAsOwner } from '@/lib/lens/login';
import { Connector, useAccount, useConnect, useSignMessage, useWalletClient } from 'wagmi';

import { Modal } from './modal';

export default function LoginButton() {
  const { setSessionClient } = useSession();
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
            onError: (...args) => reject({ connected: false, args }),
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
    if (isLogged) {
      setModalOpen(false);
    
    }
  }, [isLogged]);

  return (
    <>
      {isModalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <h2>Choose Wallet Connector</h2>
          {!selectedConnector && <ul>
            {connectors.map((connector) => (
              <li key={connector.id}>
                <Button onClick={() => setSelectedConnector(connector)}>{connector.name}</Button>
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