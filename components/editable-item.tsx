
"use client"
import React, { useEffect, useState } from 'react'
import { marked } from 'marked';
import { Modal } from './ui/modal';
import { Edit } from 'lucide-react';
import { useLogged } from './session-provider';
import { useToast } from './ui/use-toast';
export type EditableType = 'text' | 'image' | 'video' | 'audio' | 'file' | 'link' | 'embed' | 'html' | 'markdown'
interface HandleSaveEvent extends React.MouseEvent<HTMLButtonElement> {}
const MarkdownRenderer = ({ content }: { content: string }) => {
    const [htmlContent, setHtmlContent] = useState<string>('');
    
    useEffect(() => {
        const load = async () => {
            const result = await marked(content)
            setHtmlContent(result);
        }
        
        load();
    },[content])

    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}

export type SaveItemTask = (value:any)=>Promise<{ success: boolean }>

export default function EditableItem(props:{ type: EditableType,initialValue: string | File | null, children: React.ReactNode, pos?: [number, number],saveTask:SaveItemTask }) {

    

    const [value, setValue] = useState<string | File | null>(props.initialValue);
    const [isEditMode, setEditMode] = useState(false);

    const isLogged = useLogged()
    const toast = useToast()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (props.type === 'image' || props.type === 'video' || props.type === 'audio' || props.type === 'file') {
      setValue((e.target as HTMLInputElement).files ? (e.target as any).files[0] : null);
    } else {
      setValue(e.target.value);
    }
  };

  const renderInput = () => {
    switch (props.type) {
      case 'text':
        return (
          <input
            type="text"
            placeholder="Enter text"
            value={typeof value === 'string' ? value : ''}
            onChange={handleChange}
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        );
      case 'image':
        return <input type="file" accept="image/*" onChange={handleChange} style={{ padding: '8px' }} />;
      case 'video':
        return <input type="file" accept="video/*" onChange={handleChange} style={{ padding: '8px' }} />;
      case 'audio':
        return <input type="file" accept="audio/*" onChange={handleChange} style={{ padding: '8px' }} />;
      case 'file':
        return <input type="file" onChange={handleChange} style={{ padding: '8px' }} />;
      case 'link':
        return (
          <input
            type="url"
            placeholder="Enter URL"
            value={typeof value === 'string' ? value : ''}
            onChange={handleChange}
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        );
      case 'embed':
        return (
          <textarea
            placeholder="Enter embed code"
            value={typeof value === 'string' ? value : ''}
            onChange={handleChange}
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }}
          />
        );
      case 'html':
        return (
          <textarea
            placeholder="Enter HTML"
            value={typeof value === 'string' ? value : ''}
            onChange={handleChange}
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }}
          />
        );
      case 'markdown':
        return (
          <textarea
            placeholder="Enter Markdown"
            value={typeof value === 'string' ? value : ''}
            onChange={handleChange}
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }}
          />
        );
      default:
        return <div>Unsupported type</div>;
    }
  };

  const renderPreview = () => {
    if (props.type === 'image' && value) {
        return <img src={URL.createObjectURL(value as File)} alt="Preview" style={{ maxWidth: '100%' }} />; 
    } else if (props.type === 'video' && value) {
        return <video controls src={URL.createObjectURL(value as File)} style={{ maxWidth: '100%' }} />;
    } else if (props.type === 'audio' && value) {
        return <audio controls src={URL.createObjectURL(value as File)} style={{ maxWidth: '100%' }} />;
    } else if (props.type === 'file' && value) {        
        return <a href={URL.createObjectURL(value as File)} download>{(value as File).name}</a>;
    }
    else if (props.type === 'link' && value) {
        return <a href={value as string} target="_blank" rel="noopener noreferrer">{value as string}</a>;
    } else if (props.type === 'embed' && value) {
        return <div dangerouslySetInnerHTML={{ __html: value as string }} />;
    } else if (props.type === 'html' && value) {
        return <div dangerouslySetInnerHTML={{ __html: value as string }} />;
    } else if (props.type === 'markdown' && value) {    
        // Assuming you have a function to convert markdown to HTML
        const md = value
        
        return <MarkdownRenderer content={md as  string} />;
    } else if (props.type === 'text' && value){
        return <div></div>
    } else {
        return <div>No preview available</div>;
    }
    }



    const handleSave = async (ev: HandleSaveEvent) => {
        try {
            const result = await props.saveTask(value);
            console.log('Saved result',result)
            if (!result.success) {
              throw new Error('Failed to save the item');
            }
            setEditMode(false); // Cierra el modal si se guarda correctamente
            toast.toast({
              //id: 'success-saving-item',
              title: 'Success',
              description: 'Item saved successfully!',
              //status: 'success',
            });
          } catch (error) {
            toast.toast({
              //id: 'error-saving-item',
              
              title: 'Error',
              description: 'There was an error saving the item. Please try again.',
              //status: 'error',
            });
          }
    }

    useEffect(() => {
      setValue(props.initialValue)
    },[props.initialValue])
    let pos = props.pos?props.pos:[-10,-10]
  return (
    <div className='relative'>
    { isLogged && isEditMode && <Modal onClose={() => setEditMode(false)} title="Edit Item">
        <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Edit {props.type}</h2>
            {renderInput()}
            {renderPreview()}
            <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
                Save
            </button> 
        </div>
    </Modal> }
    { isLogged && <div className={`absolute z-30`} style={{ bottom: (pos[1] + 'px'), right: (pos[0] + 'px') }}>
        <button onClick={() => setEditMode(true)} className="bg-blue-500 text-white px-2 py-2 rounded-full">
        <Edit size={16} />
        </button> 
    </div> }
    {props.children}
    </div>
  );
}
