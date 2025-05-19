import {
    image,
    MediaImageMimeType,
    MetadataAttributeType,
    MetadataLicenseType,
    textOnly,
  } from "@lens-protocol/metadata";
import { storeClient, acl } from "./store-client";
import { postId, SessionClient, uri } from "@lens-protocol/client";
import { post } from "@lens-protocol/client/actions";
import { WalletClient } from "viem";
import { handleOperationWith } from "@lens-protocol/client/viem";

export const createImagePost = async (sessionClient:SessionClient, walletClient:WalletClient, title:string, fileName:string, url:string, description:string) => {

    const type = getMimeTypeFromFileName(fileName);

    const metadata = image({
        title,
        image: {
          item: url,
          type,
          altTag: description,
          license: MetadataLicenseType.CCO,
        },
      });

     const { uri:contentUri } = await storeClient.uploadAsJson(metadata, { acl })

     
     const result = await post(sessionClient, { contentUri: uri(contentUri) })
     .andThen(handleOperationWith(walletClient));
     return result;
} 

export const createCommentPost = async (sessionClient:SessionClient, walletClient:WalletClient, comment:string, postIdVal: string) => {

  const metadata = textOnly({
      content: comment

  })

   const { uri:contentUri } = await storeClient.uploadAsJson(metadata, { acl })

   
   const result = await post(sessionClient, { contentUri: uri(contentUri), commentOn: {
      post: postId(postIdVal) 
  } })
   .andThen(handleOperationWith(walletClient));

   console.log('Comment', result)
   return result;
} 

// ...existing code...

/**
 * Obtiene el tipo MIME basado en la extensión del nombre de archivo.
 * @param fileName Nombre del archivo.
 * @returns El tipo MIME correspondiente o 'application/octet-stream' si no se encuentra.
 */
const getMimeTypeFromFileName = (fileName: string): MediaImageMimeType => {
  const extension = fileName.split('.').pop()?.toLowerCase();

  const mimeTypes: { [key: string]: MediaImageMimeType } = {
    png: MediaImageMimeType.PNG,
    jpg: MediaImageMimeType.JPEG,
    jpeg: MediaImageMimeType.JPEG,
    gif: MediaImageMimeType.GIF,
    webp: MediaImageMimeType.WEBP,
    bmp: MediaImageMimeType.BMP,
    tiff: MediaImageMimeType.TIFF,
  };

  return mimeTypes[extension || ""] || MediaImageMimeType.PNG;
};

// ...existing code...