"use client";

import { client } from "./client";
import { signMessageWith } from "@lens-protocol/client/viem";
import { signer } from "./signer";
import { mainnet, Ok, testnet } from "@lens-protocol/react";
import { ok } from "assert";
import { createAccount, MainUserData } from "./create-account";
import { createWalletClient, custom, http, WalletClient } from 'viem';
import { MetadataAttributeType } from "@lens-protocol/metadata";
import { polygon, lensTestnet } from "viem/chains";
import { useAccount } from "wagmi";
import { APP_ID } from "@/config/lens";
import { AnyClient, evmAddress, never, SessionClient } from "@lens-protocol/client";
import { fetchAccount, fetchAccountsBulk } from "@lens-protocol/client/actions";
// const LENS_CHAIN_ID = 137; // Polygon Mainnet (Lens utiliza Polygon)
// const LENS_RPC_URL = { http: ['https://polygon-rpc.com'] }; // RPC público de Polygon
export const getAccounts = async (acc:any, sessionClient:any) => {

    if(!acc?.address){
        return false
    }
    const result = await fetchAccountsBulk(client as any, {
      ownedBy: [evmAddress(acc.address)],
      
    })/*.andThen((account) =>{
      console.log("Account created", account);
      return sessionClient.switchAccount({
        account: account?.address ?? never("Account not found"),
      })
    });*/
    
    if (result.isErr()) {
      return console.error(result.error);
    }
    
    const accounts = result.value;
    return accounts;

}
export const loginAsOwner= async (acc:any, walletClient:WalletClient) => {
  console.log('loginAsOwner', walletClient)

  if(!acc?.address){
    return false
  }
  const authenticated = await client.login({
    accountOwner: {
      //app: APP_ID,
      account: '0x15790a833EBB0C3d1350909c6859C633BfCb1f30',//acc.address, //walletClient.account?.address,
      owner: walletClient.account?.address,
    },
    signMessage: (...args)=>{
        console.log('signing message', args)
        return  signMessageWith(walletClient)(...args); 
    },
  });
  
  if (authenticated.isErr()) {
    console.error(authenticated.error);
    return false;
  }

  return authenticated.value;

}
export const createUserFromWallet = async (walletClient:WalletClient, account:`0x${string}`, metadata:MainUserData) => {
    const authenticated = await client.login({
        onboardingUser: {
          app: APP_ID ,
          wallet: walletClient.account?.address,
          //address: account,
        },
        signMessage: (...args)=>{
            console.log('signing message', args)
            return signMessageWith(walletClient)(...args); 
        },
      });
      
      if (authenticated.isErr()) {
        return console.error(authenticated.error);
      }
      //const walletClient = getWalletClient();
      // SessionClient: { ... }
      const sessionClient = authenticated.value;
      console.log('sessionClient', sessionClient);
      const authUser = sessionClient.getAuthenticatedUser()
      if(authUser.isOk() && walletClient){
        //sessionStorage.setItem('lens-session',JSON.stringify(authUser.value))


        await createAccount(sessionClient, walletClient, metadata).then((res)=>{
            console.log('account created', res)
        })
      }

      
      
      //sessionStorage.setItem("lens-session", JSON.stringify(sessionClient));
      return sessionClient;
}


export const logout = () => {
    sessionStorage.removeItem("lens-session");
}