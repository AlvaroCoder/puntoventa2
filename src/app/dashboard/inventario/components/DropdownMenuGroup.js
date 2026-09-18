'use client'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Button from '@/elements/Button'
import { ChevronDown, Warehouse } from 'lucide-react'
import React from 'react'

export default function DropdownMenuGroup({ items=[], groupBySelected, setGroupBySelected }) {
    
  return (
      <DropdownMenu className="w-full bg-white">
          <DropdownMenuTrigger asChild >
              
              <button
                        className="flex items-center gap-2 px-3 h-9 rounded-lg text-xs font-medium transition-colors"
                        style={{
                            border: '0.5px solid rgba(31,47,87,0.18)',
                            background: '#fff',
                            color: '#1F2F57',
                        }}
                    >
                        <Warehouse size={14} color="#3960A9" />
                        <span>
                            Agrupar por{' '}
                            <strong style={{ color: '#1F2F57' }}>{ groupBySelected }</strong>
                        </span>
                        <ChevronDown size={13} color="rgba(31,47,87,0.5)" />
                    </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-44" align="end" sideOffset={5}>
              {
                  items.map((item, index) => (
                    <DropdownMenuItem key={index} onClick={() => setGroupBySelected(item)}>
                        {item}
                    </DropdownMenuItem>
                  ))
              }
          </DropdownMenuContent>
    </DropdownMenu>
  )
}
