import React, { useState, useEffect } from "react";
import { useLogged, useSession, useSessionClient } from "./session-provider";
import { createCommentPost } from "@/lib/lens/create-post";
import { useAccount, useConnect, useWalletClient } from "wagmi";
import { ConnectKitButton } from "connectkit";
import LoginButton from "./ui/login-button";
import { getClient } from "@/lib/lens/client";
import { fetchPostReferences } from "@lens-protocol/client/actions";
import { PostReferenceType } from "@lens-protocol/client";

interface Comment {
  id: string;
  author: string;
  content: string;
  avatar: string;
  timestamp: string;
}

interface PostCommentsProps {
  postId: string;
  initialComments: Comment[];
}

export default function PostComments({ postId, initialComments }: PostCommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");

  const acc = useAccount()
  const isLogged = useLogged()
  const sessionClient = useSessionClient()
  const wc = useWalletClient()
  const { account:lensAcc } = useSession()

  const reloadComments = async ()=>{
    const client = getClient()
    const result = await fetchPostReferences(client as any, {
        referencedPost: postId,
        referenceTypes: [PostReferenceType.CommentOn],
    });
    if(result.isOk()){
        console.log('comments', result.value)
        setComments(result.value.items.map((com:any)=>{
            return {
                id: com.id,
                author: com.author.address == lensAcc.address ? 'You': com.author.name,
                content: com.metadata.content || '',
                timestamp: com.timestamp,
                avatar: com.author.metadata.picture

            }
        }))
    }
  }
  const handleAddComment = () => {
   
    if (newComment.trim() === "") return;

    // const newCommentObj: Comment = {
    //   id: `${comments.length + 1}`,
    //   author: "You", // Replace with the logged-in user's name
    //   avatar: "/default-avatar.png", // Replace with the logged-in user's avatar
    //   content: newComment,
    //   timestamp: new Date().toLocaleTimeString(),
    // };

    //setComments([newCommentObj, ...comments]);
    setNewComment("");
    createCommentPost(sessionClient as any, wc.data as any, newComment, postId).then((res)=>{
        console.log(res)
        reloadComments()
    })
  };

  useEffect(()=>{
    reloadComments()
  },[postId])

  const { account } = useSession()

  console.log('ACcount metadata', account?.metadata)
  const canComment = !!acc.address && !!isLogged
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h4 className="text-lg font-medium mb-4">Comments</h4>

      {/* Input for new comment */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={account?.metadata.picture ?? "/default-avatar.png"} // Replace with the logged-in user's avatar
          alt={account?.metadata.name ?? 'guest'}
          className="w-10 h-10 rounded-full object-cover"
        />
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        { canComment && <button
          onClick={handleAddComment}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Post
        </button> }
        { !canComment && <ConnectKitButton />}
        { !!acc.address && !isLogged && <LoginButton />}
      </div>

      {/* Comment list */}
      <ul className="space-y-4">
        {comments.map((comment) => (
          <li key={comment.id} className="flex items-start gap-3">
            <img
              src={comment.avatar ?? '/man-profile.png'}
              alt={`${comment.author}'s avatar`}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{comment.author}</span>
                <span className="text-xs text-gray-500">{new Date(comment.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}