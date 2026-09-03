'use client'
import { Button } from '@/components/ui/button'
import React from 'react'

export default function PrimaryButton({children, handleClick=()=>{}}) {
  return (
      <Button
            onClick={handleClick}
          className='flex items-center gap-2 bg-azulMarino hover:bg-azulMarino/90 text-white font-bold shadow-sm'>
          {children}
    </Button>
  )
}
