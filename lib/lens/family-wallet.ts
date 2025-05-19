import { client } from "./client";
import { storeClient } from "./store-client";
import { WalletMetadata } from "./types";
import { SessionClient } from "@lens-protocol/client";
import { WalletClient } from "viem";
import { account } from "@lens-protocol/metadata";
import { setAccountMetadata, fetchAccount } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { uri } from "@lens-protocol/client";
import { MetadataAttributeType } from "@lens-protocol/metadata";

export const updateWalletMetadata = async (
  sessionClient: SessionClient,
  walletClient: WalletClient,
  metadata: WalletMetadata
) => {
  try {
    // Create the wallet metadata
    const walletMetadata = account({
      name: metadata.name,
      bio: metadata.bio,
      attributes: metadata.attributes,
    });

    // Upload metadata to IPFS
    const { uri: metadataUri } = await storeClient.uploadAsJson(walletMetadata);

    // Update account metadata
    const result = await setAccountMetadata(sessionClient, {
      metadataUri: uri(metadataUri),
    })
      .andThen(handleOperationWith(walletClient))
      .andThen(sessionClient.waitForTransaction);

    if (result.isErr()) {
      throw new Error(result.error.message);
    }

    return result.value;
  } catch (error) {
    console.error("Error updating wallet metadata:", error);
    throw error;
  }
}; 