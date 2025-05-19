import { Context } from '@lens-protocol/client'
import React from 'react'
import { Connector } from 'wagmi'

export default function ConnectorOption(props:Connector) {
  return (
    <div>
        <div className="flex items-center gap-2 m-auto">
            { props.icon && <img src={props.icon} alt={props.name} className="w-8 h-8 rounded-full" /> }
            { !props.icon && <span className="w-8 h-8 rounded-full flex flex-col items-center justify-center bg-slate-600 font-600" >{props.name[0].toUpperCase()}</span> }
            <span className="text-sm font-medium">{props.name}</span>
        </div>
        {/* <p className="text-xs text-gray-500">{props.name}</p> */}
    </div>
  )
}
