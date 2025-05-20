import React, { useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { useSession, useSessionClient } from "@/components/session-provider";
import { addReaction, fetchPostReactions, undoReaction } from "@lens-protocol/client/actions";
import { PostReactionType } from "@lens-protocol/client";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import { getClient } from "@/lib/lens/client";

interface VoteUpButtonProps {
  postId: string;
}

export default function VoteUpButton({ postId }: VoteUpButtonProps) {
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const acc = useAccount();
  const wc = useWalletClient();
  const sessionClient = useSessionClient();

  const { account: lensAcc } = useSession()
  const reloadVoteUp = async ()=>{

    const client = getClient()
    const result = await fetchPostReactions(sessionClient as any, {
        post: postId,
        
        filter: { anyOf: [PostReactionType.Upvote] },
    });
    
    if (result.isErr()) {
        return console.error(result.error);
    }else{
        console.log('Reactions for ', postId, result.value)
        if(lensAcc?.address){
            const voted = result.value.items.some(reac=>reac.account.address == lensAcc.address && reac.reactions[0]?.reaction == 'UPVOTE')
            setHasVoted(!!voted)
        }
       
    }
  
  }

  const handleVoteUp = async () => {
    if ( !sessionClient) {
      console.error("Wallet not connected or session not available.");
      return;
    }

    try {
      setIsVoting(true);

      const result = await (hasVoted?undoReaction:addReaction)(sessionClient, {
        post: postId,
        reaction: PostReactionType.Upvote, // Lens Protocol's "Upvote" reaction
      });

      if (result.isErr()) {
        console.error("Error voting up:", result.error);
        return;
      }

      console.log("Vote up successful:", result.value);
      setHasVoted(true);
      reloadVoteUp()
    } catch (error) {
      console.error("Unexpected error while voting up:", error);
    } finally {
      setIsVoting(false);
    }
  };

  useEffect(()=>{
    reloadVoteUp()
  },[postId])
  return (
    <Button  onClick={handleVoteUp}
    disabled={isVoting} variant="ghost" size="sm" className={(!hasVoted ? "text-gray-500":"text-red-500") + " hover:text-red-500"}>
        <Heart className="h-4 w-4 mr-1" />
        {/* <span className="text-xs">{post.likes}</span> */}
    </Button>
    
  );
}