import { MetadataAttributeType, account } from "@lens-protocol/metadata";
import { acl, storeClient } from "./store-client";
import { never, uri } from "@lens-protocol/client";
import { createAccountWithUsername, fetchAccount } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { WalletClient } from "viem";

export interface MainUserData{
    name: string;
    bio: string;
    userName: string;
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
            username: { localName: mainData.userName },
            metadataUri: uri(accountUri),
        }).andThen(handleOperationWith(walletClient))
        .andThen(sessionClient.waitForTransaction)
        .andThen((txHash) => fetchAccount(sessionClient, { txHash }))
        .andThen((account) =>{
          console.log("Account created", account);
          return sessionClient.switchAccount({
            account: account?.address ?? never("Account not found"),
          })
        }
          
          );
          if (result.isErr()) {
            return console.error(result.error);
          }
    return result;
}
