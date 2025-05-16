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


export const SERVER_API_KEY = 'g2Ls8t-ky-sk9mcAsEHRi0hLFiGr1NT-ah'
export const APP_SIGNER_KEY= '0xce3bf7285e3e0e3168a1482700d893cc55f13321f27035ed5be448949492db5a'
export const APP_SIGNER_ADDRESS= '0xF019981209C1910e9c145390b1159643e32ce4b8'