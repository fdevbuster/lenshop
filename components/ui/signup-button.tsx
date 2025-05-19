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
    // const [selectedConnector, setSelectedConnector] = React.useState<Connector>(); // To be removed
    // const [openForm, setOpenForm] = React.useState(false) // Seems unused, consider removing if confirmed
    const acc = useAccount()
    const sessionClient = useSessionClient()
    const { setSessionClient } = useSession()
    const isLogged = useLogged()
    const wacc = useAccount() // Note: 'acc' from useAccount() is already defined above, 'wacc' might be a typo or redundant.
    const wc = useWalletClient()
    // const { connect, connectors } = useConnect() // Removed as wagmi connection is assumed from ConnectKit

    const handleSignUpProceed = async () => {
        const userAddress = acc.address;

        if (!userAddress || !wc.data) {
            console.log('Wallet not connected or WalletClient not available.');
            // Optionally, prompt user to connect wallet via ConnectKit button
            alert('Please connect your wallet first using the button in the top right.');
            return;
        }

        if (!mainUserData.userName || !mainUserData.name) {
            alert('Username and Name are required to create a Lens profile.');
            return;
        }

        console.log('Proceeding with signup for address:', userAddress, 'with data:', mainUserData);

        try {
            const result = await createUserFromWallet(wc.data, userAddress as `0x${string}`, mainUserData);
            if (result && !(result instanceof Error)) { // Ensure result is not an error
                console.log('Signup successful, session client created:', result);
                setSessionClient(result as any);
                setModalOpen(false); // Close signup modal on success
            } else {
                console.error('Signup failed or returned an error:', result);
                alert('Failed to create Lens profile. Check console for details.');
            }
        } catch (error) {
            console.error('Error during createUserFromWallet:', error);
            alert('An error occurred during signup. Check console for details.');
        }
    };

    useEffect(() => {
        if (isModalOpen) {
            // Reset form data when modal opens
            setMainUserData({
                name: '', bio: '', userName: '', attributes:[
                    { key: 'account-type', type: MetadataAttributeType.STRING, value: 'business' },
                ]
            });
            // Check if wallet is connected when modal opens
            if (!acc.address) {
                console.log('Signup modal opened, but no wallet connected via ConnectKit.');
                // Optionally, you could close the modal and prompt connection,
                // or let the form be disabled until connection.
            }
        }
    }, [isModalOpen, acc.address]);

    
    return <>
          {isModalOpen && (
                <Modal onClose={() => setModalOpen(false)} title="Create Lens Profile">
                  {/* Wallet connector selection removed, assuming connection via ConnectKit */}

                  

                  {/* Form is now always available if modal is open, relies on acc.address for enabling submission */}
                  <form
                    onSubmit={(e) => { e.preventDefault(); handleSignUpProceed(); }}
                    className="mt-4 flex flex-col gap-4 w-full mb-2"
                  >
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      Username
                      <input
                        type="text"
                        required
                        disabled={!acc.address} // Disabled if no wallet connected
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
                        disabled={!acc.address} // Disabled if no wallet connected
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
                        disabled={!acc.address} // Disabled if no wallet connected
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
                  </form>
                  {/* The form now has its own submit mechanism, button below can be generic or removed if form has submit button */}
                  <Button type="button" onClick={handleSignUpProceed} disabled={!acc.address || !mainUserData.userName || !mainUserData.name}>
                    Create Lens Profile & Login
                  </Button>
                  {/* <Button onClick={() => setModalOpen(false)}>Close</Button> */}
                </Modal>
              )}
              { !isLogged && (
                <Button onClick={() => setModalOpen(true)}>Create account</Button>
              )}
            
    </>       
    
}
