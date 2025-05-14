import { DragEventHandler, MouseEventHandler, useCallback, useEffect, useRef, useState } from "react"



export const Dropzone = ({children, onSetFile }:any)=>{

    const divRef = useRef<HTMLDivElement>(null)
    const [over, setOver]=useState(false)
    const [drop, setDrop]=useState<File>()

   
    const handleDragOver:DragEventHandler<HTMLDivElement> = (ev)=>{
        ev.preventDefault()
        const files = Array.from(ev.dataTransfer.files);
        setOver(true)
    }
    const handleDragLeave = useCallback(() => {
        setOver(false)
    }, []);
    const handleDrop:DragEventHandler<HTMLDivElement>  = (ev)=>{
        ev.preventDefault()
        const files = Array.from(ev.dataTransfer.files);
        
        setDrop(files[0])

    }

    const handleClick:MouseEventHandler<HTMLDivElement> = (ev)=>{
        ev.preventDefault()
        const a = document.createElement('input')
        a.type = 'file'
        a.onchange = ()=>{
            if(a.files){
                setDrop(a.files[0])
            }else{
                setDrop(undefined)
            }

            a.remove()
        }
        a.click()
    }

    useEffect(()=>{
        onSetFile(drop)
    },[drop])

    return <div style={{ opacity: over?'.5':'1', cursor: 'pointer'}}
     onClick={handleClick}
     ref={divRef} draggable={true} onDragLeave={handleDragLeave} 
     onDragOver={handleDragOver} onDrop={handleDrop}>
        {drop?.name}
        <br />
        {children}
    </div>
}