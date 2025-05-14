import { CLIENT_ID } from "@/config/thirdweb";
import { getAccount } from "@/config/viem.config";
import {
  createThirdwebClient,
  getContract,
  prepareContractCall,
  sendTransaction,
} from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { mintTo } from "thirdweb/extensions/erc721";
import { useSendTransaction } from "thirdweb/react";
import { useActiveAccount } from "thirdweb/react";
// create the client with your clientId, or secretKey if in a server environment
export const twclient = createThirdwebClient({
  clientId: CLIENT_ID,
});

// // connect to your contract
// const contract = getContract({
//   client,
//   chain: defineChain(232),
//   address: "0xaB7311a413a39C4F640D152Eec00f70eD3889066",
// });
export const useRegisterContract = (nft: { name: string, description: string, image: string }, success: (ev:any)=>void)=>{
  const { mutate: sendTransaction } = useSendTransaction();
  const activeAccount = useActiveAccount()
  const send = ({ nft }:{ nft: { name: string, description: string, image: string }})=>{

      return new Promise((resolve, reject)=>{
        console.log("nft",activeAccount)
      
        if(activeAccount?.address){  
          const contract = getContract({
            client: twclient,
            chain: defineChain(232),
            address: "0xaB7311a413a39C4F640D152Eec00f70eD3889066", //Launchpad contract address
          });
          const transaction = mintTo({
            contract,
            to: activeAccount?.address,
            nft
          });
          sendTransaction(transaction,{ 
            onError: (ev)=>{
            console.warn('error', ev)
            reject(ev)
          },onSuccess: (ev)=>{
            console.log("success",ev)
            success(ev)
            resolve(ev)
          }})
        }
       
  

      })
      
      
    
  }

  return send

}


