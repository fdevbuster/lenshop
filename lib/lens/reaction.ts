import { PostReactionType } from "@lens-protocol/client";
import { addReaction } from "@lens-protocol/client/actions";


export const saveReaction = async (sessionClient: any, reaction: PostReactionType, postId: string) => {
    const result = await addReaction(sessionClient, {
        post: postId,
        reaction// or Downvote
      });
      
      if (result.isErr()) {
        return console.error(result.error);
      }
      
      // Boolean indicating success adding the reaction
      const success = result.value;

      return  success
}


