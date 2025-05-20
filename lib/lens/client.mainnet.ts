"use client"
import { PublicClient, mainnet } from "@lens-protocol/react";

import { fragments } from "./fragments";
import { SERVER_API_KEY } from "@/config/viem.config";
export const getMainnetClient = ()=>{
   const clientMainnet = PublicClient.create({
    environment: mainnet,
    fragments,
    storage: (typeof window == 'undefined')?undefined: window.localStorage,
    apiKey: SERVER_API_KEY,
  });
  return clientMainnet
}
