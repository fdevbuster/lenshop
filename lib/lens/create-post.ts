import {
    image,
    MediaImageMimeType,
    MetadataLicenseType,
  } from "@lens-protocol/metadata";
import { storeClient, acl } from "./store-client";
import { SessionClient, uri } from "@lens-protocol/client";
import { post } from "@lens-protocol/client/actions";

export const createImagePost = async (sessionClient:SessionClient, title:string, fileName:string, url:string, description:string) => {

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

     
     const result = await post(sessionClient, { contentUri: uri(contentUri) });
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