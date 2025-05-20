import { Context, evmAddress, MetadataAttributeType, SessionClient, uri } from "@lens-protocol/client";
import { currentSession, fetchAccount, fetchAuthenticatedSessions, setAccountMetadata } from "@lens-protocol/client/actions";
import { account } from "@lens-protocol/metadata";

import { storeClient } from "../store-client";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { WalletClient } from "viem";
import { getClient } from "../client";



export const saveBioTask = async (sessionClient:SessionClient<Context>, walletClient:WalletClient, value:string, setAccount: (acc:any)=>void)=>{
    let success = false
    const result = await sessionClient.getAuthenticatedUser()
    if(result.isOk()){
        result.value.address
        const client = getClient()
        const acc = await fetchAccount(client as any, {
            address: evmAddress(result.value.address),
          });

          const ok = acc.isOk()
        //console.log('acc', acc, ok)
        if(ok){
          console.log('saving acc', acc)
          const metadata:any = { bio: value }
          if(acc.value?.metadata){
            Object.keys(acc.value.metadata).forEach((key) => {
              if(key !== 'bio' && !!(acc.value?.metadata) && (acc.value.metadata as any)[key]){
                metadata[key] = (acc.value.metadata as any)[key]
              }
            })
          }
      
            
            //metadata.bio = value

            try{
              
            
            let meda = account(metadata as any)
            console.log('metadata', meda)
            const { uri:metadataUri } = await storeClient.uploadAsJson(meda);
            const result2 = await setAccountMetadata(sessionClient, {
                metadataUri: uri(metadataUri),
              }).andThen(handleOperationWith(walletClient));

              console.log('result', result2)
            success = result2.isOk()
            console.log('result metadata', result2)

            if(success && result2.isOk()){
              setTimeout(async () => {
                  const acc2 = await fetchAccount(client as any, {
                    address: evmAddress(acc.value?.address),
                  });
                  if(acc2.isOk()){
                    console.log('acc2', acc2)
                    setAccount(acc2.value)
                  }
                }, 1000)
              //setAccount(result2.value)
            }
          }catch(e){
            console.log('error saving metadata', e)
          }
        }
    }

    return { success }
    

}

export const getSaveMetaItem = (metaName:string)=>{ 
  return async (sessionClient:SessionClient<Context>, walletClient:WalletClient, val:any, setAccount: (acc:any)=>void)=>{
    let success = false
    const result = await sessionClient.getAuthenticatedUser()
    if(result.isOk()){
        if(metaName == 'picture' || metaName == 'coverPicture'){
          const { uri } = await storeClient.uploadFile(val as File)
          val = uri;
        }
        result.value.address
        const client = getClient()
        const acc = await fetchAccount(client as any, {
            address: evmAddress(result.value.address),
          });

          const ok = acc.isOk()
        //console.log('acc', acc, ok)
        if(ok){
          console.log('saving acc', acc)
          const metadata:any = { [metaName]: val }
            if(acc.value?.metadata){
              Object.keys(acc.value.metadata).forEach((key) => {
                if(key !== metaName && !!(acc.value?.metadata) && (acc.value.metadata as any)[key]){
                  metadata[key] = (acc.value.metadata as any)[key]
                }
              })
            }
            metadata['attributes'] = acc.value?.metadata?.attributes ?? [
              
            ]

            if(!metadata['attributes'].length){
              metadata['attributes'] = [
                {
                  type: 'String',
                  value: val,
                  key: metaName
                }
              ]
            }

            metadata['attributes'].forEach((m:any)=>{
              m.type = (m.type + '')[0] + (m.type + '').toLowerCase().slice(1)
            })
            
            //metadata.bio = value

            try{
              
            
                let meda = account(metadata as any)
                console.log('metadata', meda)
                const { uri:metadataUri } = await storeClient.uploadAsJson(meda);
                const result2 = await setAccountMetadata(sessionClient, {
                    metadataUri: uri(metadataUri),
                  }).andThen(handleOperationWith(walletClient));

                  console.log('result', result2)
                success = result2.isOk()
                console.log('result metadata', result2)

                if(success && result2.isOk()){
                  setTimeout(async () => {
                      const acc2 = await fetchAccount(client as any, {
                        address: evmAddress(acc.value?.address),
                      });
                      if(acc2.isOk()){
                        console.log('acc2', acc2)
                        setAccount(acc2.value)
                      }
                    }, 1000)
                  //setAccount(result2.value)
                }
              }catch(e){
                console.log('error saving metadata', e, metadata)
              }
        }
    }

    return { success }
  }

}