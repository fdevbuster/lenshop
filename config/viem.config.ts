import "viem/window";
import { Address, createPublicClient, createWalletClient, custom, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'
import { chains } from "@lens-chain/sdk/viem";
 
export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http()
})


export const getAccount = async ()=>{
   const [account] = (await window.ethereum!.request({
    method: "eth_requestAccounts",
    })) as [Address];
    return account
}


export const getWalletClient = async ()=>{
    const [account] = (await window.ethereum!.request({
    method: "eth_requestAccounts",
    })) as [Address];
    return createWalletClient({
    account,
    chain: chains.mainnet,
    transport: custom(window.ethereum!),
    });
} 


export const SERVER_API_KEY = '9cT1nC-Tk-Mhozhfd_7EexQ42sNtmRKx8P'
export const LENS_ACCOUNT = '0x7637a830dc32243ab1838876645e5297ab2bef9738cb3dc0ac7566ee7cb618a4'
