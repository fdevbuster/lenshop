import type { FragmentOf } from "@lens-protocol/react";


// import { PostMetadataFragment } from "./posts";
// import { MediaImageFragment } from "./images";
import { AccountFragment, AccountMetadataFragment } from "./fragments/accounts";

declare module "@lens-protocol/react" {
  export interface Account extends FragmentOf<typeof AccountFragment> {}
  export interface AccountMetadata
    extends FragmentOf<typeof AccountMetadataFragment> {}
//   export interface MediaImage extends FragmentOf<typeof MediaImageFragment> {}
//   export type PostMetadata = FragmentOf<typeof PostMetadataFragment>;
}

export const fragments = [
  AccountFragment,
];