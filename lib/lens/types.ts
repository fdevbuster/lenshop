import { MetadataAttributeType } from "@lens-protocol/metadata";

export interface WalletMetadata {
  name: string;
  bio: string;
  userName: string;
  attributes: {
    key: string;
    type: MetadataAttributeType;
    value: any;
  }[];
} 