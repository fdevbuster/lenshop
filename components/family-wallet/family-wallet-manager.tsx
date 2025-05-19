import React, { useState } from 'react';
import { useSessionClient } from '../session-provider';
import { useWalletClient } from 'wagmi';
import { updateWalletMetadata } from '@/lib/lens/family-wallet';
import { WalletMetadata } from '@/lib/lens/types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { MetadataAttributeType } from '@lens-protocol/metadata';

export default function WalletManager() {
  const sessionClient = useSessionClient();
  const walletClient = useWalletClient();
  const [isEditing, setIsEditing] = useState(false);
  const [walletData, setWalletData] = useState<WalletMetadata>({
    name: '',
    bio: '',
    userName: '',
    attributes: [
      { key: 'account-type', type: MetadataAttributeType.STRING, value: 'wallet' },
    ],
  });

  const handleUpdateWallet = async () => {
    if (!sessionClient || !walletClient.data) return;

    try {
      const result = await updateWalletMetadata(
        sessionClient,
        walletClient.data,
        walletData
      );
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating wallet:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Wallet Settings</h2>
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Wallet Name</Label>
              <Input
                id="name"
                value={walletData.name}
                onChange={(e) =>
                  setWalletData({ ...walletData, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="bio">Description</Label>
              <Input
                id="bio"
                value={walletData.bio}
                onChange={(e) =>
                  setWalletData({ ...walletData, bio: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={walletData.userName}
                onChange={(e) =>
                  setWalletData({ ...walletData, userName: e.target.value })
                }
              />
            </div>
            <Button onClick={handleUpdateWallet}>Save Changes</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Wallet Name</h3>
              <p className="text-gray-600">{walletData.name}</p>
            </div>
            <div>
              <h3 className="font-semibold">Description</h3>
              <p className="text-gray-600">{walletData.bio}</p>
            </div>
            <div>
              <h3 className="font-semibold">Username</h3>
              <p className="text-gray-600">{walletData.userName}</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
} 