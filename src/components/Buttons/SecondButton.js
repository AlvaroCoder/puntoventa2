'use client'
import React from 'react'
import { Button } from '../ui/button'

export default function SecondButton({children, handleClick=()=>{}}) {
  return (
      <Button
          onClick={handleClick}
        className="flex items-center gap-2 bg-verdeAgua hover:bg-verdeAgua/90 font-bold text-azulMarino"
      >
          {children}
    </Button>
  )
}
