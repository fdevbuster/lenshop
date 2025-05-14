import { PublicClient, testnet } from "@lens-protocol/react";

import { fragments } from "./fragments";
import { SERVER_API_KEY } from "@/config/viem.config";

export const clientTestnet = PublicClient.create({
  environment: testnet,
  // fragments,
  // apiKey: SERVER_API_KEY
});