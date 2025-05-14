import { chains } from "@lens-chain/sdk/viem";
import { lensAccountOnly, StorageClient } from "@lens-chain/storage-client";

export const acl = lensAccountOnly(
  "0x763aa9096cf3b225d11434b7384cc97c32041090", // Lens Account Address
  chains.testnet.id
);


export const storeClient = StorageClient.create()

