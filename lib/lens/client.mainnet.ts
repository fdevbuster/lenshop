import { PublicClient, mainnet } from "@lens-protocol/react";

import { fragments } from "./fragments";
import { SERVER_API_KEY } from "@/config/viem.config";

export const clientMainnet = PublicClient.create({
  environment: mainnet,
  fragments,
  apiKey: SERVER_API_KEY,
});