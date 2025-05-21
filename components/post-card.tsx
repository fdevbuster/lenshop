"use client"
import Image from "next/image"
import { Heart, MessageCircle, Repeat, Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import CommentButton from "./comment-button"
import PostComments from "./post-comments"
import { useEffect, useState } from "react"
import VoteUpButton from "./voteup"

interface Author {
  name: string
  handle: string
  avatar: string
}

interface Post {
  id: string
  // content: string
  // image?: string
  // timestamp: string
  // likes: number
  // comments: number
  // author: Author
  title: string, 
  url:string,
  upvotes: number,
  downvotes: number,
  comments: number,
  collects: number

}

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
 // const formattedDate = new Date(post.timestamp).toLocaleDateString()
  
  return (
    <div className="mb-4 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <div className="relative h-10 w-10 rounded-full overflow-hidden">
          <Image src={post.url} alt={post.title} fill className="object-cover" />
        </div>
        <div>
          <div className="font-medium">{post.title}</div>
          <div className="text-xs text-gray-500">
            {/* {post.author.handle} • {formattedDate} */}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-2">
        {/* <p className="text-sm mb-3">{post.content}</p> */}
      </div>

      {/* Image */}
      {post.url && (
        <div className="relative w-full h-48">
          <Image src={post.url} alt="Post image" fill className="object-cover" />
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-2 flex justify-between border-t dark:border-gray-700">
        {/* <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500"> */}
          {/* <Heart className="h-4 w-4 mr-1" /> */}
          {/* <span className="text-xs">{post.likes}</span> */}
        {/* </Button> */}
        <VoteUpButton postId={post.id} />
        {/* <Button variant="ghost" size="sm" className="text-gray-500">
          <MessageCircle className="h-4 w-4 mr-1" />
          
        </Button> */}
         <Button variant="ghost" size="sm" className="text-gray-500" onClick={()=>setShowComments(!showComments)}>
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {/* <span className="text-xs">{post.comments}</span> */}
                </Button>
        <Button variant="ghost" size="sm" className="text-gray-500">
          <Repeat className="h-4 w-4 mr-1" />
          <span className="text-xs">Recolectar</span>
        </Button>
        <Button variant="ghost" size="sm" className="text-gray-500">
          <Share className="h-4 w-4 mr-1" />
          <span className="text-xs">Compartir</span>
        </Button>
      </div>

      {/* <Button className="w-full" onClick={()=>setShowComments(!showComments)} type='button' variant={'ghost'}><MessageCircle />Comments ...</Button> */}

      { showComments && <PostComments initialComments={[]} postId={post.id} /> }
    
    </div>
  )
}
