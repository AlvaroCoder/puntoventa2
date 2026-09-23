import { cn } from '@/lib/utils'
import React from 'react'

export default function Title2({className="",children}) {
  return (
    <h1 className={cn(className,'font-bold text-azulMarino text-xl')}>
        {children}
    </h1>
  )
};
