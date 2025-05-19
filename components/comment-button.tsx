import React, { useState } from 'react'
import { Modal } from './ui/modal'
import { MessageCircle } from 'lucide-react'
import { Button } from './ui/button'
import { createCommentPost } from '@/lib/lens/create-post'
import { useSession, useSessionClient } from './session-provider'
import { useWalletClient } from 'wagmi'

export default function CommentButton({ postId }:any) {

    const [showModal, setShowModal] = useState(false)
    const [text, setText] = useState('')

    const sessionClient = useSessionClient()
    const session = useSession()
    const wc = useWalletClient()
    const handleSendComment = async ()=>{
        if(wc.data && sessionClient){
            await createCommentPost(sessionClient,wc.data, text, postId)
            
        }
        
    }   
    return (
        <>
        <Button variant="ghost" size="sm" className="text-gray-500" onClick={()=>setShowModal(true)}>
            <MessageCircle className="h-4 w-4 mr-1" />
            {/* <span className="text-xs">{post.comments}</span> */}
        </Button>
        { showModal && <Modal title='Send a comment' onClose={()=>setShowModal(false)}>
            <textarea onChange={(ev)=>setText(ev.target?.value)} value={text} className="w-full">
                
            </textarea>
            <div className='flex items-start gap-4'>
                <Button variant={'secondary'} onClick={()=>setShowModal(false)}> Cancel</Button>
                <Button onClick={handleSendComment}> Send Comment</Button>
            </div>
        </Modal> }
        </>
    )
}
