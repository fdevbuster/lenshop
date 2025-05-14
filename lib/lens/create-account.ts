import { MetadataAttributeType, account } from "@lens-protocol/metadata";
import { acl, storeClient } from "./store-client";
import { uri } from "@lens-protocol/client";
import { createAccountWithUsername } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { WalletClient } from "viem";

export interface MainUserData{
    name: string;
    bio: string;
    attributes: {
        key: string; 
        type: MetadataAttributeType;
        value: any;
    }[];
}

export const createAccount = async (sessionClient:any, walletClient:WalletClient, mainData:MainUserData) => {
    const metadata = account({
        name: mainData.name,
        bio: mainData.bio,
        attributes: [
          ...mainData.attributes
        ],
      });

      const { uri:accountUri } = await storeClient.uploadAsJson(metadata, { acl });
      console.log('account uri', uri)   

    const result = await createAccountWithUsername(sessionClient, {
            username: { localName: "wagmi" },
            metadataUri: uri(accountUri),
        }).andThen(handleOperationWith(walletClient))
        .andThen(sessionClient.waitForTransaction);;
}
