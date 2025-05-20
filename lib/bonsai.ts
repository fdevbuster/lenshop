import { useState } from 'react';
import {
  createThirdwebClient,
  getContract,
  sendTransaction,
  type PreparedTransaction,
} from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { mintTo } from "thirdweb/extensions/erc721";
import { viemAdapter } from "thirdweb/adapters/viem";
import { type Account as ThirdwebAccount } from "thirdweb/wallets";
import { useAccount, useWalletClient } from 'wagmi';
import type { WalletClient as ViemWalletClient } from "viem"; // Ensure this is the correct type wagmi returns
import { type Address } from 'viem';

// create the client with your clientId, or secretKey if in a server environment
export const twclient = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
});

const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as Address;
// Ensure BONSAl_CHAIN_ID is parsed correctly and has a fallback.
const BONSAl_CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "0", 10);

interface NftData {
  name: string;
  description: string;
  image: string; // Assuming image is a URL string for simplicity with Thirdweb SDK
}

interface UseCreateNftMintProps {
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
}

export function useCreateNftMint({ onSuccess, onError }: UseCreateNftMintProps) {
  const { address: wagmiAccountAddress } = useAccount();
  const { data: wagmiWalletClient } = useWalletClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErrorState] = useState<any>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const createNft = async (nftData: NftData) => {
    setIsLoading(true);
    setErrorState(null);
    setTransactionHash(null);

    if (!wagmiAccountAddress || !wagmiWalletClient) {
      const err = new Error("Wallet not connected or not available.");
      console.error(err.message);
      onError(err);
      setIsLoading(false);
      return;
    }

    // Use wagmiWalletClient.chain.id for the most reliable current chain ID
    // if (wagmiWalletClient.chain?.id !== BONSAl_CHAIN_ID) {
    //   const err = new Error(
    //     `Incorrect network. Please connect to Bonsai Testnet (Chain ID ${BONSAl_CHAIN_ID}) to mint this NFT. You are currently on chain ID ${wagmiWalletClient.chain?.id}.`
    //   );
    //   console.error(err.message);
    //   onError(err);
    //   setIsLoading(false);
    //   return;
    // }

    try {
      const thirdwebAccount: ThirdwebAccount = viemAdapter.walletClient.fromViem({
        walletClient: wagmiWalletClient as any, // wagmiWalletClient is ViemWalletClient, cast to any for type compatibility
      });

      const contract = getContract({
        client: twclient,
        chain: defineChain(/*BONSAl_CHAIN_ID*/wagmiWalletClient.chain?.id),
        address: NFT_CONTRACT_ADDRESS,
      });

      // Explicitly type the transaction if known, though mintTo should return PreparedTransaction
      const transaction: PreparedTransaction = mintTo({
        contract,
        to: wagmiAccountAddress,
        nft: nftData as any, // { name, description, image }
      });

      console.log(`Attempting to mint NFT for ${wagmiAccountAddress} on chain ${BONSAl_CHAIN_ID} with contract ${NFT_CONTRACT_ADDRESS}`);
      const transactionResult = await sendTransaction({
        transaction,
        account: thirdwebAccount as any, // Bypass deep type path conflict
      }).catch(err=>{
        console.log('TX error',err)
        return { transactionHash: null, error: err}
      });
      if(transactionResult.transactionHash){
        console.log("NFT Mint Transaction successful:", transactionResult);
        setTransactionHash(transactionResult.transactionHash);
        onSuccess(transactionResult);
      }else{
        onError(transactionResult.error)
      }
      
    } catch (error: any) {
      console.error("NFT Mint Transaction failed:", error);
      setErrorState(error);
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createNft,
    isLoading,
    error,
    isSuccess: !!transactionHash && !error && !isLoading, // Approximate success state
    transactionHash,
  };
}