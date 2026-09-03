'use client'
import React from 'react'
import { Button } from '../ui/button'

export default function NegativeButton({children, handleClick=()=>{}}) {
  return (
      <Button
          onClick={handleClick}
          className="font-bold flex flex-row items-center gap-4 bg-white border-2 border-azulMarino hover:border-azulMarino/90 shadow-sm hover:bg-white text-azulMarino"
      >
          {children}
    </Button>
  )
}