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
  // const { connect, connectors } = useConnect(); // Removed as wagmi connection is assumed from ConnectKit
  const [isModalOpen, setModalOpen] = useState(false);
  // const [selectedConnector, setSelectedConnector] = useState<Connector>(); // To be removed or re-evaluated
  const [selectedAccount, setSelectedAccount] = useState<any>();
  const [accounts, setAccounts] = useState<any[]>([] as any[]);
  

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
    setAccounts([])
    setSelectedAccount(undefined)
    if (isModalOpen && acc.address && wc.data) {

      // Wallet is connected via ConnectKit, fetch Lens profiles
      const fetchLensAccounts = async () => {
        console.log('Fetching Lens accounts for:', acc.address);
        const lensProfiles = await getAccounts({ address: acc.address }, wc.data); // Pass address and walletClient
        if (lensProfiles && Array.isArray(lensProfiles)) {
          console.log('Lens profiles found:', lensProfiles);
          setAccounts(lensProfiles);
        } else {
          console.log('No Lens profiles found or error fetching.');
          setAccounts([]);
        }
      };
      fetchLensAccounts();
      setSelectedAccount(undefined); // Reset selected account when modal opens
    } else if (isModalOpen) {
      // Wallet not connected via wagmi/ConnectKit, or wc.data not ready
      // Potentially show a message or rely on SignupButton for onboarding
      console.log('Login modal opened, but wagmi account/walletClient not ready.');
      setAccounts([]);
      setSelectedAccount(undefined);
    }
  }, [isModalOpen]);

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
          <h2>Choose a Lens Profile</h2>
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