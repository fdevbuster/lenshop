
import { getMainnetClient } from "./client.mainnet";
import { getTestnetClient } from "./client.testnet";
import { Context,PublicClient } from "@lens-protocol/react";

const clientObj:{
    current: PublicClient<Context>|undefined
} = {
    current: undefined
}
export const getClient = (()=>{
    if(clientObj.current){
        return clientObj.current
    }else{
        clientObj.current = getTestnetClient() 
    }
    return clientObj.current

    return getMainnetClient();
})