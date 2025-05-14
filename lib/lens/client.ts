import { clientMainnet } from "./client.mainnet";
import { clientTestnet } from "./client.testnet"

export const client = (()=>{
    return clientTestnet;

    return clientMainnet;
})()