"use client"
import { PublicClient, testnet } from "@lens-protocol/react";

import { fragments } from "./fragments";
import { SERVER_API_KEY } from "@/config/viem.config";

export const getTestnetClient = ()=>{
  const clientTestnet = PublicClient.create({
    environment: testnet,
    storage: (typeof window == 'undefined')?undefined: window.localStorage
    // fragments,
    //apiKey: SERVER_API_KEY
  });
  return clientTestnet
}
